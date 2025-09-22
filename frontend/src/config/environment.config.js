// Environment Configuration for Browser Compatibility
// Soft coding approach to handle environment variables across different environments

// Environment Detection Utility
const getEnvironment = () => {
  // Vite uses import.meta.env instead of process.env for browser compatibility
  const viteEnv = import.meta.env;
  
  // Create a process.env compatible object for legacy code
  const processEnv = {
    NODE_ENV: viteEnv.MODE || 'development',
    VITE_API_URL: viteEnv.VITE_API_URL,
    VITE_ENABLE_ROLE_SWITCHER: viteEnv.VITE_ENABLE_ROLE_SWITCHER,
    VITE_DEBUG: viteEnv.VITE_DEBUG,
    VITE_LOG_LEVEL: viteEnv.VITE_LOG_LEVEL || 'info',
    BASE_URL: viteEnv.BASE_URL,
    MODE: viteEnv.MODE,
    DEV: viteEnv.DEV,
    PROD: viteEnv.PROD,
    SSR: viteEnv.SSR
  };

  return {
    // Original Vite environment
    vite: viteEnv,
    
    // Process-compatible environment
    process: processEnv,
    
    // Environment flags
    isDevelopment: viteEnv.MODE === 'development',
    isProduction: viteEnv.MODE === 'production',
    isTest: viteEnv.MODE === 'test',
    
    // Feature flags
    features: {
      roleSwitcher: viteEnv.VITE_ENABLE_ROLE_SWITCHER === 'true',
      debug: viteEnv.VITE_DEBUG === 'true',
      hotReload: viteEnv.DEV === true,
      sourceMap: viteEnv.MODE === 'development'
    }
  };
};

// Environment instance
const env = getEnvironment();

// Export environment configurations
export const {
  vite: viteEnv,
  process: processEnv,
  isDevelopment,
  isProduction,
  isTest,
  features
} = env;

// Browser-safe process object for legacy compatibility
export const process = {
  env: processEnv
};

// Environment-specific configurations
export const environmentConfig = {
  development: {
    apiUrl: 'http://localhost:8000',
    frontendUrl: viteEnv.VITE_FRONTEND_URL || 'http://localhost:5173',
    debugEnabled: true,
    logLevel: 'debug',
    enableDevTools: true,
    enableRoleSwitcher: true,
    hotReload: true,
    strictMode: false,
    // Dynamic port detection settings
    portDetection: {
      enabled: true,
      defaultPorts: [5173, 5174, 5175, 3000, 3001],
      timeout: 3000,
      fallbackURL: 'http://localhost:5173'
    },
    // URL configurations for different features with dynamic port support
    urls: {
      reportCorrection: `${viteEnv.VITE_FRONTEND_URL || 'http://localhost:5173'}/radiology/report-correction`,
      radiologyDashboard: `${viteEnv.VITE_FRONTEND_URL || 'http://localhost:5173'}/radiology/dashboard`,
      anonymizer: `${viteEnv.VITE_FRONTEND_URL || 'http://localhost:5173'}/radiology/anonymizer`
    }
  },
  
  production: {
    apiUrl: viteEnv.VITE_API_URL || 'https://medixscanfinal-production.up.railway.app',
    frontendUrl: viteEnv.VITE_FRONTEND_URL || 'https://medixscan.vercel.app',
    debugEnabled: false,
    logLevel: 'error',
    enableDevTools: false,
    enableRoleSwitcher: false,
    hotReload: false,
    strictMode: true,
    // No port detection in production
    portDetection: {
      enabled: false,
      fallbackURL: viteEnv.VITE_FRONTEND_URL || 'https://medixscan.vercel.app'
    },
    // URL configurations for different features
    urls: {
      reportCorrection: `${viteEnv.VITE_FRONTEND_URL || 'https://medixscan.vercel.app'}/radiology/report-correction`,
      radiologyDashboard: `${viteEnv.VITE_FRONTEND_URL || 'https://medixscan.vercel.app'}/radiology/dashboard`,
      anonymizer: `${viteEnv.VITE_FRONTEND_URL || 'https://medixscan.vercel.app'}/radiology/anonymizer`
    }
  },
  
  staging: {
    apiUrl: viteEnv.VITE_STAGING_API_URL || 'https://staging-api.medixscan.com',
    frontendUrl: viteEnv.VITE_STAGING_FRONTEND_URL || 'https://staging.medixscan.vercel.app',
    debugEnabled: true,
    logLevel: 'info',
    enableDevTools: true,
    enableRoleSwitcher: true,
    hotReload: false,
    strictMode: false,
    // Limited port detection for staging
    portDetection: {
      enabled: true,
      defaultPorts: [5173, 3000],
      timeout: 5000,
      fallbackURL: viteEnv.VITE_STAGING_FRONTEND_URL || 'https://staging.medixscan.vercel.app'
    },
    // URL configurations for different features
    urls: {
      reportCorrection: `${viteEnv.VITE_STAGING_FRONTEND_URL || 'https://staging.medixscan.vercel.app'}/radiology/report-correction`,
      radiologyDashboard: `${viteEnv.VITE_STAGING_FRONTEND_URL || 'https://staging.medixscan.vercel.app'}/radiology/dashboard`,
      anonymizer: `${viteEnv.VITE_STAGING_FRONTEND_URL || 'https://staging.medixscan.vercel.app'}/radiology/anonymizer`
    }
  },
  
  test: {
    apiUrl: 'http://localhost:8001',
    frontendUrl: 'http://localhost:5173',
    debugEnabled: true,
    logLevel: 'warn',
    enableDevTools: true,
    enableRoleSwitcher: true,
    hotReload: false,
    strictMode: true,
    // URL configurations for different features
    urls: {
      reportCorrection: 'http://localhost:5173/radiology/report-correction',
      radiologyDashboard: 'http://localhost:5173/radiology/dashboard',
      anonymizer: 'http://localhost:5173/radiology/anonymizer'
    }
  }
};

// Get current environment configuration
export const getCurrentEnvironmentConfig = () => {
  return environmentConfig[processEnv.NODE_ENV] || environmentConfig.development;
};

// Environment validation
export const validateEnvironment = () => {
  const requiredVars = ['VITE_API_URL'];
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!viteEnv[varName] && isProduction) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0 && isProduction) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

// Environment-based feature toggle
export const isFeatureEnabled = (featureName) => {
  const config = getCurrentEnvironmentConfig();
  
  switch (featureName) {
    case 'roleSwitcher':
      return config.enableRoleSwitcher;
    case 'debug':
      return config.debugEnabled;
    case 'devTools':
      return config.enableDevTools;
    case 'hotReload':
      return config.hotReload;
    default:
      return false;
  }
};

// Safe environment variable getter
export const getEnvVar = (key, defaultValue = undefined) => {
  return viteEnv[key] || processEnv[key] || defaultValue;
};

// Environment-based URL builder
export const buildApiUrl = (endpoint = '') => {
  const config = getCurrentEnvironmentConfig();
  const baseUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  
  return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
};

// Frontend URL builder
export const buildFrontendUrl = (path = '') => {
  const config = getCurrentEnvironmentConfig();
  const baseUrl = config.frontendUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.replace(/^\//, ''); // Remove leading slash
  
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
};

// Get specific feature URLs
export const getFeatureUrl = (featureName) => {
  const config = getCurrentEnvironmentConfig();
  return config.urls[featureName] || null;
};

// URL helpers for different features
export const urlHelpers = {
  // Report correction system URLs
  reportCorrection: () => getFeatureUrl('reportCorrection'),
  radiologyDashboard: () => getFeatureUrl('radiologyDashboard'),
  anonymizer: () => getFeatureUrl('anonymizer'),
  
  // Dynamic URL builders
  buildReportCorrectionUrl: (params = {}) => {
    const baseUrl = getFeatureUrl('reportCorrection');
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      return `${baseUrl}?${searchParams.toString()}`;
    }
    return baseUrl;
  },
  
  // Build full page URLs for sharing/redirects
  buildShareableUrl: (path, params = {}) => {
    const fullUrl = buildFrontendUrl(path);
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      return `${fullUrl}?${searchParams.toString()}`;
    }
    return fullUrl;
  }
};

// Debug logging with environment awareness
export const envLog = (level, message, data = null) => {
  const config = getCurrentEnvironmentConfig();
  
  if (!config.debugEnabled && level === 'debug') {
    return;
  }
  
  const logLevels = ['debug', 'info', 'warn', 'error'];
  const currentLevelIndex = logLevels.indexOf(config.logLevel);
  const messageLevelIndex = logLevels.indexOf(level);
  
  if (messageLevelIndex >= currentLevelIndex) {
    console[level](`[${processEnv.NODE_ENV.toUpperCase()}] ${message}`, data || '');
  }
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    mode: processEnv.NODE_ENV,
    isDev: isDevelopment,
    isProd: isProduction,
    isTest: isTest,
    features: features,
    config: getCurrentEnvironmentConfig(),
    viteEnv: {
      MODE: viteEnv.MODE,
      DEV: viteEnv.DEV,
      PROD: viteEnv.PROD,
      BASE_URL: viteEnv.BASE_URL
    }
  };
};

// Initialize environment validation on module load
if (isDevelopment) {
  envLog('debug', 'Environment configuration loaded', getEnvironmentInfo());
}

validateEnvironment();

export default {
  env: processEnv,
  vite: viteEnv,
  isDevelopment,
  isProduction,
  isTest,
  features,
  config: getCurrentEnvironmentConfig(),
  isFeatureEnabled,
  getEnvVar,
  buildApiUrl,
  buildFrontendUrl,
  getFeatureUrl,
  urlHelpers,
  envLog,
  getEnvironmentInfo,
  validateEnvironment
};