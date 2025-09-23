from django.db import models
from django.conf import settings

class Notification(models.Model):
    """System Notifications"""
    
    NOTIFICATION_TYPES = (
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_confirmation', 'Appointment Confirmation'),
        ('appointment_cancellation', 'Appointment Cancellation'),
        ('lab_result_ready', 'Lab Result Ready'),
        ('prescription_ready', 'Prescription Ready'),
        ('payment_reminder', 'Payment Reminder'),
        ('system_alert', 'System Alert'),
        ('birthday_reminder', 'Birthday Reminder'),
        ('medication_reminder', 'Medication Reminder'),
    )
    
    PRIORITY_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')
    
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Delivery channels
    send_email = models.BooleanField(default=True)
    send_sms = models.BooleanField(default=False)
    send_push = models.BooleanField(default=True)
    
    # Status fields
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)
    
    # Scheduling
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Related objects (generic relation or specific FK)
    related_appointment = models.ForeignKey('appointments.Appointment', on_delete=models.CASCADE, null=True, blank=True)
    # related_prescription = models.ForeignKey('medical_records.Prescription', on_delete=models.CASCADE, null=True, blank=True)  # TODO: Create Prescription model
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        from django.utils import timezone
        self.is_read = True
        self.read_at = timezone.now()
        self.save()


class NotificationPreference(models.Model):
    """User notification preferences"""
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email preferences
    email_appointment_reminders = models.BooleanField(default=True)
    email_lab_results = models.BooleanField(default=True)
    email_prescriptions = models.BooleanField(default=True)
    email_marketing = models.BooleanField(default=False)
    
    # SMS preferences
    sms_appointment_reminders = models.BooleanField(default=False)
    sms_urgent_notifications = models.BooleanField(default=True)
    
    # Push notification preferences
    push_appointment_reminders = models.BooleanField(default=True)
    push_lab_results = models.BooleanField(default=True)
    push_general_notifications = models.BooleanField(default=True)
    
    # Timing preferences
    reminder_hours_before = models.PositiveIntegerField(default=24)  # Hours before appointment
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_preferences'
    
    def __str__(self):
        return f"Notification preferences for {self.user.get_full_name()}"