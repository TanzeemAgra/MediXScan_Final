from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff', 'date_joined')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Personal Info', {
            'fields': ('user_type', 'phone_number', 'date_of_birth', 'gender', 'address', 'emergency_contact', 'profile_picture')
        }),
        ('Professional Info', {
            'fields': ('license_number', 'specialization', 'department', 'hire_date'),
            'classes': ('collapse',)
        }),
        ('Medical Info', {
            'fields': ('blood_group', 'allergies', 'medical_history'),
            'classes': ('collapse',)
        }),
        ('System Info', {
            'fields': ('is_active_profile', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)