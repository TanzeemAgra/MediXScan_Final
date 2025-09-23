from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class MedicalRecord(models.Model):
    """Medical Record model for storing patient medical information"""
    patient_name = models.CharField(max_length=255)
    record_id = models.CharField(max_length=100, unique=True)
    record_type = models.CharField(max_length=50, default='general')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.patient_name} - {self.record_id}"

    class Meta:
        ordering = ['-created_at']


class ReportCorrectionRequest(models.Model):
    """Model for storing report correction requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    request_id = models.CharField(max_length=100, unique=True)
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True, blank=True)
    medical_record_id_fallback = models.CharField(max_length=100, null=True, blank=True)
    original_text = models.TextField()
    corrected_text = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Correction Request {self.request_id}"

    class Meta:
        ordering = ['-created_at']


class ReportCorrectionVersion(models.Model):
    """Model for storing different versions of corrections"""
    correction_request = models.ForeignKey(ReportCorrectionRequest, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField(default=1)
    corrected_text = models.TextField()
    correction_notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Version {self.version_number} for {self.correction_request.request_id}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ['correction_request', 'version_number']


class AnonymizationRequest(models.Model):
    """Model for storing anonymization requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    request_id = models.CharField(max_length=100, unique=True)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    anonymization_level = models.CharField(max_length=50, default='standard')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Anonymization Request {self.request_id}"

    class Meta:
        ordering = ['-created_at']


class AnonymizationAuditLog(models.Model):
    """Model for storing audit logs of anonymization processes"""
    request = models.ForeignKey(AnonymizationRequest, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=100)
    details = models.TextField()
    performed_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit Log for {self.request.request_id} - {self.action}"

    class Meta:
        ordering = ['-timestamp']


class AnonymizationConfiguration(models.Model):
    """Model for storing anonymization configuration settings"""
    name = models.CharField(max_length=100, unique=True)
    settings = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Anonymization Config: {self.name}"

    class Meta:
        ordering = ['name']