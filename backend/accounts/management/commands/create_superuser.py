"""
Enhanced Django management command to create superuser with soft coding techniques
Supports multiple superusers with environment variables and configuration files
Usage: 
    python manage.py create_superuser
    python manage.py create_superuser --email drnajeeb@gmail.com
    python manage.py create_superuser --profile drnajeeb
    python manage.py create_superuser --list-profiles
"""
import os
import json
import getpass
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from decouple import config


class Command(BaseCommand):
    help = 'Create superuser with soft coding techniques - supports multiple profiles and environment variables'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Admin username (overrides environment variable)',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Admin email (overrides environment variable)',
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Admin password (overrides environment variable)',
        )
        parser.add_argument(
            '--first-name',
            type=str,
            help='First name for the superuser',
        )
        parser.add_argument(
            '--last-name',
            type=str,
            help='Last name for the superuser',
        )
        parser.add_argument(
            '--profile',
            type=str,
            help='Use predefined profile (drnajeeb, admin, tanzeem)',
        )
        parser.add_argument(
            '--list-profiles',
            action='store_true',
            help='List available predefined profiles',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force create user even if exists (will update password)',
        )
        parser.add_argument(
            '--interactive',
            action='store_true',
            help='Interactive mode for entering credentials',
        )

    def handle(self, *args, **options):
        """Main command handler with comprehensive soft coding"""
        
        self.stdout.write(self.style.SUCCESS('🚀 MediXScan Enhanced Superuser Creation'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        
        # Handle list profiles request
        if options.get('list_profiles'):
            self.list_predefined_profiles()
            return
        
        try:
            # Load user configuration using soft coding
            user_config = self.load_user_configuration(options)
            
            # Validate configuration
            self.validate_configuration(user_config)
            
            # Create or update superuser
            with transaction.atomic():
                user = self.create_or_update_user(user_config, options.get('force', False))
                
            # Display success message
            self.display_success_message(user)
            
        except CommandError as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {e}'))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Unexpected error: {e}'))
            return

    def get_predefined_profiles(self):
        """Return predefined user profiles using soft coding"""
        return {
            'drnajeeb': {
                'email': 'drnajeeb@gmail.com',
                'password': 'Najeeb@123',
                'first_name': 'Dr. Najeeb',
                'last_name': 'Khan',
                'description': 'Senior Medical Officer - Radiology Department'
            },
            'tanzeem': {
                'email': 'tanzeem.agra@rugrel.com', 
                'password': 'Admin@12345',
                'first_name': 'Tanzeem',
                'last_name': 'Agra',
                'description': 'System Administrator'
            },
            'admin': {
                'email': 'admin@medixscan.com',
                'password': 'Admin@2024',
                'first_name': 'System',
                'last_name': 'Administrator', 
                'description': 'Default System Admin'
            }
        }

    def list_predefined_profiles(self):
        """Display available predefined profiles"""
        profiles = self.get_predefined_profiles()
        
        self.stdout.write(self.style.SUCCESS('📋 Available Predefined Profiles:'))
        self.stdout.write(self.style.SUCCESS('=' * 40))
        
        for profile_name, profile_data in profiles.items():
            self.stdout.write(f'\n🔑 Profile: {profile_name}')
            self.stdout.write(f'   📧 Email: {profile_data["email"]}')
            self.stdout.write(f'   👤 Name: {profile_data["first_name"]} {profile_data["last_name"]}')
            self.stdout.write(f'   📝 Description: {profile_data["description"]}')
        
        self.stdout.write(f'\n💡 Usage: python manage.py create_superuser --profile drnajeeb')

    def load_user_configuration(self, options):
        """Load user configuration using soft coding priority system"""
        
        user_config = {}
        
        # Priority 1: Predefined profile (if specified)
        if options.get('profile'):
            profile_name = options['profile'].lower()
            profiles = self.get_predefined_profiles()
            
            if profile_name in profiles:
                user_config = profiles[profile_name].copy()
                self.stdout.write(self.style.SUCCESS(f'✅ Using predefined profile: {profile_name}'))
            else:
                available_profiles = ', '.join(profiles.keys())
                raise CommandError(f'Invalid profile: {profile_name}. Available: {available_profiles}')
        
        # Priority 2: Command line arguments (override profile)
        if options.get('email'):
            user_config['email'] = options['email']
        if options.get('password'):
            user_config['password'] = options['password']
        if options.get('first_name'):
            user_config['first_name'] = options['first_name']
        if options.get('last_name'):
            user_config['last_name'] = options['last_name']
        if options.get('username'):  # For backward compatibility
            user_config['email'] = options['username']
        
        # Priority 3: Environment variables
        env_config = self.load_environment_variables()
        for key, value in env_config.items():
            if key not in user_config:
                user_config[key] = value
        
        # Priority 4: Default to Dr. Najeeb if nothing specified
        if not user_config:
            user_config = self.get_predefined_profiles()['drnajeeb'].copy()
            self.stdout.write(self.style.SUCCESS('✅ Using default profile: Dr. Najeeb'))
        
        # Priority 5: Interactive mode for missing values
        if options.get('interactive'):
            user_config = self.prompt_for_missing_values(user_config)
            
        return user_config

    def load_environment_variables(self):
        """Load configuration from environment variables"""
        
        env_config = {}
        
        # Multiple environment variable formats for flexibility
        env_mappings = [
            ('SUPERUSER_EMAIL', 'email'),
            ('ADMIN_EMAIL', 'email'),
            ('DJANGO_SUPERUSER_EMAIL', 'email'),
            ('SUPERUSER_PASSWORD', 'password'),
            ('ADMIN_PASSWORD', 'password'),
            ('DJANGO_SUPERUSER_PASSWORD', 'password'),
            ('SUPERUSER_FIRST_NAME', 'first_name'),
            ('SUPERUSER_LAST_NAME', 'last_name'),
            ('ADMIN_USERNAME', 'email'),  # Backward compatibility
        ]
        
        for env_var, config_key in env_mappings:
            value = config(env_var, default=None)
            if value and config_key not in env_config:
                env_config[config_key] = value
        
        if env_config:
            self.stdout.write(self.style.SUCCESS('✅ Loaded configuration from environment variables'))
            
        return env_config

    def prompt_for_missing_values(self, user_config):
        """Interactively prompt for missing configuration values"""
        
        self.stdout.write(self.style.WARNING('📝 Interactive mode - filling missing values:'))
        
        if 'email' not in user_config:
            user_config['email'] = input('Email address: ')
            
        if 'password' not in user_config:
            user_config['password'] = getpass.getpass('Password: ')
            
        if 'first_name' not in user_config:
            user_config['first_name'] = input('First name (optional): ') or 'Admin'
            
        if 'last_name' not in user_config:
            user_config['last_name'] = input('Last name (optional): ') or 'User'
            
        return user_config

    def validate_configuration(self, user_config):
        """Validate user configuration before creation"""
        
        # Validate email
        if not user_config.get('email'):
            raise CommandError('Email address is required')
            
        try:
            validate_email(user_config['email'])
        except ValidationError:
            raise CommandError(f'Invalid email address: {user_config["email"]}')
        
        # Validate password
        if not user_config.get('password'):
            raise CommandError('Password is required')
            
        if len(user_config['password']) < 8:
            raise CommandError('Password must be at least 8 characters long')
        
        # Set defaults for missing fields
        user_config.setdefault('first_name', 'Admin')
        user_config.setdefault('last_name', 'User')
        
        self.stdout.write(self.style.SUCCESS('✅ Configuration validation passed'))

    def create_or_update_user(self, user_config, force_update=False):
        """Create or update superuser with the provided configuration"""
        
        User = get_user_model()
        email = user_config['email']
        
        # Generate username from email if not provided
        username = user_config.get('username', email.split('@')[0])
        
        # Check if user already exists (check both email and username)
        existing_user = None
        try:
            existing_user = User.objects.get(email=email)
        except User.DoesNotExist:
            try:
                existing_user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass
        
        if existing_user:
            if not force_update:
                raise CommandError(
                    f'User with email {email} or username {username} already exists. Use --force to update.'
                )
            
            # Update existing user
            existing_user.username = username
            existing_user.email = email
            existing_user.set_password(user_config['password'])
            existing_user.first_name = user_config['first_name']
            existing_user.last_name = user_config['last_name']
            existing_user.is_staff = True
            existing_user.is_superuser = True
            existing_user.is_active = True
            existing_user.user_type = 'admin'  # Set user type for MediXScan
            existing_user.save()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Updated existing superuser: {email}'))
            return existing_user
        else:
            # Create new user using create_superuser method
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=user_config['password'],
                first_name=user_config['first_name'],
                last_name=user_config['last_name'],
            )
            
            # Set additional MediXScan-specific fields
            user.user_type = 'admin'
            user.is_active_profile = True
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Created new superuser: {email} (username: {username})'))
            return user

    def display_success_message(self, user):
        """Display success message with user details"""
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Superuser creation completed successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        
        # Display user details
        details = [
            ('📧 Email', user.email),
            ('👤 Name', f'{user.first_name} {user.last_name}'),
            ('🔧 Staff Status', '✅ Yes' if user.is_staff else '❌ No'),
            ('🔑 Superuser', '✅ Yes' if user.is_superuser else '❌ No'),
            ('✅ Active', '✅ Yes' if user.is_active else '❌ No'),
            ('📅 Created', user.date_joined.strftime('%Y-%m-%d %H:%M')),
        ]
        
        for label, value in details:
            self.stdout.write(f'{label}: {value}')
        
        self.stdout.write(self.style.SUCCESS('\n🌐 Django Admin Access:'))
        self.stdout.write('   Local: http://localhost:8000/admin/')
        self.stdout.write('   Railway: https://medixscanfinal-production.up.railway.app/admin/')
        
        self.stdout.write(self.style.SUCCESS('\n🔒 Login Credentials:'))
        self.stdout.write(f'   Email: {user.email}')
        self.stdout.write('   Password: [Hidden for security]')
        
        self.stdout.write(self.style.WARNING('\n⚠️  Security Reminders:'))
        self.stdout.write('   1. Store credentials securely')
        self.stdout.write('   2. Use environment variables in production')
        self.stdout.write('   3. Regularly update passwords')
        self.stdout.write('   4. Enable 2FA when possible')