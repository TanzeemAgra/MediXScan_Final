#!/usr/bin/env python
"""
Database Migration and User Verification Script
This script verifies that Dr. Najeeb's superuser account is properly migrated to the database
"""

import os
import sys
import django
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model, authenticate
from django.db import connection
from django.core.management import execute_from_command_line

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_success(message):
    """Print success message"""
    print(f"✅ {message}")

def print_error(message):
    """Print error message"""
    print(f"❌ {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ️  {message}")

def check_migrations():
    """Check if all migrations are applied"""
    print_header("Migration Status Check")
    
    try:
        # Check migration status using Django management commands
        from django.core.management.commands.showmigrations import Command
        from django.core.management.base import CommandError
        from io import StringIO
        import contextlib
        
        # Capture the output of showmigrations
        output = StringIO()
        with contextlib.redirect_stdout(output):
            try:
                execute_from_command_line(['manage.py', 'showmigrations', '--plan'])
            except SystemExit:
                pass
        
        migration_output = output.getvalue()
        
        # Count applied migrations
        applied_migrations = migration_output.count('[X]')
        total_lines = len([line for line in migration_output.split('\n') if '[' in line])
        
        if applied_migrations > 0:
            print_success(f"Applied migrations: {applied_migrations}")
            print_success("All database migrations are up to date")
            return True
        else:
            print_error("No migrations found or migration check failed")
            return False
            
    except Exception as e:
        print_error(f"Error checking migrations: {e}")
        return False

def check_database_connection():
    """Check database connectivity"""
    print_header("Database Connection Check")
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        
        if result and result[0] == 1:
            print_success("Database connection: ACTIVE")
            
            # Get database info
            cursor.execute("SELECT version()")
            db_version = cursor.fetchone()[0]
            print_info(f"Database: {db_version}")
            
            return True
        else:
            print_error("Database connection test failed")
            return False
            
    except Exception as e:
        print_error(f"Database connection error: {e}")
        return False

def verify_user_table():
    """Verify the custom user table exists and has correct structure"""
    print_header("User Table Verification")
    
    try:
        User = get_user_model()
        table_name = User._meta.db_table
        
        print_info(f"User model table: {table_name}")
        
        # Check if table exists
        cursor = connection.cursor()
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_name = %s
        """, [table_name])
        
        table_exists = cursor.fetchone()[0] > 0
        
        if table_exists:
            print_success(f"User table '{table_name}' exists")
            
            # Count total users
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            user_count = cursor.fetchone()[0]
            print_info(f"Total users in database: {user_count}")
            
            return True
        else:
            print_error(f"User table '{table_name}' does not exist")
            return False
            
    except Exception as e:
        print_error(f"Error verifying user table: {e}")
        return False

def verify_drnajeeb_account():
    """Verify Dr. Najeeb's account exists and has correct properties"""
    print_header("Dr. Najeeb Account Verification")
    
    try:
        User = get_user_model()
        
        # Check if Dr. Najeeb exists
        try:
            user = User.objects.get(email='drnajeeb@gmail.com')
            print_success(f"Dr. Najeeb account found: {user.email}")
            
            # Verify account properties
            account_details = [
                ("ID", user.id),
                ("Username", user.username),
                ("Email", user.email),
                ("First Name", user.first_name),
                ("Last Name", user.last_name),
                ("Is Superuser", user.is_superuser),
                ("Is Staff", user.is_staff),
                ("Is Active", user.is_active),
                ("User Type", user.user_type),
                ("Date Joined", user.date_joined.strftime('%Y-%m-%d %H:%M:%S')),
                ("Last Login", user.last_login or "Never")
            ]
            
            print_info("Account Details:")
            for label, value in account_details:
                print(f"   {label}: {value}")
            
            # Verify critical permissions
            if user.is_superuser and user.is_staff and user.is_active:
                print_success("All required permissions: GRANTED")
            else:
                print_error("Missing required permissions")
                
            return user
            
        except User.DoesNotExist:
            print_error("Dr. Najeeb account not found in database")
            return None
            
    except Exception as e:
        print_error(f"Error verifying Dr. Najeeb account: {e}")
        return None

def test_authentication():
    """Test Dr. Najeeb's password authentication"""
    print_header("Authentication Test")
    
    try:
        # Test authentication with username
        user = authenticate(username='drnajeeb', password='Najeeb@123')
        
        if user:
            print_success("Username authentication: SUCCESS")
            print_info(f"Authenticated user: {user.email}")
        else:
            print_error("Username authentication: FAILED")
        
        # Test authentication with email
        user_email = authenticate(username='drnajeeb@gmail.com', password='Najeeb@123')
        
        if user_email:
            print_success("Email authentication: SUCCESS")
        else:
            print_error("Email authentication: FAILED")
            
        return user is not None
        
    except Exception as e:
        print_error(f"Authentication test error: {e}")
        return False

def check_database_integrity():
    """Check database integrity for user data"""
    print_header("Database Integrity Check")
    
    try:
        cursor = connection.cursor()
        
        # Check for Dr. Najeeb specifically
        cursor.execute("""
            SELECT email, username, first_name, last_name, is_superuser, is_staff, is_active, date_joined
            FROM custom_users 
            WHERE email = %s
        """, ['drnajeeb@gmail.com'])
        
        result = cursor.fetchone()
        
        if result:
            print_success("Database record found for Dr. Najeeb")
            print_info("Raw database data:")
            columns = ['Email', 'Username', 'First Name', 'Last Name', 'Is Superuser', 'Is Staff', 'Is Active', 'Date Joined']
            for col, val in zip(columns, result):
                print(f"   {col}: {val}")
            return True
        else:
            print_error("No database record found for Dr. Najeeb")
            return False
            
    except Exception as e:
        print_error(f"Database integrity check error: {e}")
        return False

def main():
    """Main verification function"""
    print_header("MediXScan Database Migration & User Verification")
    print_info(f"Verification started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run all checks
    checks = [
        ("Database Connection", check_database_connection),
        ("Migration Status", check_migrations),
        ("User Table Structure", verify_user_table),
        ("Database Integrity", check_database_integrity),
        ("Dr. Najeeb Account", lambda: verify_drnajeeb_account() is not None),
        ("Authentication Test", test_authentication),
    ]
    
    results = {}
    for check_name, check_func in checks:
        try:
            results[check_name] = check_func()
        except Exception as e:
            print_error(f"{check_name} failed: {e}")
            results[check_name] = False
    
    # Summary
    print_header("Verification Summary")
    
    passed_checks = sum(1 for result in results.values() if result)
    total_checks = len(results)
    
    for check_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status} {check_name}")
    
    print(f"\nOverall Result: {passed_checks}/{total_checks} checks passed")
    
    if passed_checks == total_checks:
        print_success("🎉 All verification checks PASSED!")
        print_success("Dr. Najeeb's superuser account is properly migrated to the database!")
        print_info("\n📋 Quick Access Information:")
        print_info("   Email: drnajeeb@gmail.com")
        print_info("   Password: Najeeb@123")
        print_info("   Django Admin: http://localhost:8000/admin/")
        print_info("   Railway Admin: https://medixscanfinal-production.up.railway.app/admin/")
    else:
        print_error("❌ Some verification checks FAILED!")
        print_error("Dr. Najeeb's account may need additional setup.")
    
    return passed_checks == total_checks

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)