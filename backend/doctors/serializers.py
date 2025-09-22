from rest_framework import serializers
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer for Doctor model
    """
    full_name = serializers.SerializerMethodField()
    specialization_display = serializers.CharField(source='get_specialization_display', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id',
            'user',
            'license_number',
            'specialization',
            'specialization_display',
            'years_of_experience',
            'phone_number',
            'office_address',
            'bio',
            'full_name',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_full_name(self, obj):
        """Get doctor's full name from associated user"""
        if obj.user:
            return f"Dr. {obj.user.first_name} {obj.user.last_name}".strip()
        return "Unknown Doctor"