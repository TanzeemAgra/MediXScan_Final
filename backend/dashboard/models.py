"""
Dashboard models for MedixScan - Activity tracking and analytics
Implements soft-coded activity logging with flexible metrics
"""
import json
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.serializers.json import DjangoJSONEncoder

User = get_user_model()


class ActivityType(models.Model):
    """
    Soft-coded activity types for flexible logging
    """
    CATEGORY_CHOICES = [
        ('anonymizer', 'Anonymizer'),
        ('report_correction', 'Report Correction'),
        ('patient_management', 'Patient Management'),
        ('appointment', 'Appointment'),
        ('medical_record', 'Medical Record'),
        ('authentication', 'Authentication'),
        ('system', 'System'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class for UI")
    color = models.CharField(max_length=20, default='primary', help_text="Color theme for UI")
    
    # Soft-coded configuration
    config = models.JSONField(
        default=dict,
        blank=True,
        help_text="Flexible configuration for activity type",
        encoder=DjangoJSONEncoder
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_activity_type'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.get_category_display()}: {self.name}"


class ActivityLog(models.Model):
    """
    Comprehensive activity logging with soft-coded metadata
    """
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success'),
    ]
    
    activity_type = models.ForeignKey(ActivityType, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Core activity data
    action = models.CharField(max_length=100)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='info')
    
    # Soft-coded metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Flexible metadata for activity context",
        encoder=DjangoJSONEncoder
    )
    
    # System tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    session_key = models.CharField(max_length=40, blank=True)
    
    # Timing
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.FloatField(null=True, blank=True, help_text="Duration in seconds")
    
    class Meta:
        db_table = 'dashboard_activity_log'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['activity_type', '-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]
    
    def __str__(self):
        username = self.user.username if self.user else 'Anonymous'
        return f"{username}: {self.action} ({self.timestamp})"


class DashboardMetric(models.Model):
    """
    Soft-coded dashboard metrics for flexible KPI tracking
    """
    METRIC_TYPES = [
        ('counter', 'Counter'),
        ('gauge', 'Gauge'),
        ('histogram', 'Histogram'),
        ('rate', 'Rate'),
    ]
    
    AGGREGATION_TYPES = [
        ('sum', 'Sum'),
        ('avg', 'Average'),
        ('min', 'Minimum'),
        ('max', 'Maximum'),
        ('count', 'Count'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES)
    aggregation = models.CharField(max_length=20, choices=AGGREGATION_TYPES)
    
    # Current value
    value = models.FloatField(default=0)
    previous_value = models.FloatField(default=0)
    
    # Soft-coded configuration
    config = models.JSONField(
        default=dict,
        blank=True,
        help_text="Metric configuration (thresholds, formatting, etc.)",
        encoder=DjangoJSONEncoder
    )
    
    # Metadata
    unit = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_calculated = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'dashboard_metric'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.display_name}: {self.value} {self.unit}".strip()
    
    def calculate_change_percentage(self):
        """Calculate percentage change from previous value"""
        if self.previous_value == 0:
            return 100 if self.value > 0 else 0
        return ((self.value - self.previous_value) / self.previous_value) * 100


class UserSession(models.Model):
    """
    User session tracking for dashboard analytics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    
    # Session data
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Timing
    login_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    
    # Analytics
    page_views = models.IntegerField(default=0)
    actions_performed = models.IntegerField(default=0)
    
    # Soft-coded session metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        encoder=DjangoJSONEncoder
    )
    
    class Meta:
        db_table = 'dashboard_user_session'
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"{self.user.username} - {self.login_time}"
    
    @property
    def duration(self):
        """Calculate session duration"""
        end_time = self.logout_time or timezone.now()
        return end_time - self.login_time
    
    @property
    def is_active(self):
        """Check if session is still active (within 30 minutes)"""
        return (timezone.now() - self.last_activity).total_seconds() < 1800