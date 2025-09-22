# 🚀 Vercel Deployment Script for MediXScan Frontend (PowerShell)
# Usage: .\deploy-vercel.ps1 [Environment]
# Environment: production (default) | preview | development

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("production", "preview", "development")]
    [string]$Environment = "production"
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
    Write-ColoredOutput ("=" * 50) "Blue"
}

function Test-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check if we're in frontend directory
    if (-not (Test-Path "package.json")) {
        Write-ColoredOutput "❌ Error: package.json not found. Please run this script from the frontend directory." "Red"
        exit 1
    }
    Write-ColoredOutput "✅ Found package.json" "Green"
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-ColoredOutput "✅ Node.js version: $nodeVersion" "Green"
    } catch {
        Write-ColoredOutput "❌ Node.js not found. Please install Node.js first." "Red"
        exit 1
    }
    
    # Check Vercel CLI
    try {
        $vercelVersion = vercel --version
        Write-ColoredOutput "✅ Vercel CLI found: $vercelVersion" "Green"
    } catch {
        Write-ColoredOutput "📦 Installing Vercel CLI..." "Yellow"
        npm install -g vercel
        Write-ColoredOutput "✅ Vercel CLI installed" "Green"
    }
}

function Initialize-Environment {
    Write-Header "Environment Configuration"
    
    $envFile = ".env.$Environment"
    
    if ($Environment -eq "production") {
        $envFile = ".env.production"
        
        # Create production environment file if not exists
        if (-not (Test-Path $envFile)) {
            Write-ColoredOutput "⚠️ Creating production environment file..." "Yellow"
            
            $envContent = @"
VITE_API_URL=https://medixscanfinal-production.up.railway.app
VITE_API_TIMEOUT=15000
VITE_NODE_ENV=production
VITE_APP_NAME=MediXScan
VITE_APP_VERSION=1.0.0
VITE_RAILWAY_BACKEND=https://medixscanfinal-production.up.railway.app
MODE=production
"@
            $envContent | Out-File -FilePath $envFile -Encoding UTF8
        }
        
        Write-ColoredOutput "✅ Production environment configured with Railway backend" "Green"
    }
    
    Write-ColoredOutput "Environment: $Environment" "Blue"
}

function Test-Build {
    Write-Header "Build Validation"
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-ColoredOutput "📦 Installing dependencies..." "Yellow"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-ColoredOutput "❌ Failed to install dependencies" "Red"
            exit 1
        }
    }
    Write-ColoredOutput "✅ Dependencies ready" "Green"
    
    # Test build
    Write-ColoredOutput "🔨 Testing build process..." "Yellow"
    npm run build 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "✅ Build test successful" "Green"
        # Clean up test build
        if (Test-Path "dist") {
            Remove-Item -Recurse -Force "dist"
        }
    } else {
        Write-ColoredOutput "❌ Build test failed. Please check your code." "Red"
        exit 1
    }
}

function Deploy-ToVercel {
    Write-Header "Vercel Deployment"
    
    Write-ColoredOutput "🚀 Deploying to Vercel ($Environment environment)..." "Blue"
    
    switch ($Environment) {
        "production" {
            Write-ColoredOutput "Deploying to production with Railway backend integration..." "Yellow"
            vercel --prod --yes
        }
        "preview" {
            Write-ColoredOutput "Creating preview deployment..." "Yellow"  
            vercel --yes
        }
        "development" {
            Write-ColoredOutput "Creating development deployment..." "Yellow"
            vercel --yes
        }
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Deployment failed" "Red"
        exit 1
    }
    
    Write-ColoredOutput "✅ Deployment completed successfully!" "Green"
}

function Test-Deployment {
    Write-Header "Post-Deployment Validation"
    
    try {
        # Get latest deployment URL
        $deploymentInfo = vercel ls --limit 1 --format plain 2>$null
        if ($deploymentInfo) {
            $deploymentUrl = ($deploymentInfo -split "`n")[0] -split " " | Select-Object -Index 1
            
            if ($deploymentUrl) {
                Write-ColoredOutput "✅ Deployment URL: https://$deploymentUrl" "Green"
                
                # Test accessibility
                try {
                    $response = Invoke-WebRequest -Uri "https://$deploymentUrl" -Method Head -TimeoutSec 30 -ErrorAction Stop
                    if ($response.StatusCode -eq 200) {
                        Write-ColoredOutput "✅ Deployment is accessible" "Green"
                    }
                } catch {
                    Write-ColoredOutput "⚠️ Deployment may still be initializing..." "Yellow"
                }
            }
        }
    } catch {
        Write-ColoredOutput "⚠️ Could not retrieve deployment information" "Yellow"
    }
}

function Show-Summary {
    Write-Header "Deployment Summary"
    
    Write-ColoredOutput "Environment: $Environment" "Yellow"
    Write-ColoredOutput "Framework: Vite + React" "Yellow"
    Write-ColoredOutput "Backend: https://medixscanfinal-production.up.railway.app" "Yellow" 
    Write-ColoredOutput "Build Output: dist/" "Yellow"
    Write-ColoredOutput "Node.js: $(node --version)" "Yellow"
    
    Write-ColoredOutput "`n🎉 MediXScan frontend deployment completed!" "Green"
    
    Write-ColoredOutput "`nNext Steps:" "Blue"
    Write-ColoredOutput "1. Test the deployment URL" "White"
    Write-ColoredOutput "2. Verify API connectivity with Railway backend" "White"
    Write-ColoredOutput "3. Check dashboard and radiology pages" "White"
    Write-ColoredOutput "4. Monitor Vercel deployment logs for any issues" "White"
    Write-ColoredOutput "`n🔗 Useful Commands:" "Blue"
    Write-ColoredOutput "- vercel logs: View deployment logs" "White"
    Write-ColoredOutput "- vercel domains: Manage custom domains" "White"
    Write-ColoredOutput "- vercel env: Manage environment variables" "White"
}

# Main execution
function Main {
    try {
        Write-Header "MediXScan Frontend Deployment"
        
        Test-Prerequisites
        Initialize-Environment
        Test-Build
        Deploy-ToVercel
        Test-Deployment
        Show-Summary
        
    } catch {
        Write-ColoredOutput "`n❌ Deployment failed: $($_.Exception.Message)" "Red"
        exit 1
    }
}

# Handle Ctrl+C gracefully
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-ColoredOutput "`n❌ Deployment interrupted" "Red"
}

# Execute main function
Main