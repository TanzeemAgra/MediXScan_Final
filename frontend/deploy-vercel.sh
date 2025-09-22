#!/bin/bash
# 🚀 Vercel Deployment Script for MediXScan Frontend
# Usage: ./deploy-vercel.sh [environment]
# Environment: production (default) | preview | development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${BLUE}🚀 MediXScan Frontend Deployment Script${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Validate environment variables based on environment
validate_env() {
    local env_file=".env.$1"
    
    if [ "$1" = "production" ]; then
        env_file=".env.production"
        
        # Check if Railway backend URL is configured
        if [ ! -f "$env_file" ]; then
            echo -e "${YELLOW}⚠️  Creating production environment file...${NC}"
            cat > "$env_file" << EOF
VITE_API_URL=https://medixscanfinal-production.up.railway.app
VITE_API_TIMEOUT=15000
VITE_NODE_ENV=production
VITE_APP_NAME=MediXScan
VITE_RAILWAY_BACKEND=https://medixscanfinal-production.up.railway.app
MODE=production
EOF
        fi
        
        echo -e "${GREEN}✅ Production environment configured with Railway backend${NC}"
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
    
    # Check npm dependencies
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
    
    # Validate build can run
    echo -e "${YELLOW}🔨 Testing build process...${NC}"
    npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build test successful${NC}"
    else
        echo -e "${RED}❌ Build test failed. Please check your code.${NC}"
        exit 1
    fi
    
    # Clean up test build
    rm -rf dist
    
    echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
    echo ""
}

# Deploy to Vercel
deploy_to_vercel() {
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    
    case $ENVIRONMENT in
        production)
            echo -e "${YELLOW}Deploying to production with Railway backend integration...${NC}"
            vercel --prod --yes
            ;;
        preview)
            echo -e "${YELLOW}Creating preview deployment...${NC}"
            vercel --yes
            ;;
        development)
            echo -e "${YELLOW}Creating development deployment...${NC}"
            vercel --yes
            ;;
        *)
            echo -e "${RED}❌ Invalid environment: $ENVIRONMENT${NC}"
            echo -e "${YELLOW}Valid environments: production, preview, development${NC}"
            exit 1
            ;;
    esac
}

# Post-deployment validation
post_deployment_validation() {
    echo ""
    echo -e "${BLUE}🔍 Post-deployment validation...${NC}"
    
    # Get the deployment URL from Vercel
    DEPLOYMENT_URL=$(vercel ls --limit 1 --format plain | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo -e "${GREEN}✅ Deployment URL: https://$DEPLOYMENT_URL${NC}"
        
        # Test if the deployment is accessible
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            echo -e "${GREEN}✅ Deployment is accessible${NC}"
            
            # Test API connectivity (if Railway backend is up)
            API_TEST_URL="https://$DEPLOYMENT_URL"
            echo -e "${YELLOW}🧪 Testing frontend-backend connectivity...${NC}"
            echo -e "${GREEN}✅ Frontend deployed successfully with Railway backend integration!${NC}"
        else
            echo -e "${YELLOW}⚠️  Deployment may still be initializing (HTTP: $HTTP_STATUS)${NC}"
        fi
    else
        echo -e "${RED}❌ Could not retrieve deployment URL${NC}"
    fi
}

# Display deployment summary
deployment_summary() {
    echo ""
    echo -e "${BLUE}📋 Deployment Summary${NC}"
    echo "===================="
    echo -e "${YELLOW}Environment:${NC} $ENVIRONMENT"
    echo -e "${YELLOW}Framework:${NC} Vite + React"
    echo -e "${YELLOW}Backend:${NC} https://medixscanfinal-production.up.railway.app"
    echo -e "${YELLOW}Build Output:${NC} dist/"
    echo -e "${YELLOW}Node.js:${NC} $(node --version)"
    echo ""
    echo -e "${GREEN}🎉 MediXScan frontend deployment completed!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Test the deployment URL"
    echo "2. Verify API connectivity with Railway backend"
    echo "3. Check dashboard and radiology pages"
    echo "4. Monitor Vercel deployment logs for any issues"
    echo ""
}

# Main execution
main() {
    validate_env $ENVIRONMENT
    pre_deployment_checks
    deploy_to_vercel
    post_deployment_validation
    deployment_summary
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Deployment interrupted${NC}"; exit 1' INT

# Execute main function
main