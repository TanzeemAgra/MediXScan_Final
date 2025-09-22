from django.urls import path
from . import views

urlpatterns = [
    # Patient URLs will be implemented
    path('', views.PatientListView.as_view(), name='patient-list'),
]