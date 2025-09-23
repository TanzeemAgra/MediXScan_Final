"""
URL configuration for medical_records app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for viewsets if needed
router = DefaultRouter()

# Medical records specific URLs
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Add specific endpoints here as needed
    # Example: path('upload/', views.FileUploadView.as_view(), name='file-upload'),
]