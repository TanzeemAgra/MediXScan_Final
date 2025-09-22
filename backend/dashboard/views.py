"""
Dashboard API Views for MedixScan
Implements comprehensive dashboard endpoints with soft-coded analytics
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from datetime import datetime, timedelta

from .models import ActivityLog, ActivityType, DashboardMetric, UserSession
from .services import dashboard_service
from .serializers import (
    ActivityLogSerializer, ActivityTypeSerializer, DashboardMetricSerializer,
    UserSessionSerializer, DashboardOverviewSerializer, ActivityStatisticsSerializer,
    AnonymizerAnalyticsSerializer, ReportCorrectionAnalyticsSerializer,
    ChartDataSerializer, DashboardConfigSerializer
)


class DashboardViewSet(viewsets.ViewSet):
    """
    Main dashboard API endpoints with soft-coded analytics
    """
    permission_classes = [IsAuthenticated]
    
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    @action(detail=False, methods=['get'], url_path='overview')
    def get_overview(self, request):
        """Get dashboard overview statistics"""
        try:
            data = dashboard_service.get_overview_statistics()
            serializer = DashboardOverviewSerializer(data)
            return Response({
                'success': True,
                'data': serializer.data,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='patient-stats')
    def get_patient_stats(self, request):
        """Get patient-related statistics"""
        try:
            # Mock data for now - can be replaced with real patient stats
            data = {
                'total_patients': 150,
                'new_patients_today': 5,
                'active_patients': 120,
                'patient_growth': 12.5,
                'demographics': {
                    'age_groups': {
                        '0-18': 25,
                        '19-35': 45,
                        '36-55': 50,
                        '56+': 30
                    },
                    'gender': {
                        'male': 75,
                        'female': 75
                    }
                }
            }
            
            return Response({
                'success': True,
                'data': data,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='appointment-stats')
    def get_appointment_stats(self, request):
        """Get appointment-related statistics"""
        try:
            data = {
                'total_appointments': 85,
                'today_appointments': 12,
                'pending_appointments': 8,
                'completed_appointments': 65,
                'cancelled_appointments': 12,
                'appointment_types': {
                    'consultation': 40,
                    'follow-up': 25,
                    'emergency': 10,
                    'routine': 10
                }
            }
            
            return Response({
                'success': True,
                'data': data,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='doctor-stats')
    def get_doctor_stats(self, request):
        """Get doctor-related statistics"""
        try:
            data = {
                'total_doctors': 25,
                'active_doctors': 20,
                'available_today': 15,
                'specializations': {
                    'radiology': 8,
                    'cardiology': 5,
                    'neurology': 4,
                    'orthopedics': 4,
                    'general': 4
                },
                'workload': {
                    'high': 5,
                    'medium': 10,
                    'low': 10
                }
            }
            
            return Response({
                'success': True,
                'data': data,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='recent-activities')
    def get_recent_activities(self, request):
        """Get recent system activities"""
        try:
            limit = int(request.query_params.get('limit', 20))
            activities = ActivityLog.objects.select_related(
                'activity_type', 'user'
            ).order_by('-timestamp')[:limit]
            
            serializer = ActivityLogSerializer(activities, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data,
                'count': activities.count(),
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='chart-data')
    def get_chart_data(self, request):
        """Get chart data for dashboard widgets"""
        try:
            chart_type = request.query_params.get('type', 'overview')
            
            if chart_type == 'appointments':
                data = self._generate_appointment_chart_data()
            elif chart_type == 'patients':
                data = self._generate_patient_chart_data()
            elif chart_type == 'activities':
                data = self._generate_activity_chart_data()
            elif chart_type == 'anonymizer':
                data = self._generate_anonymizer_chart_data()
            elif chart_type == 'report_corrections':
                data = self._generate_report_correction_chart_data()
            else:
                data = self._generate_overview_chart_data()
            
            serializer = ChartDataSerializer(data)
            
            return Response({
                'success': True,
                'data': serializer.data,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_appointment_chart_data(self):
        """Generate appointment chart data"""
        # Generate sample data for the last 7 days
        from django.utils import timezone
        
        labels = []
        data = []
        
        for i in range(6, -1, -1):
            date = timezone.now() - timedelta(days=i)
            labels.append(date.strftime('%Y-%m-%d'))
            # Mock data - replace with real appointment counts
            data.append(10 + (i * 2) + (i % 3))
        
        return {
            'chart_type': 'line',
            'title': 'Appointments Over Time',
            'labels': labels,
            'datasets': [{
                'label': 'Appointments',
                'data': data,
                'borderColor': '#007bff',
                'backgroundColor': 'rgba(0, 123, 255, 0.1)',
                'tension': 0.4
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'top'},
                    'title': {'display': True, 'text': 'Daily Appointments'}
                }
            }
        }
    
    def _generate_patient_chart_data(self):
        """Generate patient chart data"""
        return {
            'chart_type': 'doughnut',
            'title': 'Patient Demographics',
            'labels': ['0-18', '19-35', '36-55', '56+'],
            'datasets': [{
                'data': [25, 45, 50, 30],
                'backgroundColor': [
                    '#FF6384',
                    '#36A2EB', 
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'right'},
                    'title': {'display': True, 'text': 'Age Demographics'}
                }
            }
        }
    
    def _generate_activity_chart_data(self):
        """Generate activity timeline chart data"""
        activities_data = dashboard_service.get_activity_statistics('week')
        
        labels = []
        data = []
        
        # Generate last 7 days
        for i in range(6, -1, -1):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            labels.append(date)
            # Use real data if available, otherwise mock
            count = activities_data.get('usage_by_day', {}).get(date, 5 + (i % 4))
            data.append(count)
        
        return {
            'chart_type': 'bar',
            'title': 'System Activity',
            'labels': labels,
            'datasets': [{
                'label': 'Activities',
                'data': data,
                'backgroundColor': 'rgba(54, 162, 235, 0.8)',
                'borderColor': 'rgba(54, 162, 235, 1)',
                'borderWidth': 1
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'top'},
                    'title': {'display': True, 'text': 'Weekly Activity Overview'}
                }
            }
        }
    
    def _generate_anonymizer_chart_data(self):
        """Generate anonymizer usage chart data"""
        analytics = dashboard_service.get_anonymizer_analytics()
        
        file_types = analytics.get('file_types_processed', {})
        
        return {
            'chart_type': 'pie',
            'title': 'Anonymizer File Types',
            'labels': list(file_types.keys()) if file_types else ['PDF', 'DOCX', 'TXT', 'CSV'],
            'datasets': [{
                'data': list(file_types.values()) if file_types else [40, 25, 20, 15],
                'backgroundColor': [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'right'},
                    'title': {'display': True, 'text': 'File Types Processed'}
                }
            }
        }
    
    def _generate_report_correction_chart_data(self):
        """Generate report correction chart data"""
        analytics = dashboard_service.get_report_correction_analytics()
        
        correction_types = analytics.get('correction_types', {})
        
        return {
            'chart_type': 'bar',
            'title': 'Report Corrections',
            'labels': list(correction_types.keys()) if correction_types else ['Grammar', 'Medical Terms', 'Formatting', 'Data Entry'],
            'datasets': [{
                'label': 'Corrections',
                'data': list(correction_types.values()) if correction_types else [15, 25, 10, 20],
                'backgroundColor': [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ]
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'top'},
                    'title': {'display': True, 'text': 'Correction Types'}
                }
            }
        }
    
    def _generate_overview_chart_data(self):
        """Generate overview chart data"""
        return {
            'chart_type': 'line',
            'title': 'System Overview',
            'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'datasets': [{
                'label': 'Activities',
                'data': [12, 19, 15, 25, 22, 18, 20],
                'borderColor': '#007bff',
                'backgroundColor': 'rgba(0, 123, 255, 0.1)',
                'tension': 0.4
            }],
            'options': {
                'responsive': True,
                'plugins': {
                    'legend': {'position': 'top'},
                    'title': {'display': True, 'text': 'Weekly System Activity'}
                }
            }
        }


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Activity log management endpoints"""
    queryset = ActivityLog.objects.select_related('activity_type', 'user').order_by('-timestamp')
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter activities based on query parameters"""
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(activity_type__category=category)
        
        # Filter by user
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(timestamp__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__lte=date_to)
        
        return queryset


class DashboardMetricViewSet(viewsets.ReadOnlyModelViewSet):
    """Dashboard metrics endpoints"""
    queryset = DashboardMetric.objects.filter(is_active=True).order_by('category', 'name')
    serializer_class = DashboardMetricSerializer
    permission_classes = [IsAuthenticated]


class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """User session tracking endpoints"""
    queryset = UserSession.objects.select_related('user').order_by('-last_activity')
    serializer_class = UserSessionSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='active')
    def get_active_sessions(self, request):
        """Get currently active user sessions"""
        from django.utils import timezone
        
        threshold = timezone.now() - timedelta(minutes=30)
        active_sessions = self.get_queryset().filter(
            last_activity__gte=threshold,
            logout_time__isnull=True
        )
        
        serializer = self.get_serializer(active_sessions, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'count': active_sessions.count(),
            'timestamp': datetime.now().isoformat()
        })