#!/bin/bash
# 🚀 MediXScan Superuser Creation Script (Bash)
# Creates Dr. Najeeb superuser account using soft coding techniques

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"
MANAGE_PY="$BACKEND_DIR/medixscan/manage.py"

echo -e "${BLUE}🚀 MediXScan Superuser Creation Script${NC}"
echo -e "${BLUE}====================================${NC}"

# Function to check if we're in the right directory
check_environment() {
    echo -e "${YELLOW}🔍 Checking environment...${NC}"
    
    if [ ! -f "$MANAGE_PY" ]; then
        echo -e "${RED}❌ Error: manage.py not found at $MANAGE_PY${NC}"
        echo -e "${YELLOW}Please run this script from the backend directory${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Found Django project${NC}"
}

# Function to check Python and Django
check_dependencies() {
    echo -e "${YELLOW}🔍 Checking dependencies...${NC}"
    
    # Check Python
    if ! command -v python &> /dev/null; then
        echo -e "${RED}❌ Python not found${NC}"
        exit 1
    fi
    
    PYTHON_VERSION=$(python --version 2>&1)
    echo -e "${GREEN}✅ $PYTHON_VERSION${NC}"
    
    # Check Django
    cd "$BACKEND_DIR"
    if ! python -c "import django" &> /dev/null; then
        echo -e "${RED}❌ Django not installed${NC}"
        echo -e "${YELLOW}Installing Django...${NC}"
        pip install django
    fi
    
    echo -e "${GREEN}✅ Django available${NC}"
}

# Function to setup environment variables
setup_environment() {
    echo -e "${YELLOW}🔧 Setting up environment...${NC}"
    
    # Export Dr. Najeeb credentials as environment variables
    export SUPERUSER_EMAIL="drnajeeb@gmail.com"
    export SUPERUSER_PASSWORD="Najeeb@123"
    export SUPERUSER_FIRST_NAME="Dr. Najeeb"
    export SUPERUSER_LAST_NAME="Khan"
    
    echo -e "${GREEN}✅ Environment variables configured${NC}"
}

# Function to run Django migrations
run_migrations() {
    echo -e "${YELLOW}🔄 Running database migrations...${NC}"
    
    cd "$BACKEND_DIR/medixscan"
    
    # Check if database needs migrations
    python manage.py showmigrations --list | grep -q '\[ \]'
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}Running pending migrations...${NC}"
        python manage.py migrate
    else
        echo -e "${GREEN}✅ Database is up to date${NC}"
    fi
}

# Function to create superuser using our custom command
create_superuser() {
    echo -e "${YELLOW}👤 Creating Dr. Najeeb superuser account...${NC}"
    
    cd "$BACKEND_DIR/medixscan"
    
    # Use our custom management command with soft coding
    python manage.py create_superuser_soft \
        --email "drnajeeb@gmail.com" \
        --password "Najeeb@123" \
        --first-name "Dr. Najeeb" \
        --last-name "Khan" \
        --force
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Superuser created successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to create superuser${NC}"
        exit 1
    fi
}

# Function to verify superuser creation
verify_creation() {
    echo -e "${YELLOW}✅ Verifying superuser creation...${NC}"
    
    cd "$BACKEND_DIR/medixscan"
    
    # Check if user exists and has correct permissions
    python -c "
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
    
    if user.is_superuser and user.is_staff and user.is_active:
        print('🎉 Superuser verification PASSED!')
    else:
        print('❌ Superuser verification FAILED!')
        exit(1)
        
except User.DoesNotExist:
    print('❌ User not found!')
    exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Superuser verification passed${NC}"
    else
        echo -e "${RED}❌ Superuser verification failed${NC}"
        exit 1
    fi
}

# Function to display access information
display_access_info() {
    echo -e "${BLUE}🌐 Django Admin Access Information${NC}"
    echo -e "${BLUE}=================================${NC}"
    echo ""
    echo -e "${YELLOW}🔗 Admin URLs:${NC}"
    echo "Local Development: http://localhost:8000/admin/"
    echo "Railway Production: https://medixscanfinal-production.up.railway.app/admin/"
    echo ""
    echo -e "${YELLOW}🔑 Login Credentials:${NC}"
    echo "Email: drnajeeb@gmail.com"
    echo "Password: Najeeb@123"
    echo ""
    echo -e "${YELLOW}👤 User Details:${NC}"
    echo "Name: Dr. Najeeb Khan"
    echo "Role: Superuser"
    echo "Permissions: Full System Access"
    echo ""
    echo -e "${GREEN}🎉 Dr. Najeeb superuser account is ready for use!${NC}"
}

# Function to show usage examples
show_usage_examples() {
    echo -e "${BLUE}📋 Usage Examples${NC}"
    echo -e "${BLUE}=================${NC}"
    echo ""
    echo -e "${YELLOW}Start Django Development Server:${NC}"
    echo "cd medixscan && python manage.py runserver"
    echo ""
    echo -e "${YELLOW}Access Django Admin:${NC}"
    echo "1. Start the server"
    echo "2. Open browser to http://localhost:8000/admin/"
    echo "3. Login with Dr. Najeeb credentials"
    echo ""
    echo -e "${YELLOW}Create Additional Users:${NC}"
    echo "python manage.py create_superuser_soft --interactive"
    echo ""
    echo -e "${YELLOW}Production Deployment:${NC}"
    echo "railway run python manage.py create_superuser_soft"
}

# Main execution
main() {
    echo -e "${GREEN}Starting Dr. Najeeb superuser creation process...${NC}"
    echo ""
    
    check_environment
    check_dependencies
    setup_environment
    run_migrations
    create_superuser
    verify_creation
    
    echo ""
    display_access_info
    echo ""
    show_usage_examples
    
    echo ""
    echo -e "${GREEN}🚀 Superuser creation completed successfully!${NC}"
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Script interrupted${NC}"; exit 1' INT

# Execute main function
main "$@"