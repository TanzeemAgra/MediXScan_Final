"""
Dashboard Analytics Service for MedixScan
Implements soft-coded activity tracking and metrics calculation
"""
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from django.db.models import Count, Avg, Sum, Q, F
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.cache import cache

from .models import ActivityLog, ActivityType, DashboardMetric, UserSession
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment
from medical_records.models import MedicalRecord


class DashboardAnalyticsService:
    """
    Comprehensive dashboard analytics with soft-coded configuration
    """
    
    def __init__(self):
        self.cache_timeout = 300  # 5 minutes default cache
        self.soft_config = self._load_soft_config()
    
    def _load_soft_config(self) -> Dict[str, Any]:
        """Load soft-coded dashboard configuration"""
        return {
            'time_ranges': {
                'today': {'days': 0},
                'week': {'days': 7},
                'month': {'days': 30},
                'quarter': {'days': 90},
                'year': {'days': 365}
            },
            'metrics': {
                'anonymizer_activity': {
                    'display_name': 'Anonymizer Usage',
                    'icon': 'shield-check',
                    'color': 'success'
                },
                'report_corrections': {
                    'display_name': 'Report Corrections',
                    'icon': 'edit-3',
                    'color': 'warning'
                },
                'user_sessions': {
                    'display_name': 'Active Users',
                    'icon': 'users',
                    'color': 'info'
                },
                'system_health': {
                    'display_name': 'System Health',
                    'icon': 'activity',
                    'color': 'primary'
                }
            },
            'charts': {
                'activity_timeline': {
                    'type': 'line',
                    'title': 'Activity Timeline',
                    'categories': ['anonymizer', 'report_correction']
                },
                'user_engagement': {
                    'type': 'donut',
                    'title': 'User Engagement',
                    'metrics': ['active_sessions', 'page_views', 'actions']
                }
            }
        }
    
    def get_overview_statistics(self) -> Dict[str, Any]:
        """Get comprehensive dashboard overview"""
        cache_key = 'dashboard_overview'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Basic statistics
        stats = {
            'total_patients': Patient.objects.count(),
            'total_doctors': Doctor.objects.count(),
            'total_appointments': Appointment.objects.count(),
            'active_users': self._get_active_users_count(),
            
            # Today's activity
            'today_appointments': Appointment.objects.filter(
                created_at__gte=today_start
            ).count(),
            'today_activities': ActivityLog.objects.filter(
                timestamp__gte=today_start
            ).count(),
            
            # Anonymizer specific
            'anonymizer_usage': self._get_anonymizer_statistics(),
            'report_corrections': self._get_report_correction_statistics(),
            
            # System health
            'system_health': self._calculate_system_health(),
            
            # Trends
            'trends': self._calculate_trends()
        }
        
        cache.set(cache_key, stats, self.cache_timeout)
        return stats
    
    def get_activity_statistics(self, time_range: str = 'week') -> Dict[str, Any]:
        """Get activity statistics for specified time range"""
        cache_key = f'activity_stats_{time_range}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        start_date = self._get_date_range(time_range)
        
        # Activity by type
        activity_stats = ActivityLog.objects.filter(
            timestamp__gte=start_date
        ).values('activity_type__category').annotate(
            count=Count('id'),
            avg_duration=Avg('duration')
        ).order_by('-count')
        
        # User engagement
        user_stats = UserSession.objects.filter(
            login_time__gte=start_date
        ).aggregate(
            total_sessions=Count('id'),
            avg_duration=Avg(F('last_activity') - F('login_time')),
            total_page_views=Sum('page_views'),
            total_actions=Sum('actions_performed')
        )
        
        stats = {
            'time_range': time_range,
            'start_date': start_date.isoformat(),
            'activity_by_type': list(activity_stats),
            'user_engagement': user_stats,
            'top_activities': self._get_top_activities(start_date),
            'hourly_distribution': self._get_hourly_activity_distribution(start_date)
        }
        
        cache.set(cache_key, stats, self.cache_timeout)
        return stats
    
    def get_anonymizer_analytics(self) -> Dict[str, Any]:
        """Get detailed anonymizer usage analytics"""
        cache_key = 'anonymizer_analytics'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        anonymizer_logs = ActivityLog.objects.filter(
            activity_type__category='anonymizer'
        )
        
        # Basic metrics
        total_anonymizations = anonymizer_logs.count()
        
        # File type analysis (from metadata)
        file_types = {}
        processing_times = []
        
        for log in anonymizer_logs.filter(metadata__isnull=False)[:100]:  # Limit for performance
            if 'file_format' in log.metadata:
                format_type = log.metadata['file_format']
                file_types[format_type] = file_types.get(format_type, 0) + 1
            
            if log.duration:
                processing_times.append(log.duration)
        
        # Recent activity
        recent_activity = anonymizer_logs.order_by('-timestamp')[:10].values(
            'action', 'timestamp', 'user__username', 'metadata'
        )
        
        analytics = {
            'total_anonymizations': total_anonymizations,
            'file_types_processed': file_types,
            'average_processing_time': sum(processing_times) / len(processing_times) if processing_times else 0,
            'recent_activity': list(recent_activity),
            'usage_by_day': self._get_daily_usage('anonymizer'),
            'top_users': self._get_top_users_for_activity('anonymizer')
        }
        
        cache.set(cache_key, analytics, self.cache_timeout)
        return analytics
    
    def get_report_correction_analytics(self) -> Dict[str, Any]:
        """Get detailed report correction analytics"""
        cache_key = 'report_correction_analytics'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        correction_logs = ActivityLog.objects.filter(
            activity_type__category='report_correction'
        )
        
        total_corrections = correction_logs.count()
        
        # Correction types analysis
        correction_types = {}
        for log in correction_logs.filter(metadata__isnull=False)[:100]:
            if 'correction_type' in log.metadata:
                correction_type = log.metadata['correction_type']
                correction_types[correction_type] = correction_types.get(correction_type, 0) + 1
        
        # Recent activity
        recent_activity = correction_logs.order_by('-timestamp')[:10].values(
            'action', 'timestamp', 'user__username', 'metadata'
        )
        
        analytics = {
            'total_corrections': total_corrections,
            'correction_types': correction_types,
            'recent_activity': list(recent_activity),
            'usage_by_day': self._get_daily_usage('report_correction'),
            'top_users': self._get_top_users_for_activity('report_correction')
        }
        
        cache.set(cache_key, analytics, self.cache_timeout)
        return analytics
    
    def log_activity(self, activity_type: str, action: str, user=None, **kwargs) -> ActivityLog:
        """Log activity with soft-coded metadata"""
        try:
            # Get or create activity type
            activity_type_obj, created = ActivityType.objects.get_or_create(
                name=activity_type,
                defaults={
                    'category': kwargs.get('category', 'system'),
                    'description': kwargs.get('description', ''),
                }
            )
            
            # Extract metadata
            metadata = kwargs.get('metadata', {})
            
            # Create activity log
            log = ActivityLog.objects.create(
                activity_type=activity_type_obj,
                user=user,
                action=action,
                description=kwargs.get('description', action),
                severity=kwargs.get('severity', 'info'),
                metadata=metadata,
                ip_address=kwargs.get('ip_address'),
                user_agent=kwargs.get('user_agent'),
                session_key=kwargs.get('session_key'),
                duration=kwargs.get('duration')
            )
            
            # Update metrics asynchronously
            self._update_related_metrics(activity_type, action, metadata)
            
            return log
            
        except Exception as e:
            # Fail silently to avoid breaking main functionality
            print(f"Activity logging failed: {e}")
            return None
    
    def _get_active_users_count(self) -> int:
        """Get count of currently active users"""
        threshold = timezone.now() - timedelta(minutes=30)
        return UserSession.objects.filter(
            last_activity__gte=threshold,
            logout_time__isnull=True
        ).count()
    
    def _get_anonymizer_statistics(self) -> Dict[str, Any]:
        """Get anonymizer-specific statistics"""
        anonymizer_logs = ActivityLog.objects.filter(
            activity_type__category='anonymizer'
        )
        
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        return {
            'total_usage': anonymizer_logs.count(),
            'today_usage': anonymizer_logs.filter(timestamp__gte=today_start).count(),
            'avg_processing_time': anonymizer_logs.exclude(
                duration__isnull=True
            ).aggregate(avg=Avg('duration'))['avg'] or 0
        }
    
    def _get_report_correction_statistics(self) -> Dict[str, Any]:
        """Get report correction statistics"""
        correction_logs = ActivityLog.objects.filter(
            activity_type__category='report_correction'
        )
        
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        return {
            'total_corrections': correction_logs.count(),
            'today_corrections': correction_logs.filter(timestamp__gte=today_start).count(),
            'avg_correction_time': correction_logs.exclude(
                duration__isnull=True
            ).aggregate(avg=Avg('duration'))['avg'] or 0
        }
    
    def _calculate_system_health(self) -> Dict[str, Any]:
        """Calculate system health metrics"""
        recent_errors = ActivityLog.objects.filter(
            severity='error',
            timestamp__gte=timezone.now() - timedelta(hours=24)
        ).count()
        
        total_recent_activities = ActivityLog.objects.filter(
            timestamp__gte=timezone.now() - timedelta(hours=24)
        ).count()
        
        error_rate = (recent_errors / total_recent_activities * 100) if total_recent_activities > 0 else 0
        
        # Simple health scoring
        if error_rate < 1:
            health_status = 'excellent'
            health_score = 100
        elif error_rate < 5:
            health_status = 'good'
            health_score = 85
        elif error_rate < 10:
            health_status = 'fair'
            health_score = 70
        else:
            health_status = 'poor'
            health_score = 50
        
        return {
            'status': health_status,
            'score': health_score,
            'error_rate': round(error_rate, 2),
            'recent_errors': recent_errors,
            'total_activities': total_recent_activities
        }
    
    def _calculate_trends(self) -> Dict[str, Any]:
        """Calculate various trends for dashboard"""
        now = timezone.now()
        
        # Compare current week with previous week
        current_week_start = now - timedelta(days=7)
        previous_week_start = now - timedelta(days=14)
        
        current_week_activities = ActivityLog.objects.filter(
            timestamp__gte=current_week_start
        ).count()
        
        previous_week_activities = ActivityLog.objects.filter(
            timestamp__gte=previous_week_start,
            timestamp__lt=current_week_start
        ).count()
        
        activity_trend = self._calculate_percentage_change(
            current_week_activities, previous_week_activities
        )
        
        return {
            'activity_trend': activity_trend,
            'trending_up': activity_trend > 0,
            'period': 'week'
        }
    
    def _get_date_range(self, range_name: str) -> datetime:
        """Get start date for time range"""
        days = self.soft_config['time_ranges'].get(range_name, {'days': 7})['days']
        return timezone.now() - timedelta(days=days)
    
    def _get_top_activities(self, start_date: datetime) -> List[Dict]:
        """Get top activities for time period"""
        return list(
            ActivityLog.objects.filter(
                timestamp__gte=start_date
            ).values('action').annotate(
                count=Count('id')
            ).order_by('-count')[:5]
        )
    
    def _get_hourly_activity_distribution(self, start_date: datetime) -> Dict[str, int]:
        """Get activity distribution by hour"""
        from django.db.models import Extract
        
        hourly_data = ActivityLog.objects.filter(
            timestamp__gte=start_date
        ).extra(
            select={'hour': 'EXTRACT(hour FROM timestamp)'}
        ).values('hour').annotate(
            count=Count('id')
        ).order_by('hour')
        
        # Initialize all hours with 0
        distribution = {str(i): 0 for i in range(24)}
        
        # Fill in actual data
        for item in hourly_data:
            hour = str(int(item['hour']))
            distribution[hour] = item['count']
        
        return distribution
    
    def _get_daily_usage(self, category: str, days: int = 30) -> Dict[str, int]:
        """Get daily usage for a category"""
        start_date = timezone.now() - timedelta(days=days)
        
        daily_data = ActivityLog.objects.filter(
            activity_type__category=category,
            timestamp__gte=start_date
        ).extra(
            select={'date': 'DATE(timestamp)'}
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        return {
            str(item['date']): item['count'] 
            for item in daily_data
        }
    
    def _get_top_users_for_activity(self, category: str, limit: int = 5) -> List[Dict]:
        """Get top users for specific activity category"""
        return list(
            ActivityLog.objects.filter(
                activity_type__category=category,
                user__isnull=False
            ).values('user__username', 'user__first_name', 'user__last_name').annotate(
                count=Count('id')
            ).order_by('-count')[:limit]
        )
    
    def _update_related_metrics(self, activity_type: str, action: str, metadata: Dict):
        """Update dashboard metrics based on activity"""
        # This would be implemented to update real-time metrics
        # For now, we'll just cache clear to trigger recalculation
        cache.delete_pattern('dashboard_*')
        cache.delete_pattern('activity_stats_*')
    
    def _calculate_percentage_change(self, current: int, previous: int) -> float:
        """Calculate percentage change between two values"""
        if previous == 0:
            return 100 if current > 0 else 0
        return round(((current - previous) / previous) * 100, 2)


# Global instance
dashboard_service = DashboardAnalyticsService()