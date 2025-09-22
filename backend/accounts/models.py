from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from PIL import Image

class CustomUser(AbstractUser):
    """Extended User Model for MedixScan"""
    
    USER_TYPES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
        ('receptionist', 'Receptionist'),
        ('patient', 'Patient'),
    )
    
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=17, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    # Professional fields (for staff)
    license_number = models.CharField(max_length=50, blank=True, unique=True, null=True)
    specialization = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # Patient specific fields
    blood_group = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    
    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active_profile = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'custom_users'
        
    def __str__(self):
        return f"{self.get_full_name()} ({self.user_type})"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Resize profile picture
        if self.profile_picture:
            img = Image.open(self.profile_picture.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.profile_picture.path)

    @property
    def full_name(self):
        return self.get_full_name()
    
    @property
    def age(self):
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None