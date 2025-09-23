from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 
                 'user_type', 'phone_number', 'date_of_birth', 'gender')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, help_text="Username or email address")
    email = serializers.CharField(required=False, help_text="Email address")
    password = serializers.CharField()

    def validate(self, attrs):
        username_or_email = attrs.get('username') or attrs.get('email')
        password = attrs.get('password')

        if not username_or_email:
            raise serializers.ValidationError("Either username or email is required")

        if username_or_email and password:
            # Soft-coded authentication: Try both username and email
            user = None
            
            # First, try authentication with username as-is
            user = authenticate(username=username_or_email, password=password)
            
            # If that fails, check if the input looks like an email
            if not user and '@' in username_or_email:
                try:
                    # Try to find user by email and authenticate with username
                    from .models import CustomUser
                    user_obj = CustomUser.objects.get(email=username_or_email)
                    user = authenticate(username=user_obj.username, password=password)
                except CustomUser.DoesNotExist:
                    pass
            
            # If still no user, try to find by username and see if email was provided
            if not user and '@' not in username_or_email:
                try:
                    from .models import CustomUser
                    user_obj = CustomUser.objects.get(username=username_or_email)
                    user = authenticate(username=user_obj.username, password=password)
                except CustomUser.DoesNotExist:
                    pass
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid username/email or password.')
        else:
            raise serializers.ValidationError('Must include "username" (or email) and "password".')

class UserProfileSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    role = serializers.SerializerMethodField()
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'firstName', 'lastName', 
                 'full_name', 'role', 'user_type', 'phone_number', 'date_of_birth', 'age', 'gender', 
                 'address', 'emergency_contact', 'profile_picture', 'specialization', 'department',
                 'blood_group', 'allergies', 'medical_history', 'is_active_profile',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'username', 'user_type', 'created_at', 'updated_at')
    
    def get_role(self, obj):
        """Map user_type to role for frontend compatibility"""
        role_mapping = {
            'admin': 'admin',
            'doctor': 'radiologist', 
            'nurse': 'technician',
            'receptionist': 'staff',
            'patient': 'viewer'
        }
        return role_mapping.get(obj.user_type, 'viewer')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs