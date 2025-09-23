"""
URL configuration for medical_records app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import ai_views

# Create router for viewsets if needed
router = DefaultRouter()

# Medical records specific URLs
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # AI-powered endpoints
    path('corrections/analyze/', ai_views.analyze_report_with_ai, name='analyze-report'),
    path('corrections/submit/', ai_views.submit_correction_request, name='submit-correction'),
    path('anonymization/anonymize/', ai_views.anonymize_text, name='anonymize-text'),
    path('analyze-image/', ai_views.analyze_medical_image, name='analyze-image'),
]