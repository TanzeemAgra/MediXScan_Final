# Icon Detection PowerShell Script
# Searches for FA icons in JSX files and reports missing exports

Write-Host "🔍 MediXScan Icon Detection System" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Define search paths
$searchPaths = @(
    "src\components",
    "src\views"
)

$iconUtilsPath = "src\utils\icons.utils.jsx"

# Get exported icons from icons.utils.jsx
function Get-ExportedIcons {
    if (Test-Path $iconUtilsPath) {
        $content = Get-Content $iconUtilsPath -Raw
        $exportMatches = [regex]::Matches($content, "export const (Fa[A-Za-z0-9_]+)")
        return $exportMatches | ForEach-Object { $_.Groups[1].Value }
    }
    return @()
}

# Find all FA icon usage in files
function Find-IconUsage {
    param($searchPath)
    
    $icons = @{}
    
    if (Test-Path $searchPath) {
        Get-ChildItem -Path $searchPath -Recurse -Include "*.jsx", "*.js" | ForEach-Object {
            $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
            if ($content) {
                # Find import statements with FA icons
                $importMatches = [regex]::Matches($content, "import\s+{[^}]*}")
                foreach ($match in $importMatches) {
                    $iconMatches = [regex]::Matches($match.Value, "Fa[A-Za-z0-9_]+")
                    foreach ($iconMatch in $iconMatches) {
                        $icons[$iconMatch.Value] = $true
                    }
                }
                
                # Find JSX usage <FaIcon />
                $usageMatches = [regex]::Matches($content, "<Fa[A-Za-z0-9_]+")
                foreach ($match in $usageMatches) {
                    $icon = $match.Value.Replace('<', '')
                    $icons[$icon] = $true
                }
                
                # Find direct references
                $refMatches = [regex]::Matches($content, "\bFa[A-Za-z0-9_]+\b")
                foreach ($match in $refMatches) {
                    $icons[$match.Value] = $true
                }
            }
        }
    }
    
    return $icons.Keys | Sort-Object
}

# Main execution
$exportedIcons = Get-ExportedIcons
Write-Host "✅ Found $($exportedIcons.Count) exported icons" -ForegroundColor Green

$allUsedIcons = @()
foreach ($searchPath in $searchPaths) {
    if (Test-Path $searchPath) {
        $icons = Find-IconUsage $searchPath
        $allUsedIcons += $icons
        Write-Host "📂 Scanned ${searchPath}: found $($icons.Count) icon references" -ForegroundColor Yellow
    }
}

$uniqueUsedIcons = $allUsedIcons | Sort-Object | Get-Unique
$missingIcons = $uniqueUsedIcons | Where-Object { $_ -notin $exportedIcons }

Write-Host "`n📊 Analysis Results:" -ForegroundColor Cyan
Write-Host "   Total icons used: $($uniqueUsedIcons.Count)"
Write-Host "   Icons exported: $($exportedIcons.Count)"
Write-Host "   Missing icons: $($missingIcons.Count)"

if ($missingIcons.Count -gt 0) {
    Write-Host "`n❌ Missing Icons:" -ForegroundColor Red
    $missingIcons | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    
    Write-Host "`n📝 Add these to icons.utils.jsx:" -ForegroundColor Yellow
    Write-Host "// Icon mappings:" -ForegroundColor Gray
    $missingIcons | ForEach-Object { 
        $remixIcon = switch ($_) {
            "FaTrendUp" { "RiTrendingUpFill" }
            "FaTrendDown" { "RiTrendingDownFill" }
            "FaChevronUp" { "RiArrowUpSFill" }
            "FaChevronDown" { "RiArrowDownSFill" }
            default { "RiQuestionFill" }
        }
        Write-Host "    ${_}: '$remixIcon'," -ForegroundColor Gray
    }
} else {
    Write-Host "`n✅ All icons are properly exported!" -ForegroundColor Green
}

Write-Host "`n🎯 All Used Icons:" -ForegroundColor Cyan
$uniqueUsedIcons | ForEach-Object { Write-Host "   - $_" }

Write-Host "`nDone! 🎉" -ForegroundColor Green