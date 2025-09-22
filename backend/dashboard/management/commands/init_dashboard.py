"""
Management command to populate dashboard with initial activity types and sample data
"""
from django.core.management.base import BaseCommand
from dashboard.models import ActivityType, DashboardMetric
from django.utils import timezone


class Command(BaseCommand):
    help = 'Initialize dashboard with activity types and sample metrics'

    def handle(self, *args, **options):
        """Create initial dashboard configuration"""
        
        # Create activity types
        activity_types = [
            {
                'name': 'text_anonymization',
                'category': 'anonymizer',
                'description': 'Text anonymization operations',
                'icon': 'shield-check',
                'color': 'success',
                'config': {
                    'track_processing_time': True,
                    'track_file_size': True,
                    'track_compliance': True
                }
            },
            {
                'name': 'file_processing',
                'category': 'anonymizer',
                'description': 'File upload and processing operations',
                'icon': 'upload',
                'color': 'primary',
                'config': {
                    'track_file_formats': True,
                    'track_file_size': True,
                    'track_processing_method': True
                }
            },
            {
                'name': 'text_anonymization_failed',
                'category': 'anonymizer',
                'description': 'Failed anonymization attempts',
                'icon': 'alert-triangle',
                'color': 'danger',
                'config': {
                    'track_errors': True,
                    'alert_on_failure': True
                }
            },
            {
                'name': 'report_correction',
                'category': 'report_correction',
                'description': 'Report correction submissions',
                'icon': 'edit-3',
                'color': 'warning',
                'config': {
                    'track_correction_types': True,
                    'track_confidence': True,
                    'track_text_length': True
                }
            },
            {
                'name': 'user_login',
                'category': 'authentication',
                'description': 'User login activities',
                'icon': 'log-in',
                'color': 'info',
                'config': {
                    'track_ip': True,
                    'track_device': True
                }
            },
            {
                'name': 'user_logout',
                'category': 'authentication',
                'description': 'User logout activities',
                'icon': 'log-out',
                'color': 'info',
                'config': {
                    'track_session_duration': True
                }
            }
        ]
        
        for activity_data in activity_types:
            activity_type, created = ActivityType.objects.get_or_create(
                name=activity_data['name'],
                defaults=activity_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created activity type: {activity_type.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Activity type already exists: {activity_type.name}')
                )
        
        # Create dashboard metrics
        metrics = [
            {
                'name': 'total_anonymizations',
                'display_name': 'Total Anonymizations',
                'description': 'Total number of anonymization operations',
                'category': 'anonymizer',
                'metric_type': 'counter',
                'aggregation': 'count',
                'value': 0,
                'unit': 'operations',
                'config': {
                    'color': 'success',
                    'icon': 'shield-check',
                    'threshold_warning': 1000,
                    'threshold_critical': 5000
                }
            },
            {
                'name': 'total_file_uploads',
                'display_name': 'Total File Uploads',
                'description': 'Total number of file uploads processed',
                'category': 'anonymizer',
                'metric_type': 'counter',
                'aggregation': 'count',
                'value': 0,
                'unit': 'files',
                'config': {
                    'color': 'primary',
                    'icon': 'upload',
                    'threshold_warning': 500,
                    'threshold_critical': 2000
                }
            },
            {
                'name': 'total_report_corrections',
                'display_name': 'Total Report Corrections',
                'description': 'Total number of report corrections',
                'category': 'report_correction',
                'metric_type': 'counter',
                'aggregation': 'count',
                'value': 0,
                'unit': 'corrections',
                'config': {
                    'color': 'warning',
                    'icon': 'edit-3',
                    'threshold_warning': 200,
                    'threshold_critical': 1000
                }
            },
            {
                'name': 'average_processing_time',
                'display_name': 'Average Processing Time',
                'description': 'Average time for anonymization processing',
                'category': 'performance',
                'metric_type': 'gauge',
                'aggregation': 'avg',
                'value': 0,
                'unit': 'seconds',
                'config': {
                    'color': 'info',
                    'icon': 'clock',
                    'threshold_warning': 5.0,
                    'threshold_critical': 10.0
                }
            },
            {
                'name': 'system_error_rate',
                'display_name': 'System Error Rate',
                'description': 'Percentage of failed operations',
                'category': 'system_health',
                'metric_type': 'gauge',
                'aggregation': 'avg',
                'value': 0,
                'unit': '%',
                'config': {
                    'color': 'danger',
                    'icon': 'alert-triangle',
                    'threshold_warning': 5.0,
                    'threshold_critical': 10.0
                }
            }
        ]
        
        for metric_data in metrics:
            metric, created = DashboardMetric.objects.get_or_create(
                name=metric_data['name'],
                defaults=metric_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created metric: {metric.display_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Metric already exists: {metric.display_name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS('Dashboard initialization completed successfully!')
        )