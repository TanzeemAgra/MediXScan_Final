# Compare used vs exported FA icons

# Used FA icons (filtered to actual icon names)
$usedIcons = @(
    "FaAmbulance", "FaAnalytics", "FaBell", "FaBirthdayCake", "FaBrain", 
    "FaCalendar", "FaCalendarAlt", "FaChartBar", "FaChartLine", "FaChartPie", 
    "FaCheck", "FaChevronDown", "FaChevronLeft", "FaChevronRight", "FaChevronUp",
    "FaClipboardList", "FaClock", "FaCog", "FaComment", "FaDashboard", 
    "FaDownload", "FaEdit", "FaEllipsisV", "FaEnvelope", "FaExclamationCircle", 
    "FaExclamationTriangle", "FaEye", "FaEyeSlash", "FaFile", "FaFileAlt", 
    "FaFilter", "FaFolderOpen", "FaGears", "FaHeart", "FaHeartbeat", "FaHome", 
    "FaHospital", "FaIdCard", "FaInfoCircle", "FaMicrochip", "FaMinus", 
    "FaPhone", "FaPlus", "FaPrescriptionBottleAlt", "FaPrint", "FaRefresh", 
    "FaRobot", "FaSave", "FaSchedule", "FaSearch", "FaShoppingCart", "FaSort", 
    "FaSortDown", "FaSortUp", "FaSpinner", "FaStar", "FaStethoscope", "FaSyringe", 
    "FaTachometerAlt", "FaThumbsDown", "FaThumbsUp", "FaTimes", "FaTrash", 
    "FaTrendDown", "FaTrendUp", "FaTrophy", "FaUpload", "FaUser", "FaUserCircle", 
    "FaUserMd", "FaUserPlus", "FaUsers", "FaVolumeMute", "FaVolumeUp"
)

# Exported icons
$exportedIcons = @(
    "FaAmbulance", "FaAnalytics", "FaBell", "FaBirthdayCake", "FaBrain", 
    "FaCalendar", "FaCalendarAlt", "FaChartBar", "FaChartLine", "FaChartPie", 
    "FaCheck", "FaClipboardList", "FaClock", "FaCog", "FaComment", "FaDashboard", 
    "FaDownload", "FaEdit", "FaEllipsisV", "FaEnvelope", "FaExclamationCircle", 
    "FaExclamationTriangle", "FaEye", "FaEyeSlash", "FaFile", "FaFileAlt", 
    "FaFilter", "FaFolderOpen", "FaGears", "FaHeartbeat", "FaHome", "FaHospital", 
    "FaIdCard", "FaInfoCircle", "FaMicrochip", "FaMinus", "FaPhone", "FaPlus", 
    "FaPrescriptionBottleAlt", "FaPrint", "FaRefresh", "FaRobot", "FaSave", 
    "FaSchedule", "FaSearch", "FaSort", "FaSortDown", "FaSortUp", "FaStethoscope", 
    "FaSyringe", "FaTachometerAlt", "FaTimes", "FaTrash", "FaTrendDown", 
    "FaTrendUp", "FaTrophy", "FaUpload", "FaUser", "FaUserCircle", "FaUserMd", 
    "FaUserPlus", "FaUsers", "FaVolumeMute", "FaVolumeUp", "FaXRay"
)

# Find missing icons
$missingIcons = $usedIcons | Where-Object { $_ -notin $exportedIcons }

Write-Host "🔍 MediXScan Icon Analysis Results" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Used icons: $($usedIcons.Count)" -ForegroundColor Yellow
Write-Host "Exported icons: $($exportedIcons.Count)" -ForegroundColor Green
Write-Host "Missing icons: $($missingIcons.Count)" -ForegroundColor Red

if ($missingIcons.Count -gt 0) {
    Write-Host "`n❌ Missing Icons:" -ForegroundColor Red
    $missingIcons | Sort-Object | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
} else {
    Write-Host "`n✅ All icons are properly exported!" -ForegroundColor Green
}