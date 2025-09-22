# 🚀 MediXScan Superuser Creation Script (PowerShell)
# Creates Dr. Najeeb superuser account using soft coding techniques

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipMigrations,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Colors for console output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Cyan" 
    White = "White"
}

function Write-ColoredOutput {
    param($Message, $Color = "White")
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Write-Header {
    param($Title)
    Write-ColoredOutput "`n🚀 $Title" "Blue"
    Write-ColoredOutput ("=" * $Title.Length) "Blue"
}

function Test-Environment {
    Write-Header "Environment Check"
    
    # Check if we're in the backend directory
    $managePyPath = "medixscan\manage.py"
    if (-not (Test-Path $managePyPath)) {
        Write-ColoredOutput "❌ Error: manage.py not found at $managePyPath" "Red"
        Write-ColoredOutput "Please run this script from the backend directory" "Yellow"
        exit 1
    }
    Write-ColoredOutput "✅ Found Django project" "Green"
    
    # Check Python installation
    try {
        $pythonVersion = python --version
        Write-ColoredOutput "✅ Python found: $pythonVersion" "Green"
    } catch {
        Write-ColoredOutput "❌ Python not found. Please install Python first." "Red"
        exit 1
    }
    
    # Check Django installation
    try {
        python -c "import django" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Django available" "Green"
        } else {
            Write-ColoredOutput "❌ Django not installed. Installing..." "Yellow"
            pip install django
        }
    } catch {
        Write-ColoredOutput "❌ Error checking Django installation" "Red"
        exit 1
    }
}

function Set-EnvironmentVariables {
    Write-Header "Environment Configuration"
    
    # Set Dr. Najeeb credentials as environment variables
    $env:SUPERUSER_EMAIL = "drnajeeb@gmail.com"
    $env:SUPERUSER_PASSWORD = "Najeeb@123"
    $env:SUPERUSER_FIRST_NAME = "Dr. Najeeb"
    $env:SUPERUSER_LAST_NAME = "Khan"
    
    Write-ColoredOutput "✅ Environment variables configured for Dr. Najeeb" "Green"
    
    if ($Verbose) {
        Write-ColoredOutput "Email: $env:SUPERUSER_EMAIL" "Yellow"
        Write-ColoredOutput "Name: $env:SUPERUSER_FIRST_NAME $env:SUPERUSER_LAST_NAME" "Yellow"
    }
}

function Invoke-DatabaseMigrations {
    if ($SkipMigrations) {
        Write-ColoredOutput "⏭️ Skipping database migrations (--SkipMigrations)" "Yellow"
        return
    }
    
    Write-Header "Database Migrations"
    
    Set-Location "medixscan"
    
    # Check for pending migrations
    $migrationCheck = python manage.py showmigrations --list | Select-String "\[ \]"
    
    if ($migrationCheck) {
        Write-ColoredOutput "🔄 Running pending migrations..." "Yellow"
        python manage.py migrate
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Migrations completed successfully" "Green"
        } else {
            Write-ColoredOutput "❌ Migration failed" "Red"
            Set-Location ".."
            exit 1
        }
    } else {
        Write-ColoredOutput "✅ Database is up to date" "Green"
    }
    
    Set-Location ".."
}

function New-DrNajeebSuperuser {
    Write-Header "Creating Dr. Najeeb Superuser"
    
    Set-Location "medixscan"
    
    # Create superuser using our custom management command
    $createArgs = @(
        "manage.py", "create_superuser_soft",
        "--email", "drnajeeb@gmail.com",
        "--password", "Najeeb@123", 
        "--first-name", "Dr. Najeeb",
        "--last-name", "Khan"
    )
    
    if ($Force) {
        $createArgs += "--force"
    }
    
    Write-ColoredOutput "👤 Creating superuser account..." "Yellow"
    python @createArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "✅ Dr. Najeeb superuser created successfully!" "Green"
    } else {
        Write-ColoredOutput "❌ Failed to create superuser" "Red"
        Set-Location ".."
        exit 1
    }
    
    Set-Location ".."
}

function Test-SuperuserCreation {
    Write-Header "Superuser Verification"
    
    Set-Location "medixscan"
    
    $verificationScript = @"
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    user = User.objects.get(email='drnajeeb@gmail.com')
    print(f'✅ User found: {user.email}')
    print(f'✅ Full name: {user.first_name} {user.last_name}')
    print(f'✅ Staff status: {user.is_staff}')
    print(f'✅ Superuser: {user.is_superuser}') 
    print(f'✅ Active: {user.is_active}')
    print(f'✅ Date joined: {user.date_joined.strftime("%Y-%m-%d %H:%M")}')
    
    if user.is_superuser and user.is_staff and user.is_active:
        print('🎉 Superuser verification PASSED!')
        exit(0)
    else:
        print('❌ Superuser verification FAILED!')
        exit(1)
        
except User.DoesNotExist:
    print('❌ User drnajeeb@gmail.com not found!')
    exit(1)
except Exception as e:
    print(f'❌ Verification error: {e}')
    exit(1)
"@
    
    $verificationScript | python
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "✅ Superuser verification passed" "Green"
    } else {
        Write-ColoredOutput "❌ Superuser verification failed" "Red"
        Set-Location ".."
        exit 1
    }
    
    Set-Location ".."
}

function Show-AccessInformation {
    Write-Header "Django Admin Access Information"
    
    Write-ColoredOutput "🔗 Admin Panel URLs:" "Yellow"
    Write-ColoredOutput "   Local Development: http://localhost:8000/admin/" "White"
    Write-ColoredOutput "   Railway Production: https://medixscanfinal-production.up.railway.app/admin/" "White"
    
    Write-ColoredOutput "`n🔑 Login Credentials:" "Yellow"
    Write-ColoredOutput "   Email: drnajeeb@gmail.com" "White"
    Write-ColoredOutput "   Password: Najeeb@123" "White"
    
    Write-ColoredOutput "`n👤 User Details:" "Yellow"
    Write-ColoredOutput "   Name: Dr. Najeeb Khan" "White"
    Write-ColoredOutput "   Role: Superuser" "White"
    Write-ColoredOutput "   Department: Radiology" "White"
    Write-ColoredOutput "   Permissions: Full System Access" "White"
    
    Write-ColoredOutput "`n🎉 Dr. Najeeb superuser account is ready!" "Green"
}

function Show-UsageExamples {
    Write-Header "Usage Examples & Next Steps"
    
    Write-ColoredOutput "🚀 Start Django Development Server:" "Yellow"
    Write-ColoredOutput "   cd medixscan" "White"
    Write-ColoredOutput "   python manage.py runserver" "White"
    
    Write-ColoredOutput "`n🌐 Access Django Admin:" "Yellow"
    Write-ColoredOutput "   1. Start the development server" "White"
    Write-ColoredOutput "   2. Open browser to http://localhost:8000/admin/" "White"
    Write-ColoredOutput "   3. Login with Dr. Najeeb credentials" "White"
    
    Write-ColoredOutput "`n👥 Create Additional Users:" "Yellow"
    Write-ColoredOutput "   python manage.py create_superuser_soft --interactive" "White"
    
    Write-ColoredOutput "`n🚀 Production Deployment:" "Yellow"
    Write-ColoredOutput "   railway run python manage.py create_superuser_soft" "White"
    
    Write-ColoredOutput "`n🔧 Useful Management Commands:" "Yellow"
    Write-ColoredOutput "   python manage.py createsuperuser" "White"
    Write-ColoredOutput "   python manage.py changepassword drnajeeb@gmail.com" "White"
    Write-ColoredOutput "   python manage.py shell" "White"
}

function Show-SecurityReminders {
    Write-Header "Security Reminders"
    
    Write-ColoredOutput "⚠️ Important Security Notes:" "Yellow"
    Write-ColoredOutput "   1. Store credentials securely in production" "White"
    Write-ColoredOutput "   2. Use environment variables for sensitive data" "White"
    Write-ColoredOutput "   3. Regularly update passwords" "White"
    Write-ColoredOutput "   4. Enable 2FA when possible" "White"
    Write-ColoredOutput "   5. Monitor login activities" "White"
    Write-ColoredOutput "   6. Use HTTPS in production" "White"
}

# Main execution function
function Main {
    try {
        Write-ColoredOutput "🚀 MediXScan Superuser Creation Script" "Blue"
        Write-ColoredOutput "=====================================" "Blue"
        
        Test-Environment
        Set-EnvironmentVariables
        Invoke-DatabaseMigrations
        New-DrNajeebSuperuser
        Test-SuperuserCreation
        
        Show-AccessInformation
        Show-UsageExamples
        Show-SecurityReminders
        
        Write-ColoredOutput "`n🎉 Superuser creation completed successfully!" "Green"
        
    } catch {
        Write-ColoredOutput "`n❌ Script failed: $($_.Exception.Message)" "Red"
        exit 1
    }
}

# Handle Ctrl+C gracefully
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-ColoredOutput "`n❌ Script interrupted by user" "Red"
}

# Execute main function
Main