from django.db import models
from django.conf import settings

class Patient(models.Model):
    """Patient Profile Model"""
    
    INSURANCE_STATUS = (
        ('insured', 'Insured'),
        ('uninsured', 'Uninsured'),
        ('pending', 'Pending Verification'),
    )
    
    MARITAL_STATUS = (
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    
    # Insurance Information
    insurance_provider = models.CharField(max_length=100, blank=True)
    insurance_number = models.CharField(max_length=50, blank=True)
    insurance_status = models.CharField(max_length=20, choices=INSURANCE_STATUS, default='pending')
    
    # Personal Details
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_relation = models.CharField(max_length=50, blank=True)
    emergency_contact_phone = models.CharField(max_length=17, blank=True)
    
    # Medical Information
    primary_physician = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='primary_patients',
        limit_choices_to={'user_type': 'doctor'}
    )
    
    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'patients'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.patient_id:
            # Generate patient ID
            last_patient = Patient.objects.order_by('-id').first()
            if last_patient:
                last_id = int(last_patient.patient_id.split('P')[1])
                self.patient_id = f'P{str(last_id + 1).zfill(6)}'
            else:
                self.patient_id = 'P000001'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.patient_id} - {self.user.get_full_name()}"


class MedicalHistory(models.Model):
    """Medical History Records"""
    
    SEVERITY_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    condition = models.CharField(max_length=200)
    diagnosed_date = models.DateField()
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='low')
    current_status = models.CharField(max_length=100)  # Active, Resolved, Chronic, etc.
    notes = models.TextField(blank=True)
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        limit_choices_to={'user_type': 'doctor'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_histories'
        ordering = ['-diagnosed_date']
    
    def __str__(self):
        return f"{self.patient.patient_id} - {self.condition}"


class Allergy(models.Model):
    """Patient Allergies"""
    
    ALLERGY_TYPES = (
        ('food', 'Food'),
        ('medication', 'Medication'),
        ('environmental', 'Environmental'),
        ('other', 'Other'),
    )
    
    SEVERITY_LEVELS = (
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
        ('life_threatening', 'Life Threatening'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='allergies')
    allergen = models.CharField(max_length=200)
    allergy_type = models.CharField(max_length=20, choices=ALLERGY_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    reaction = models.TextField()
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'allergies'
        verbose_name_plural = 'Allergies'
    
    def __str__(self):
        return f"{self.patient.patient_id} - {self.allergen}"


class Medication(models.Model):
    """Patient Current Medications"""
    
    FREQUENCY_CHOICES = (
        ('once_daily', 'Once Daily'),
        ('twice_daily', 'Twice Daily'),
        ('three_times_daily', 'Three Times Daily'),
        ('four_times_daily', 'Four Times Daily'),
        ('as_needed', 'As Needed'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    prescribing_doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        limit_choices_to={'user_type': 'doctor'}
    )
    instructions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medications'
    
    def __str__(self):
        return f"{self.patient.patient_id} - {self.medication_name}"