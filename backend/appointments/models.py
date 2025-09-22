from django.db import models
from django.conf import settings

class Appointment(models.Model):
    """Appointment Management Model"""
    
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    )
    
    APPOINTMENT_TYPES = (
        ('consultation', 'Consultation'),
        ('follow_up', 'Follow-up'),
        ('emergency', 'Emergency'),
        ('routine_checkup', 'Routine Checkup'),
        ('vaccination', 'Vaccination'),
        ('surgery', 'Surgery'),
        ('diagnostic', 'Diagnostic'),
        ('therapy', 'Therapy'),
    )
    
    PRIORITY_LEVELS = (
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    appointment_id = models.CharField(max_length=20, unique=True, editable=False)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='appointments')
    
    # Appointment Details
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration = models.PositiveIntegerField(default=30)  # in minutes
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES, default='consultation')
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='normal')
    
    # Reason and Notes
    chief_complaint = models.TextField()
    symptoms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    # Status and Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    is_virtual = models.BooleanField(default=False)
    virtual_meeting_link = models.URLField(blank=True)
    
    # Billing Information
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    insurance_claim = models.CharField(max_length=50, blank=True)
    
    # System Fields
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_appointments')
    cancelled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_appointments')
    cancellation_reason = models.TextField(blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date', 'appointment_time']
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:
            # Generate appointment ID
            last_appointment = Appointment.objects.order_by('-id').first()
            if last_appointment:
                last_id = int(last_appointment.appointment_id.split('A')[1])
                self.appointment_id = f'A{str(last_id + 1).zfill(8)}'
            else:
                self.appointment_id = 'A00000001'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.appointment_id} - {self.patient.user.get_full_name()} with Dr. {self.doctor.user.get_full_name()}"

    @property
    def is_past_due(self):
        from datetime import datetime, date, time
        appointment_datetime = datetime.combine(self.appointment_date, self.appointment_time)
        return appointment_datetime < datetime.now()


class AppointmentHistory(models.Model):
    """Track appointment status changes"""
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='history')
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    change_reason = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'appointment_history'
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.appointment.appointment_id}: {self.previous_status} -> {self.new_status}"


class TimeSlot(models.Model):
    """Available time slots for appointments"""
    
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='time_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    is_blocked = models.BooleanField(default=False)  # For doctor breaks, holidays
    block_reason = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'time_slots'
        unique_together = ['doctor', 'date', 'start_time']
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"Dr. {self.doctor.user.get_full_name()} - {self.date} {self.start_time}-{self.end_time}"