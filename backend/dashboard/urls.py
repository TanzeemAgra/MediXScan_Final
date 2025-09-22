"""
Dashboard URL Configuration for MedixScan
Maps dashboard API endpoints with soft-coded routing
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet, ActivityLogViewSet, DashboardMetricViewSet, UserSessionViewSet

# Create router for viewsets
router = DefaultRouter()
router.register(r'activities', ActivityLogViewSet, basename='activity-log')
router.register(r'metrics', DashboardMetricViewSet, basename='dashboard-metric')
router.register(r'sessions', UserSessionViewSet, basename='user-session')

# Dashboard-specific URLs
dashboard_patterns = [
    path('overview/', DashboardViewSet.as_view({'get': 'get_overview'}), name='dashboard-overview'),
    path('patient-stats/', DashboardViewSet.as_view({'get': 'get_patient_stats'}), name='dashboard-patient-stats'),
    path('appointment-stats/', DashboardViewSet.as_view({'get': 'get_appointment_stats'}), name='dashboard-appointment-stats'),
    path('doctor-stats/', DashboardViewSet.as_view({'get': 'get_doctor_stats'}), name='dashboard-doctor-stats'),
    path('recent-activities/', DashboardViewSet.as_view({'get': 'get_recent_activities'}), name='dashboard-recent-activities'),
    path('chart-data/', DashboardViewSet.as_view({'get': 'get_chart_data'}), name='dashboard-chart-data'),
]

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Dashboard main endpoints
    *dashboard_patterns,
]