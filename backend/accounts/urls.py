from django.urls import path
from . import views
from . import debug_views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    path('profile/', views.user_profile, name='profile'),
    path('change-password/', views.change_password, name='change_password'),

    # Debug endpoints (remove in production)
    path('debug/token/', debug_views.debug_token, name='debug_token'),
    path('debug/authenticated/', debug_views.debug_authenticated, name='debug_authenticated'),
    path('debug/jwt-settings/', debug_views.debug_jwt_settings, name='debug_jwt_settings'),
]