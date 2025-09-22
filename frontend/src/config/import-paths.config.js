// Import Path Configuration
// Centralized import path management for soft coding approach

const importPaths = {
  // Hooks
  hooks: {
    useRBAC: '../hooks/useRBAC.jsx',
    useApi: '../hooks/useApi',
    useAuth: '../hooks/useRBAC.jsx',
    usePermissions: '../hooks/useRBAC.jsx'
  },

  // Components  
  components: {
    RBACMiddleware: '../components/RBACMiddleware',
    RouteHandler: '../components/RouteHandler',
    Card: '../components/Card'
  },

  // Configuration Files
  config: {
    rbacConfig: '../config/rbac.config',
    routesConfig: '../config/routes.config',
    navigationConfig: '../config/navigation.config',
    apiConfig: '../config/api.config',
    radiologyDashboardConfig: '../config/radiology-dashboard.config',
    authRoutesConfig: '../config/auth-routes.config',
    routeManagerConfig: '../config/route-manager.config',
    landingPageConfig: '../config/landing-page.config',
    environmentConfig: '../config/environment.config',
    importPathsConfig: '../config/import-paths.config'
  },

  // Services
  services: {
    apiService: '../services/api.service'
  },

  // Views
  views: {
    auth: {
      signIn: '../views/auth/sign-in',
      signUp: '../views/auth/sign-up',
      rbacLogin: '../views/auth/rbac-login'
    },
    dashboard: {
      realData: '../views/dashboard-real-data',
      advancedRadiology: '../views/radiology/AdvancedRadiologyDashboard'
    },
    radiology: {
      xrayReports: '../views/radiology/xray-reports',
      ctScans: '../views/radiology/ct-scans',
      mriResults: '../views/radiology/mri-results',
      ultrasound: '../views/radiology/ultrasound',
      scheduleImaging: '../views/radiology/schedule-imaging'
    }
  },

  // Layouts
  layouts: {
    defaultLayout: '../layouts/defaultLayout',
    blankLayout: '../layouts/blank-layout'
  },

  // External Libraries
  external: {
    react: 'react',
    reactRouter: 'react-router-dom',
    bootstrap: 'react-bootstrap',
    apexCharts: 'react-apexcharts'
  },

  // Utilities
  utils: {
    dom: '../utilities/dom',
    colors: '../utilities/colors',
    setting: '../utilities/setting'
  }
};

// Helper function to get import path
export const getImportPath = (category, item, subItem = null) => {
  if (subItem) {
    return importPaths[category]?.[item]?.[subItem] || null;
  }
  return importPaths[category]?.[item] || null;
};

// Helper function to validate import path exists
export const validateImportPath = (path) => {
  // In a real implementation, this could check if the file exists
  return path && typeof path === 'string' && path.length > 0;
};

// Generate dynamic imports for components
export const generateImports = (requiredImports) => {
  const imports = {};
  
  for (const [alias, pathConfig] of Object.entries(requiredImports)) {
    const { category, item, subItem } = pathConfig;
    const path = getImportPath(category, item, subItem);
    
    if (validateImportPath(path)) {
      imports[alias] = path;
    } else {
      console.warn(`Import path not found for: ${category}.${item}${subItem ? `.${subItem}` : ''}`);
    }
  }
  
  return imports;
};

// Resolve relative paths based on current file location
export const resolveRelativePath = (fromPath, toPath) => {
  // Simple relative path resolver
  const fromParts = fromPath.split('/').filter(part => part && part !== '.');
  const toParts = toPath.split('/').filter(part => part && part !== '.');
  
  let relativePath = '';
  let commonIndex = 0;
  
  // Find common path
  while (commonIndex < fromParts.length - 1 && commonIndex < toParts.length && 
         fromParts[commonIndex] === toParts[commonIndex]) {
    commonIndex++;
  }
  
  // Add '../' for each level up from the current file
  const levelsUp = fromParts.length - commonIndex - 1;
  relativePath = '../'.repeat(levelsUp);
  
  // Add the path to the target
  const targetPath = toParts.slice(commonIndex).join('/');
  relativePath += targetPath;
  
  return relativePath.startsWith('./') ? relativePath : './' + relativePath;
};

// Common import patterns
export const commonImportPatterns = {
  // React and Router imports
  reactBase: {
    react: importPaths.external.react,
    reactRouter: importPaths.external.reactRouter,
    bootstrap: importPaths.external.bootstrap
  },
  
  // RBAC imports
  rbacBase: {
    useAuth: importPaths.hooks.useAuth,
    usePermissions: importPaths.hooks.usePermissions,
    rbacConfig: importPaths.config.rbacConfig,
    RBACMiddleware: importPaths.components.RBACMiddleware
  },
  
  // API imports
  apiBase: {
    useApi: importPaths.hooks.useApi,
    apiService: importPaths.services.apiService,
    apiConfig: importPaths.config.apiConfig
  },
  
  // Dashboard imports
  dashboardBase: {
    Card: importPaths.components.Card,
    apexCharts: importPaths.external.apexCharts,
    radiologyDashboardConfig: importPaths.config.radiologyDashboardConfig
  }
};

// Import validation rules
export const importValidationRules = {
  // Required imports for specific component types
  rbacComponent: ['useAuth', 'usePermissions', 'rbacConfig'],
  dashboardComponent: ['useApi', 'Card'],
  routeComponent: ['reactRouter'],
  
  // Circular dependency detection
  circularDependencies: [
    ['components/RBACMiddleware', 'hooks/useRBAC.jsx'],
    ['config/rbac.config', 'hooks/useRBAC.jsx']
  ]
};

// Debug function to check import paths
export const debugImportPaths = (componentName, requiredPaths) => {
  // Use import.meta.env.MODE for Vite compatibility
  if (import.meta.env.MODE === 'development') {
    console.group(`🔍 Import Debug: ${componentName}`);
    
    requiredPaths.forEach(pathKey => {
      const [category, item, subItem] = pathKey.split('.');
      const path = getImportPath(category, item, subItem);
      
      console.log(`${pathKey}: ${path || '❌ NOT FOUND'}`);
    });
    
    console.groupEnd();
  }
};

export default importPaths;