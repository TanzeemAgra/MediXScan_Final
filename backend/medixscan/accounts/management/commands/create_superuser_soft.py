"""
Django Management Command: Create Superuser with Soft Coding
===========================================================

This command creates superusers using environment variables and configuration files
for secure credential management. It supports multiple creation methods and 
automatic user profile setup.

Usage:
    python manage.py create_superuser_soft
    python manage.py create_superuser_soft --email user@example.com
    python manage.py create_superuser_soft --config-file superusers.json
    
Environment Variables:
    SUPERUSER_EMAIL - Default superuser email
    SUPERUSER_PASSWORD - Default superuser password  
    SUPERUSER_FIRST_NAME - Default first name
    SUPERUSER_LAST_NAME - Default last name
"""

import os
import json
import getpass
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()

class Command(BaseCommand):
    help = 'Create superuser with soft coding techniques - supports environment variables and config files'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Superuser email address (overrides environment variable)',
        )
        parser.add_argument(
            '--password',
            type=str,
            help='Superuser password (overrides environment variable)',
        )
        parser.add_argument(
            '--first-name',
            type=str,
            help='Superuser first name',
        )
        parser.add_argument(
            '--last-name',
            type=str,
            help='Superuser last name',
        )
        parser.add_argument(
            '--config-file',
            type=str,
            help='JSON configuration file with superuser details',
        )
        parser.add_argument(
            '--interactive',
            action='store_true',
            help='Interactive mode for entering credentials',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force creation even if user already exists (will update)',
        )
    
    def handle(self, *args, **options):
        """Main command handler with comprehensive error handling"""
        
        self.stdout.write(self.style.SUCCESS('🚀 MediXScan Superuser Creation Tool'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        
        try:
            # Load superuser configuration using soft coding
            user_config = self.load_user_configuration(options)
            
            # Validate configuration
            self.validate_user_configuration(user_config)
            
            # Create or update superuser
            with transaction.atomic():
                user = self.create_or_update_superuser(user_config, options.get('force', False))
                
            # Display success message
            self.display_success_message(user, user_config)
            
        except CommandError as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {e}'))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Unexpected error: {e}'))
            return
    
    def load_user_configuration(self, options):
        """Load user configuration using soft coding techniques"""
        
        user_config = {}
        
        # Priority 1: Command line arguments (highest priority)
        if options.get('email'):
            user_config['email'] = options['email']
        if options.get('password'):
            user_config['password'] = options['password']
        if options.get('first_name'):
            user_config['first_name'] = options['first_name']
        if options.get('last_name'):
            user_config['last_name'] = options['last_name']
            
        # Priority 2: Configuration file
        if options.get('config_file'):
            file_config = self.load_config_file(options['config_file'])
            for key, value in file_config.items():
                if key not in user_config:  # Don't override command line args
                    user_config[key] = value
        
        # Priority 3: Environment variables
        env_config = self.load_environment_variables()
        for key, value in env_config.items():
            if key not in user_config:  # Don't override higher priority sources
                user_config[key] = value
        
        # Priority 4: Default configuration (Dr. Najeeb)
        default_config = self.get_default_configuration()
        for key, value in default_config.items():
            if key not in user_config:
                user_config[key] = value
        
        # Priority 5: Interactive mode (lowest priority, fills missing values)
        if options.get('interactive'):
            user_config = self.prompt_for_missing_values(user_config)
            
        return user_config
    
    def load_config_file(self, config_file_path):
        """Load configuration from JSON file"""
        
        try:
            if not os.path.exists(config_file_path):
                raise CommandError(f'Configuration file not found: {config_file_path}')
                
            with open(config_file_path, 'r') as f:
                config = json.load(f)
                
            self.stdout.write(self.style.SUCCESS(f'✅ Loaded configuration from: {config_file_path}'))
            return config
            
        except json.JSONDecodeError as e:
            raise CommandError(f'Invalid JSON in configuration file: {e}')
        except Exception as e:
            raise CommandError(f'Error reading configuration file: {e}')
    
    def load_environment_variables(self):
        """Load configuration from environment variables"""
        
        env_config = {}
        env_mapping = {
            'SUPERUSER_EMAIL': 'email',
            'SUPERUSER_PASSWORD': 'password',
            'SUPERUSER_FIRST_NAME': 'first_name', 
            'SUPERUSER_LAST_NAME': 'last_name',
            'DJANGO_SUPERUSER_EMAIL': 'email',  # Django convention
            'DJANGO_SUPERUSER_PASSWORD': 'password',
        }
        
        for env_var, config_key in env_mapping.items():
            value = os.getenv(env_var)
            if value:
                env_config[config_key] = value
                
        if env_config:
            self.stdout.write(self.style.SUCCESS('✅ Loaded configuration from environment variables'))
            
        return env_config
    
    def get_default_configuration(self):
        """Return default configuration for Dr. Najeeb"""
        
        default_config = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123',
            'first_name': 'Dr. Najeeb',
            'last_name': 'Khan',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
        }
        
        self.stdout.write(self.style.SUCCESS('✅ Using default configuration for Dr. Najeeb'))
        return default_config
    
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
    
    def validate_user_configuration(self, user_config):
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
        user_config.setdefault('is_staff', True)
        user_config.setdefault('is_superuser', True)
        user_config.setdefault('is_active', True)
        
        self.stdout.write(self.style.SUCCESS('✅ Configuration validation passed'))
    
    def create_or_update_superuser(self, user_config, force_update=False):
        """Create or update superuser with the provided configuration"""
        
        email = user_config['email']
        
        # Check if user already exists
        try:
            user = User.objects.get(email=email)
            
            if not force_update:
                raise CommandError(
                    f'User with email {email} already exists. Use --force to update.'
                )
            
            # Update existing user
            user.set_password(user_config['password'])
            user.first_name = user_config['first_name']
            user.last_name = user_config['last_name']
            user.is_staff = user_config['is_staff']
            user.is_superuser = user_config['is_superuser']
            user.is_active = user_config['is_active']
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Updated existing superuser: {email}'))
            return user
            
        except User.DoesNotExist:
            # Create new user
            user = User.objects.create_user(
                email=email,
                password=user_config['password'],
                first_name=user_config['first_name'],
                last_name=user_config['last_name'],
            )
            
            # Set superuser privileges
            user.is_staff = user_config['is_staff']
            user.is_superuser = user_config['is_superuser']
            user.is_active = user_config['is_active']
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Created new superuser: {email}'))
            return user
    
    def display_success_message(self, user, user_config):
        """Display success message with user details"""
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Superuser creation completed successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        
        # Display user details (excluding password)
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
        self.stdout.write('Local: http://localhost:8000/admin/')
        self.stdout.write('Railway: https://medixscanfinal-production.up.railway.app/admin/')
        
        self.stdout.write(self.style.SUCCESS('\n🔒 Login Credentials:'))
        self.stdout.write(f'Email: {user.email}')
        self.stdout.write('Password: [Hidden for security]')
        
        self.stdout.write(self.style.WARNING('\n⚠️  Important Security Notes:'))
        self.stdout.write('1. Store credentials securely')
        self.stdout.write('2. Use environment variables in production')
        self.stdout.write('3. Regularly update passwords')
        self.stdout.write('4. Enable 2FA when possible')