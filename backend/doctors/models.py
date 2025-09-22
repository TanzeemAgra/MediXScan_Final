from django.db import models
from django.conf import settings

class Doctor(models.Model):
    """Doctor Profile Model"""
    
    SPECIALIZATIONS = (
        ('cardiology', 'Cardiology'),
        ('dermatology', 'Dermatology'),
        ('endocrinology', 'Endocrinology'),
        ('gastroenterology', 'Gastroenterology'),
        ('general_practice', 'General Practice'),
        ('gynecology', 'Gynecology'),
        ('neurology', 'Neurology'),
        ('oncology', 'Oncology'),
        ('orthopedics', 'Orthopedics'),
        ('pediatrics', 'Pediatrics'),
        ('psychiatry', 'Psychiatry'),
        ('radiology', 'Radiology'),
        ('surgery', 'Surgery'),
        ('urology', 'Urology'),
        ('other', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('retired', 'Retired'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    doctor_id = models.CharField(max_length=20, unique=True, editable=False)
    
    # Professional Information
    medical_license = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=50, choices=SPECIALIZATIONS)
    sub_specialization = models.CharField(max_length=100, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Education & Qualifications
    medical_school = models.CharField(max_length=200, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    certifications = models.TextField(blank=True)
    
    # Hospital/Clinic Information
    department = models.CharField(max_length=100, blank=True)
    room_number = models.CharField(max_length=20, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Schedule & Availability
    availability = models.JSONField(default=dict)  # Store weekly schedule
    max_patients_per_day = models.PositiveIntegerField(default=20)
    consultation_duration = models.PositiveIntegerField(default=30)  # in minutes
    
    # Contact & Bio
    bio = models.TextField(blank=True)
    languages_spoken = models.CharField(max_length=200, blank=True)
    
    # Status & System Fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctors'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.doctor_id:
            # Generate doctor ID
            last_doctor = Doctor.objects.order_by('-id').first()
            if last_doctor:
                last_id = int(last_doctor.doctor_id.split('D')[1])
                self.doctor_id = f'D{str(last_id + 1).zfill(6)}'
            else:
                self.doctor_id = 'D000001'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.get_specialization_display()}"

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum([review.rating for review in reviews]) / len(reviews)
        return 0.0


class DoctorSchedule(models.Model):
    """Doctor's Weekly Schedule"""
    
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    break_start = models.TimeField(null=True, blank=True)
    break_end = models.TimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'doctor_schedules'
        unique_together = ['doctor', 'day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.doctor.user.get_full_name()} - {self.get_day_of_week_display()} ({self.start_time}-{self.end_time})"


class DoctorReview(models.Model):
    """Patient reviews for doctors"""
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    review_text = models.TextField(blank=True)
    appointment = models.OneToOneField(
        'appointments.Appointment', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctor_reviews'
        unique_together = ['doctor', 'patient', 'appointment']
    
    def __str__(self):
        return f"{self.doctor.user.get_full_name()} - {self.rating} stars"