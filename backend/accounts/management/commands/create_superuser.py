"""
Custom Django management command to create superuser with environment variables
Usage: python manage.py create_superuser
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from decouple import config


class Command(BaseCommand):
    help = 'Create a superuser with credentials from environment variables'

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
            '--force',
            action='store_true',
            help='Force create user even if exists (will update password)',
        )

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Get credentials from command line args or environment variables
        username = options.get('username') or config('ADMIN_USERNAME', default='tanzeem.agra@rugrel.com')
        email = options.get('email') or config('ADMIN_EMAIL', default='tanzeem.agra@rugrel.com')
        password = options.get('password') or config('ADMIN_PASSWORD', default='Admin@12345')
        
        if not username or not email or not password:
            self.stdout.write(
                self.style.ERROR(
                    'Missing required credentials. Set ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD '
                    'in environment or provide via command line arguments.'
                )
            )
            return

        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                if options.get('force'):
                    user = User.objects.get(username=username)
                    user.set_password(password)
                    user.is_superuser = True
                    user.is_staff = True
                    user.save()
                    self.stdout.write(
                        self.style.SUCCESS(f'Successfully updated superuser: {username}')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Superuser with username "{username}" already exists. '
                            'Use --force flag to update password.'
                        )
                    )
                    return
            else:
                # Create new superuser
                user = User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created superuser: {username}')
                )
            
            # Display user details
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Is Staff: {user.is_staff}')
            self.stdout.write(f'Is Superuser: {user.is_superuser}')
            self.stdout.write(f'Date Joined: {user.date_joined}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {str(e)}')
            )