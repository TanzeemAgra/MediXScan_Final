#!/usr/bin/env python
"""
MedixScan Backend Setup Script for Railway
Run this after deploying to Railway to set up initial data
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan.settings')
    django.setup()

def run_migrations():
    """Run database migrations"""
    print("🔄 Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    print("✅ Migrations completed")

def collect_static():
    """Collect static files"""
    print("📦 Collecting static files...")
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
    print("✅ Static files collected")

def create_sample_data():
    """Create sample data for testing"""
    from django.contrib.auth import get_user_model
    from doctors.models import Doctor
    from patients.models import Patient
    
    User = get_user_model()
    
    print("👤 Creating sample users...")
    
    # Create admin user
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@medixscan.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            user_type='admin'
        )
        print(f"✅ Created admin user: {admin.username}")
    
    # Create sample doctor
    if not User.objects.filter(username='dr.smith').exists():
        doctor_user = User.objects.create_user(
            username='dr.smith',
            email='dr.smith@medixscan.com',
            password='doctor123',
            first_name='John',
            last_name='Smith',
            user_type='doctor',
            specialization='General Practice',
            phone_number='+1234567890'
        )
        
        Doctor.objects.create(
            user=doctor_user,
            medical_license='MD123456',
            specialization='general_practice',
            years_of_experience=10,
            consultation_fee=100.00
        )
        print(f"✅ Created doctor: Dr. {doctor_user.get_full_name()}")
    
    # Create sample patient
    if not User.objects.filter(username='patient1').exists():
        patient_user = User.objects.create_user(
            username='patient1',
            email='patient@example.com',
            password='patient123',
            first_name='Jane',
            last_name='Doe',
            user_type='patient',
            phone_number='+1234567891',
            blood_group='A+',
            date_of_birth='1990-01-01'
        )
        
        Patient.objects.create(
            user=patient_user,
            insurance_provider='Health Insurance Co',
            insurance_number='INS123456'
        )
        print(f"✅ Created patient: {patient_user.get_full_name()}")

def main():
    """Main setup function"""
    print("🏥 MedixScan Backend Setup")
    print("=" * 40)
    
    setup_django()
    run_migrations()
    collect_static()
    
    # Ask if user wants sample data
    create_samples = input("\n📊 Create sample data for testing? (y/N): ").lower()
    if create_samples in ['y', 'yes']:
        create_sample_data()
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Visit your Railway app URL")
    print("2. Go to /admin/ to access admin panel")
    print("3. Use /swagger/ to view API documentation")
    print("\nSample credentials (if created):")
    print("Admin: admin / admin123")
    print("Doctor: dr.smith / doctor123") 
    print("Patient: patient1 / patient123")

if __name__ == '__main__':
    main()