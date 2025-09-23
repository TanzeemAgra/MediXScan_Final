from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    path('profile/', views.user_profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),
]