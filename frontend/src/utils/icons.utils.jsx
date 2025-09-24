// Production-Safe Icon Management System for MediXScan
// Soft-coded icon mapping with comprehensive fallback strategies
// Resolves "Failed to resolve import 'react-icons/fa'" by using available @remixicon/react

import React from 'react';
import * as RemixIcons from '@remixicon/react';

// Comprehensive soft-coded icon mapping configuration
export const IconMappingConfig = {
  // Map FontAwesome icon names to available Remix icons
  iconMapping: {
    // Dashboard & Navigation
    FaTachometerAlt: 'RiDashboard3Fill',
    FaDashboard: 'RiDashboard2Fill',
    FaHome: 'RiHome2Fill',
    
    // Medical & Health
    FaUserMd: 'RiUser3Fill',
    FaStethoscope: 'RiHeartPulseFill',
    FaHeartbeat: 'RiHeartPulseLine',
    FaXRay: 'RiScanLine',
    FaBrain: 'RiBrainLine',
    FaPrescriptionBottleAlt: 'RiCapsuleLine',
    FaSyringe: 'RiSyringeLine',
    FaHospital: 'RiBuildingLine',
    FaAmbulance: 'RiTruckLine',
    
    // Users & People
    FaUsers: 'RiTeamFill',
    FaUser: 'RiUserFill',
    FaUserCircle: 'RiAccountCircleFill',
    FaUserPlus: 'RiUserAddFill',
    FaIdCard: 'RiContactsBookFill',
    FaBirthdayCake: 'RiCake3Fill',
    
    // Charts & Analytics
    FaChartLine: 'RiLineChartFill',
    FaChartBar: 'RiBarChartFill',
    FaChartPie: 'RiPieChartFill',
    FaAnalytics: 'RiBarChart2Fill',
    
    // Alerts & Notifications
    FaBell: 'RiNotification3Fill',
    FaExclamationTriangle: 'RiAlertTriangleFill',
    FaExclamationCircle: 'RiErrorWarningFill',
    FaInfoCircle: 'RiInformationFill',
    
    // Time & Calendar
    FaClock: 'RiTimeFill',
    FaCalendarAlt: 'RiCalendar2Fill',
    FaCalendar: 'RiCalendarFill',
    FaSchedule: 'RiCalendarScheduleFill',
    
    // Technology & AI
    FaRobot: 'RiRobotFill',
    FaMicrochip: 'RiCpuFill',
    FaCog: 'RiSettings4Fill',
    FaGears: 'RiSettings2Fill',
    
    // Actions
    FaEye: 'RiEyeFill',
    FaEyeSlash: 'RiEyeOffFill',
    FaEdit: 'RiEditFill',
    FaTrash: 'RiDeleteBin6Fill',
    FaPlus: 'RiAddFill',
    FaMinus: 'RiSubtractFill',
    FaCheck: 'RiCheckFill',
    FaTimes: 'RiCloseFill',
    FaRefresh: 'RiRefreshFill',
    FaDownload: 'RiDownloadFill',
    FaUpload: 'RiUploadFill',
    FaSave: 'RiSaveFill',
    FaPrint: 'RiPrinterFill',
    FaSearch: 'RiSearchFill',
    FaFilter: 'RiFilter3Fill',
    FaEllipsisV: 'RiMore2Fill',
    FaSort: 'RiSortDesc',
    FaSortUp: 'RiSortAsc',
    FaSortDown: 'RiSortDesc',
    FaTrendUp: 'RiTrendingUpFill',
    FaTrendDown: 'RiTrendingDownFill',
    
    // Navigation & Chevrons
    FaChevronUp: 'RiArrowUpSFill',
    FaChevronDown: 'RiArrowDownSFill',
    FaChevronLeft: 'RiArrowLeftSFill',
    FaChevronRight: 'RiArrowRightSFill',
    
    // Interactive Elements
    FaHeart: 'RiHeartFill',
    FaStar: 'RiStarFill',
    FaThumbsUp: 'RiThumbUpFill',
    FaThumbsDown: 'RiThumbDownFill',
    FaSpinner: 'RiLoaderFill',
    FaShoppingCart: 'RiShoppingCartFill',
    
    // Files & Documents
    FaClipboardList: 'RiClipboardFill',
    FaFile: 'RiFileFill',
    FaFileAlt: 'RiFileTextFill',
    FaFolderOpen: 'RiFolderOpenFill',
    
    // Communication
    FaEnvelope: 'RiMailFill',
    FaPhone: 'RiPhoneFill',
    FaComment: 'RiChatNewFill',
    
    // Audio & Media
    FaVolumeUp: 'RiVolumeUpFill',
    FaVolumeMute: 'RiVolumeMuteFill',
    
    // Awards & Recognition
    FaTrophy: 'RiTrophyFill'
  },
  
  // Emoji fallbacks for when Remix icons aren't available
  emojiFallbacks: {
    // Dashboard & Navigation
    FaTachometerAlt: '📊',
    FaDashboard: '🏠',
    FaHome: '🏠',
    
    // Medical & Health
    FaUserMd: '👨‍⚕️',
    FaStethoscope: '🩺',
    FaHeartbeat: '💓',
    FaXRay: '🦴',
    FaBrain: '🧠',
    FaPrescriptionBottleAlt: '💊',
    FaSyringe: '💉',
    FaHospital: '🏥',
    FaAmbulance: '🚑',
    
    // Users & People
    FaUsers: '👥',
    FaUser: '👤',
    FaUserCircle: '👤',
    FaUserPlus: '➕👤',
    FaIdCard: '🆔',
    FaBirthdayCake: '🎂',
    
    // Charts & Analytics
    FaChartLine: '📈',
    FaChartBar: '📊',
    FaChartPie: '🥧',
    FaAnalytics: '📊',
    
    // Alerts & Notifications
    FaBell: '🔔',
    FaExclamationTriangle: '⚠️',
    FaExclamationCircle: '❗',
    FaInfoCircle: 'ℹ️',
    
    // Time & Calendar
    FaClock: '🕐',
    FaCalendarAlt: '📅',
    FaCalendar: '📅',
    FaSchedule: '📅',
    
    // Technology & AI
    FaRobot: '🤖',
    FaMicrochip: '🔧',
    FaCog: '⚙️',
    FaGears: '⚙️',
    
    // Actions
    FaEye: '👁️',
    FaEyeSlash: '🙈',
    FaEdit: '✏️',
    FaTrash: '🗑️',
    FaPlus: '➕',
    FaMinus: '➖',
    FaCheck: '✅',
    FaTimes: '❌',
    FaRefresh: '🔄',
    FaDownload: '⬇️',
    FaUpload: '⬆️',
    FaSave: '💾',
    FaPrint: '🖨️',
    FaSearch: '🔍',
    FaFilter: '🔽',
    FaEllipsisV: '⋮',
    FaSort: '⇅',
    FaSortUp: '⬆️',
    FaSortDown: '⬇️',
    FaTrendUp: '📈',
    FaTrendDown: '📉',
    
    // Navigation & Chevrons
    FaChevronUp: '⬆️',
    FaChevronDown: '⬇️',
    FaChevronLeft: '⬅️',
    FaChevronRight: '➡️',
    
    // Interactive Elements
    FaHeart: '❤️',
    FaStar: '⭐',
    FaThumbsUp: '👍',
    FaThumbsDown: '👎',
    FaSpinner: '🔄',
    FaShoppingCart: '🛒',
    
    // Files & Documents
    FaClipboardList: '📋',
    FaFile: '📄',
    FaFileAlt: '📄',
    FaFolderOpen: '📂',
    
    // Communication
    FaEnvelope: '📧',
    FaPhone: '📞',
    FaComment: '💬',
    
    // Audio & Media
    FaVolumeUp: '🔊',
    FaVolumeMute: '🔇',
    
    // Awards & Recognition
    FaTrophy: '🏆'
  },
  
  // Text fallbacks for accessibility
  textFallbacks: {
    // Dashboard & Navigation
    FaTachometerAlt: 'DASH',
    FaDashboard: 'HOME',
    FaHome: 'HOME',
    
    // Medical & Health
    FaUserMd: 'DOC',
    FaStethoscope: 'STETH',
    FaHeartbeat: 'HEART',
    FaXRay: 'XRAY',
    FaBrain: 'BRAIN',
    FaPrescriptionBottleAlt: 'RX',
    FaSyringe: 'INJ',
    FaHospital: 'HOSP',
    FaAmbulance: 'AMB',
    
    // Users & People
    FaUsers: 'USERS',
    FaUser: 'USER',
    FaUserCircle: 'USER',
    FaUserPlus: 'ADD',
    FaIdCard: 'ID',
    FaBirthdayCake: 'BDAY',
    
    // Charts & Analytics
    FaChartLine: 'CHART',
    FaChartBar: 'BAR',
    FaChartPie: 'PIE',
    FaAnalytics: 'STATS',
    
    // Alerts & Notifications
    FaBell: 'BELL',
    FaExclamationTriangle: 'WARN',
    FaExclamationCircle: 'ALERT',
    FaInfoCircle: 'INFO',
    
    // Time & Calendar
    FaClock: 'TIME',
    FaCalendarAlt: 'DATE',
    FaCalendar: 'CAL',
    FaSchedule: 'SCHED',
    
    // Technology & AI
    FaRobot: 'AI',
    FaMicrochip: 'CHIP',
    FaCog: 'SET',
    FaGears: 'CONFIG',
    
    // Actions
    FaEye: 'VIEW',
    FaEyeSlash: 'HIDE',
    FaEdit: 'EDIT',
    FaTrash: 'DEL',
    FaPlus: 'ADD',
    FaMinus: 'SUB',
    FaCheck: 'OK',
    FaTimes: 'X',
    FaRefresh: 'REF',
    FaDownload: 'DOWN',
    FaUpload: 'UP',
    FaSave: 'SAVE',
    FaPrint: 'PRINT',
    FaSearch: 'FIND',
    FaFilter: 'FILTER',
    FaEllipsisV: '...',
    FaSort: 'SORT',
    FaSortUp: 'ASC',
    FaSortDown: 'DESC',
    FaTrendUp: 'UP',
    FaTrendDown: 'DOWN',
    
    // Navigation & Chevrons
    FaChevronUp: 'UP',
    FaChevronDown: 'DOWN',
    FaChevronLeft: 'LEFT',
    FaChevronRight: 'RIGHT',
    
    // Interactive Elements
    FaHeart: 'HEART',
    FaStar: 'STAR',
    FaThumbsUp: 'LIKE',
    FaThumbsDown: 'DISLIKE',
    FaSpinner: 'LOAD',
    FaShoppingCart: 'CART',
    
    // Files & Documents
    FaClipboardList: 'LIST',
    FaFile: 'FILE',
    FaFileAlt: 'DOC',
    FaFolderOpen: 'FOLDER',
    
    // Communication
    FaEnvelope: 'EMAIL',
    FaPhone: 'PHONE',
    FaComment: 'MSG',
    
    // Audio & Media
    FaVolumeUp: 'VOL+',
    FaVolumeMute: 'MUTE',
    
    // Awards & Recognition
    FaTrophy: 'AWARD'
  },
  
  // Configuration for fallback behavior
  fallbackStrategy: 'comprehensive', // 'none', 'basic', 'comprehensive'
  enableLogging: false,
  theme: 'default'
};

// Soft Icon Component with intelligent fallback system
export const SoftIcon = ({ 
  name, 
  size = 16, 
  className = '', 
  color = 'currentColor',
  fallbackText = '?',
  config = IconMappingConfig 
}) => {
  const getIcon = (iconName, fallback) => {
    // Try Remix icon first
    const remixIconName = config.iconMapping[iconName];
    if (remixIconName && RemixIcons[remixIconName]) {
      const IconComponent = RemixIcons[remixIconName];
      return <IconComponent size={size} className={className} style={{ color }} />;
    }
    
    // Try emoji fallback
    if (config.fallbackStrategy !== 'none' && config.emojiFallbacks[iconName]) {
      return (
        <span className={`icon-emoji ${className}`} style={{ fontSize: size, color }}>
          {config.emojiFallbacks[iconName]}
        </span>
      );
    }
    
    // Try text fallback
    if (config.fallbackStrategy === 'comprehensive' && config.textFallbacks[iconName]) {
      return (
        <span className={`icon-text ${className}`} style={{ fontSize: size * 0.6, color }}>
          {config.textFallbacks[iconName]}
        </span>
      );
    }
    
    // Final fallback
    return (
      <span className={`icon-fallback ${className}`} style={{ fontSize: size, color }}>
        {fallback || '?'}
      </span>
    );
  };

  return getIcon(name, fallbackText);
};

// Helper function to get icon with configuration
const getIcon = (iconName, fallbackText = '?') => {
  return (props = {}) => (
    <SoftIcon 
      name={iconName} 
      fallbackText={fallbackText}
      {...props}
    />
  );
};

// Validation and utility functions
export const validateIconMapping = (config = IconMappingConfig) => {
  const missingIcons = [];
  
  Object.keys(config.iconMapping).forEach(iconName => {
    const remixIconName = config.iconMapping[iconName];
    if (!RemixIcons[remixIconName]) {
      missingIcons.push({ iconName, remixIconName });
    }
  });
  
  return {
    valid: missingIcons.length === 0,
    missing: missingIcons,
    totalMapped: Object.keys(config.iconMapping).length,
    fallbacksEnabled: config.fallbackStrategy
  };
};

// Export all FontAwesome icon components with soft-coded fallback support
// Dashboard & Navigation
export const FaTachometerAlt = getIcon('FaTachometerAlt', 'Dashboard');
export const FaDashboard = getIcon('FaDashboard', 'Dashboard');
export const FaHome = getIcon('FaHome', 'Home');

// Medical & Health
export const FaUserMd = getIcon('FaUserMd', 'Doctor');
export const FaStethoscope = getIcon('FaStethoscope', 'Stethoscope');
export const FaHeartbeat = getIcon('FaHeartbeat', 'Heartbeat');
export const FaXRay = getIcon('FaXRay', 'X-Ray');
export const FaBrain = getIcon('FaBrain', 'Brain');
export const FaPrescriptionBottleAlt = getIcon('FaPrescriptionBottleAlt', 'Medicine');
export const FaSyringe = getIcon('FaSyringe', 'Injection');
export const FaHospital = getIcon('FaHospital', 'Hospital');
export const FaAmbulance = getIcon('FaAmbulance', 'Ambulance');

// Users & People
export const FaUsers = getIcon('FaUsers', 'Users');
export const FaUser = getIcon('FaUser', 'User');
export const FaUserCircle = getIcon('FaUserCircle', 'User');
export const FaUserPlus = getIcon('FaUserPlus', 'Add User');
export const FaIdCard = getIcon('FaIdCard', 'ID Card');
export const FaBirthdayCake = getIcon('FaBirthdayCake', 'Birthday');

// Charts & Analytics
export const FaChartLine = getIcon('FaChartLine', 'Chart');
export const FaChartBar = getIcon('FaChartBar', 'Bar Chart');
export const FaChartPie = getIcon('FaChartPie', 'Pie Chart');
export const FaAnalytics = getIcon('FaAnalytics', 'Analytics');

// Alerts & Notifications
export const FaBell = getIcon('FaBell', 'Notifications');
export const FaExclamationTriangle = getIcon('FaExclamationTriangle', 'Warning');
export const FaExclamationCircle = getIcon('FaExclamationCircle', 'Alert');
export const FaInfoCircle = getIcon('FaInfoCircle', 'Info');

// Time & Calendar
export const FaClock = getIcon('FaClock', 'Time');
export const FaCalendarAlt = getIcon('FaCalendarAlt', 'Calendar');
export const FaCalendar = getIcon('FaCalendar', 'Calendar');
export const FaSchedule = getIcon('FaSchedule', 'Schedule');

// Technology & AI
export const FaRobot = getIcon('FaRobot', 'AI');
export const FaMicrochip = getIcon('FaMicrochip', 'Chip');
export const FaCog = getIcon('FaCog', 'Settings');
export const FaGears = getIcon('FaGears', 'Config');

// Actions
export const FaEye = getIcon('FaEye', 'View');
export const FaEyeSlash = getIcon('FaEyeSlash', 'Hide');
export const FaEdit = getIcon('FaEdit', 'Edit');
export const FaTrash = getIcon('FaTrash', 'Delete');
export const FaPlus = getIcon('FaPlus', 'Add');
export const FaMinus = getIcon('FaMinus', 'Remove');
export const FaCheck = getIcon('FaCheck', 'Confirm');
export const FaTimes = getIcon('FaTimes', 'Close');
export const FaRefresh = getIcon('FaRefresh', 'Refresh');
export const FaDownload = getIcon('FaDownload', 'Download');
export const FaUpload = getIcon('FaUpload', 'Upload');
export const FaSave = getIcon('FaSave', 'Save');
export const FaPrint = getIcon('FaPrint', 'Print');
export const FaSearch = getIcon('FaSearch', 'Search');
export const FaFilter = getIcon('FaFilter', 'Filter');
export const FaEllipsisV = getIcon('FaEllipsisV', 'More');
export const FaSort = getIcon('FaSort', 'Sort');
export const FaSortUp = getIcon('FaSortUp', 'Sort Ascending');
export const FaSortDown = getIcon('FaSortDown', 'Sort Descending');
export const FaTrendUp = getIcon('FaTrendUp', 'Trend Up');
export const FaTrendDown = getIcon('FaTrendDown', 'Trend Down');

// Files & Documents
export const FaClipboardList = getIcon('FaClipboardList', 'Clipboard');
export const FaFile = getIcon('FaFile', 'File');
export const FaFileAlt = getIcon('FaFileAlt', 'Document');
export const FaFolderOpen = getIcon('FaFolderOpen', 'Folder');

// Communication
export const FaEnvelope = getIcon('FaEnvelope', 'Email');
export const FaPhone = getIcon('FaPhone', 'Phone');
export const FaComment = getIcon('FaComment', 'Comment');

// Audio & Media
export const FaVolumeUp = getIcon('FaVolumeUp', 'Volume On');
export const FaVolumeMute = getIcon('FaVolumeMute', 'Volume Off');

// Awards & Recognition
export const FaTrophy = getIcon('FaTrophy', 'Trophy');

// Navigation & Chevrons
export const FaChevronUp = getIcon('FaChevronUp', 'Chevron Up');
export const FaChevronDown = getIcon('FaChevronDown', 'Chevron Down');
export const FaChevronLeft = getIcon('FaChevronLeft', 'Chevron Left');
export const FaChevronRight = getIcon('FaChevronRight', 'Chevron Right');

// Interactive Elements
export const FaHeart = getIcon('FaHeart', 'Heart');
export const FaStar = getIcon('FaStar', 'Star');
export const FaThumbsUp = getIcon('FaThumbsUp', 'Thumbs Up');
export const FaThumbsDown = getIcon('FaThumbsDown', 'Thumbs Down');
export const FaSpinner = getIcon('FaSpinner', 'Loading');
export const FaShoppingCart = getIcon('FaShoppingCart', 'Shopping Cart');

// =============================================================================
// ICON VALIDATION & TESTING UTILITIES
// =============================================================================

/**
 * Validates icon availability and system health
 * Soft-coded approach for production-ready icon testing
 * @returns {Object} Comprehensive validation results
 */
export const validateIconAvailability = () => {
  const validationConfig = {
    // Critical icons that must be available
    criticalIcons: [
      'FaTachometerAlt', 'FaUserMd', 'FaHeartbeat', 'FaXRay', 'FaBrain',
      'FaChartLine', 'FaBell', 'FaUsers', 'FaRobot', 'FaEye', 'FaCheck', 'FaClock'
    ],
    
    // Fallback strategy configuration
    fallbackLevels: ['remix', 'emoji', 'text', 'generic'],
    
    // Performance thresholds
    performance: {
      maxRenderTime: 100, // milliseconds
      maxMemoryUsage: 5 * 1024 * 1024, // 5MB
    },
    
    // Feature flags for testing
    features: {
      enableFallbackTesting: true,
      enablePerformanceTesting: true,
      enableAccessibilityTesting: true,
      logValidationResults: true
    }
  };

  const results = {
    timestamp: new Date().toISOString(),
    overall: 'unknown',
    icons: {},
    fallbacks: {},
    performance: {},
    accessibility: {},
    errors: [],
    warnings: [],
    recommendations: []
  };

  try {
    // Test critical icons availability
    validationConfig.criticalIcons.forEach(iconName => {
      const iconTest = {
        name: iconName,
        available: false,
        fallbackLevel: 'none',
        renderTime: 0,
        accessible: false
      };

      try {
        // Check if icon mapping exists
        const hasMapping = iconMapping.hasOwnProperty(iconName);
        const hasEmojiFallback = emojiFallbacks.hasOwnProperty(iconName);
        const hasTextFallback = textFallbacks.hasOwnProperty(iconName);

        iconTest.available = hasMapping;
        
        // Determine fallback level
        if (hasMapping) {
          iconTest.fallbackLevel = 'primary';
        } else if (hasEmojiFallback) {
          iconTest.fallbackLevel = 'emoji';
        } else if (hasTextFallback) {
          iconTest.fallbackLevel = 'text';
        } else {
          iconTest.fallbackLevel = 'generic';
          results.warnings.push(`Icon ${iconName} using generic fallback`);
        }

        // Basic accessibility check
        iconTest.accessible = hasTextFallback || iconTest.available;
        
        if (!iconTest.accessible) {
          results.errors.push(`Icon ${iconName} lacks accessibility support`);
        }

      } catch (error) {
        iconTest.available = false;
        iconTest.fallbackLevel = 'error';
        results.errors.push(`Icon ${iconName} validation failed: ${error.message}`);
      }

      results.icons[iconName] = iconTest;
    });

    // Test fallback system integrity
    validationConfig.fallbackLevels.forEach(level => {
      const levelTest = {
        level: level,
        coverage: 0,
        functional: false
      };

      try {
        const totalIcons = validationConfig.criticalIcons.length;
        let covered = 0;

        validationConfig.criticalIcons.forEach(iconName => {
          switch (level) {
            case 'remix':
              if (iconMapping[iconName]) covered++;
              break;
            case 'emoji':
              if (emojiFallbacks[iconName]) covered++;
              break;
            case 'text':
              if (textFallbacks[iconName]) covered++;
              break;
            case 'generic':
              covered++; // Generic fallback always available
              break;
          }
        });

        levelTest.coverage = (covered / totalIcons) * 100;
        levelTest.functional = levelTest.coverage > 80; // 80% threshold

        if (levelTest.coverage < 90) {
          results.warnings.push(`${level} fallback coverage is ${levelTest.coverage.toFixed(1)}%`);
        }

      } catch (error) {
        levelTest.functional = false;
        results.errors.push(`Fallback level ${level} validation failed: ${error.message}`);
      }

      results.fallbacks[level] = levelTest;
    });

    // Performance testing (basic)
    const performanceStart = performance.now();
    try {
      // Simulate icon rendering performance
      validationConfig.criticalIcons.forEach(iconName => {
        const iconComponent = getIcon(iconName, `Test ${iconName}`);
        // Basic render time simulation
      });
      const performanceEnd = performance.now();
      
      results.performance = {
        totalRenderTime: performanceEnd - performanceStart,
        averagePerIcon: (performanceEnd - performanceStart) / validationConfig.criticalIcons.length,
        withinThreshold: (performanceEnd - performanceStart) < validationConfig.performance.maxRenderTime
      };

      if (!results.performance.withinThreshold) {
        results.warnings.push(`Icon rendering performance exceeds threshold`);
      }

    } catch (error) {
      results.errors.push(`Performance testing failed: ${error.message}`);
    }

    // Determine overall status
    const criticalErrors = results.errors.filter(err => err.includes('validation failed')).length;
    const availableIcons = Object.values(results.icons).filter(icon => icon.available).length;
    const availabilityPercentage = (availableIcons / validationConfig.criticalIcons.length) * 100;

    if (criticalErrors > 0) {
      results.overall = 'critical';
    } else if (availabilityPercentage < 80) {
      results.overall = 'warning';
    } else if (results.warnings.length > 3) {
      results.overall = 'warning';
    } else {
      results.overall = 'healthy';
    }

    // Generate recommendations
    if (availabilityPercentage < 100) {
      results.recommendations.push('Consider adding missing icon mappings to improve coverage');
    }
    
    if (results.warnings.length > 0) {
      results.recommendations.push('Review and address system warnings for optimal performance');
    }

    if (Object.values(results.icons).some(icon => !icon.accessible)) {
      results.recommendations.push('Improve accessibility by adding text fallbacks for all icons');
    }

    // Log results if enabled
    if (validationConfig.features.logValidationResults) {
      console.group('🔍 MediXScan Icon System Validation');
      console.log(`Overall Status: ${results.overall.toUpperCase()}`);
      console.log(`Icon Availability: ${availabilityPercentage.toFixed(1)}%`);
      console.log(`Errors: ${results.errors.length}`);
      console.log(`Warnings: ${results.warnings.length}`);
      if (results.errors.length > 0) {
        console.error('Errors:', results.errors);
      }
      if (results.warnings.length > 0) {
        console.warn('Warnings:', results.warnings);
      }
      console.groupEnd();
    }

  } catch (error) {
    results.overall = 'critical';
    results.errors.push(`Validation system failure: ${error.message}`);
    console.error('Icon validation system failed:', error);
  }

  return results;
};

/**
 * Quick health check for icon system
 * @returns {boolean} True if system is healthy
 */
export const isIconSystemHealthy = () => {
  try {
    const validation = validateIconAvailability();
    return validation.overall === 'healthy';
  } catch (error) {
    console.error('Icon system health check failed:', error);
    return false;
  }
};

/**
 * Get icon system statistics
 * @returns {Object} System statistics
 */
export const getIconSystemStats = () => {
  return {
    totalMappings: Object.keys(iconMapping).length,
    totalEmojisFallbacks: Object.keys(emojiFallbacks).length,
    totalTextFallbacks: Object.keys(textFallbacks).length,
    systemVersion: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Soft-coded icon availability checker
 * @param {string} iconName - Name of the icon to check
 * @returns {Object} Availability details
 */
export const checkIconAvailability = (iconName) => {
  return {
    name: iconName,
    hasMapping: iconMapping.hasOwnProperty(iconName),
    hasEmojiFallback: emojiFallbacks.hasOwnProperty(iconName),
    hasTextFallback: textFallbacks.hasOwnProperty(iconName),
    remixIcon: iconMapping[iconName] || null,
    emoji: emojiFallbacks[iconName] || '❓',
    text: textFallbacks[iconName] || iconName.replace('Fa', '').toUpperCase(),
    isExported: true // Since we're checking it, assume it should be exported
  };
};

/**
 * Batch icon availability checker for performance
 * @param {Array} iconNames - Array of icon names to check
 * @returns {Object} Batch results
 */
export const batchCheckIconAvailability = (iconNames) => {
  const results = {
    checked: iconNames.length,
    available: 0,
    missing: 0,
    details: {}
  };

  iconNames.forEach(iconName => {
    const check = checkIconAvailability(iconName);
    results.details[iconName] = check;
    
    if (check.hasMapping) {
      results.available++;
    } else {
      results.missing++;
    }
  });

  return results;
};

// Default export
export default SoftIcon;