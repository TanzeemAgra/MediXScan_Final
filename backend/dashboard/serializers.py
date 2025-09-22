"""
Dashboard serializers for MedixScan API responses
Implements soft-coded serialization with flexible data structures
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ActivityLog, ActivityType, DashboardMetric, UserSession


class ActivityTypeSerializer(serializers.ModelSerializer):
    """Serializer for activity types"""
    
    class Meta:
        model = ActivityType
        fields = [
            'id', 'name', 'category', 'description', 'is_active',
            'icon', 'color', 'config', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for activity logs"""
    activity_type_name = serializers.CharField(source='activity_type.name', read_only=True)
    activity_category = serializers.CharField(source='activity_type.category', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    user_full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'activity_type', 'activity_type_name', 'activity_category',
            'user', 'username', 'user_full_name', 'action', 'description',
            'severity', 'metadata', 'timestamp', 'duration'
        ]
        read_only_fields = ['timestamp']
    
    def get_user_full_name(self, obj):
        """Get user's full name or username"""
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return None


class DashboardMetricSerializer(serializers.ModelSerializer):
    """Serializer for dashboard metrics"""
    change_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = DashboardMetric
        fields = [
            'id', 'name', 'display_name', 'description', 'category',
            'metric_type', 'aggregation', 'value', 'previous_value',
            'change_percentage', 'config', 'unit', 'is_active',
            'last_calculated'
        ]
    
    def get_change_percentage(self, obj):
        """Calculate percentage change"""
        return obj.calculate_change_percentage()


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for user sessions"""
    username = serializers.CharField(source='user.username', read_only=True)
    duration_seconds = serializers.SerializerMethodField()
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'username', 'session_key', 'ip_address',
            'login_time', 'last_activity', 'logout_time', 'page_views',
            'actions_performed', 'duration_seconds', 'is_active', 'metadata'
        ]
    
    def get_duration_seconds(self, obj):
        """Get session duration in seconds"""
        return obj.duration.total_seconds()


class DashboardOverviewSerializer(serializers.Serializer):
    """Serializer for dashboard overview data"""
    total_patients = serializers.IntegerField()
    total_doctors = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    active_users = serializers.IntegerField()
    
    today_appointments = serializers.IntegerField()
    today_activities = serializers.IntegerField()
    
    anonymizer_usage = serializers.DictField()
    report_corrections = serializers.DictField()
    system_health = serializers.DictField()
    trends = serializers.DictField()


class ActivityStatisticsSerializer(serializers.Serializer):
    """Serializer for activity statistics"""
    time_range = serializers.CharField()
    start_date = serializers.CharField()
    activity_by_type = serializers.ListField()
    user_engagement = serializers.DictField()
    top_activities = serializers.ListField()
    hourly_distribution = serializers.DictField()


class AnonymizerAnalyticsSerializer(serializers.Serializer):
    """Serializer for anonymizer analytics"""
    total_anonymizations = serializers.IntegerField()
    file_types_processed = serializers.DictField()
    average_processing_time = serializers.FloatField()
    recent_activity = serializers.ListField()
    usage_by_day = serializers.DictField()
    top_users = serializers.ListField()


class ReportCorrectionAnalyticsSerializer(serializers.Serializer):
    """Serializer for report correction analytics"""
    total_corrections = serializers.IntegerField()
    correction_types = serializers.DictField()
    recent_activity = serializers.ListField()
    usage_by_day = serializers.DictField()
    top_users = serializers.ListField()


class ChartDataSerializer(serializers.Serializer):
    """Serializer for chart data"""
    chart_type = serializers.CharField()
    title = serializers.CharField()
    labels = serializers.ListField()
    datasets = serializers.ListField()
    options = serializers.DictField(required=False)


class DashboardConfigSerializer(serializers.Serializer):
    """Serializer for dashboard configuration"""
    widgets = serializers.ListField()
    metrics = serializers.DictField()
    charts = serializers.DictField()
    refresh_intervals = serializers.DictField()
    permissions = serializers.DictField()


class RealtimeUpdateSerializer(serializers.Serializer):
    """Serializer for real-time dashboard updates"""
    update_type = serializers.CharField()
    timestamp = serializers.DateTimeField()
    data = serializers.DictField()
    affected_widgets = serializers.ListField()