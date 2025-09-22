"""
URL configuration for medixscan project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="MedixScan API",
        default_version='v1',
        description="Medical Clinic & Patient Management System API",
        terms_of_service="https://www.yoursite.com/terms/",
        contact=openapi.Contact(email="contact@medixscan.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API Endpoints
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/patients/', include('patients.urls')),
    path('api/v1/doctors/', include('doctors.urls')),
    path('api/v1/appointments/', include('appointments.urls')),
    path('api/v1/medical-records/', include('medical_records.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/dashboard/', include('dashboard.urls')),
    
    # Health Check
    path('health/', include('health_check.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Add Django Debug Toolbar in development
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns

# Custom error handlers - uncomment after creating views
# handler404 = 'medixscan.views.handler404'
# handler500 = 'medixscan.views.handler500'