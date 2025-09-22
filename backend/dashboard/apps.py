"""
Dashboard app configuration for MedixScan
Handles activity tracking, analytics, and dashboard data aggregation
"""
from django.apps import AppConfig


class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dashboard'
    verbose_name = 'Dashboard Analytics'
    
    def ready(self):
        """Import signals when app is ready"""
        try:
            import dashboard.signals
        except ImportError:
            pass