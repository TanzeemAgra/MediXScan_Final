// Import Management Utility for Soft Coding
// Prevents duplicate imports and manages import dependencies

class ImportManager {
  constructor() {
    this.importRegistry = new Map();
    this.dependencyGraph = new Map();
  }

  // Register an import with validation
  registerImport(importName, importPath, category = 'component') {
    if (this.importRegistry.has(importName)) {
      const existing = this.importRegistry.get(importName);
      if (existing.path !== importPath) {
        console.warn(`Duplicate import detected: ${importName}`);
        console.warn(`Existing: ${existing.path}`);
        console.warn(`New: ${importPath}`);
        return false;
      }
    }

    this.importRegistry.set(importName, {
      path: importPath,
      category,
      lastUsed: new Date()
    });

    return true;
  }

  // Get all imports by category
  getImportsByCategory(category) {
    const imports = [];
    for (const [name, config] of this.importRegistry) {
      if (config.category === category) {
        imports.push({ name, ...config });
      }
    }
    return imports;
  }

  // Generate import statements
  generateImportStatements(category = null) {
    const imports = category 
      ? this.getImportsByCategory(category)
      : Array.from(this.importRegistry.entries()).map(([name, config]) => ({ name, ...config }));

    return imports.map(imp => `import ${imp.name} from "${imp.path}";`).join('\n');
  }

  // Validate import structure
  validateImports() {
    const errors = [];
    const warnings = [];
    
    // Check for circular dependencies
    for (const [name, config] of this.importRegistry) {
      if (this.hasCircularDependency(name)) {
        errors.push(`Circular dependency detected for: ${name}`);
      }
    }

    // Check for unused imports (basic check)
    for (const [name, config] of this.importRegistry) {
      const daysSinceLastUsed = (new Date() - config.lastUsed) / (1000 * 60 * 60 * 24);
      if (daysSinceLastUsed > 30) {
        warnings.push(`Potentially unused import: ${name} (not used in 30 days)`);
      }
    }

    return { errors, warnings };
  }

  // Check for circular dependencies (simplified)
  hasCircularDependency(importName, visited = new Set()) {
    if (visited.has(importName)) {
      return true;
    }

    visited.add(importName);
    const dependencies = this.dependencyGraph.get(importName) || [];
    
    for (const dep of dependencies) {
      if (this.hasCircularDependency(dep, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  // Clear registry
  clear() {
    this.importRegistry.clear();
    this.dependencyGraph.clear();
  }
}

// Router Import Configuration
export const routerImportConfig = {
  layouts: {
    DefaultLayout: "../layouts/defaultLayout",
    BlankLayout: "../layouts/blank-layout"
  },
  
  views: {
    // Main Views
    Index: "../views",
    DashboardWithRealData: "../views/dashboard-real-data",
    LandingPage: "../views/LandingPage",
    
    // Dashboard Pages
    HospitalDashboardOne: "../views/dashboard-pages/hospital-dashboard-one",
    HospitalDashboardTwo: "../views/dashboard-pages/hospital-dashboard-two",
    PatientDashboard: "../views/dashboard-pages/patient-dashboard",
    Covid19Dashboard: "../views/dashboard-pages/covid-19-dashboard",
    
    // Email Pages
    Inbox: "../views/email/inbox",
    EmailCompose: "../views/email/email-compose",
    
    // Doctor Pages
    AddDoctor: "../views/doctor/add-doctor",
    DoctorList: "../views/doctor/doctor-list",
    DoctorProfile: "../views/doctor/doctor-profile",
    EditDoctor: "../views/doctor/edit-doctor",
    
    // Calendar & Chat
    Calendar: "../views/calendar/calendar",
    Chat: "../views/chat/chat",
    
    // Radiology Pages
    AdvancedRadiologyDashboard: "../views/radiology/AdvancedRadiologyDashboard",
    XRayReports: "../views/radiology/xray-reports",
    CTScans: "../views/radiology/ct-scans",
    MRIResults: "../views/radiology/mri-results",
    UltrasoundReports: "../views/radiology/ultrasound-reports",
    ScheduleImaging: "../views/radiology/schedule-imaging",
    
    // Forms
    FormElement: "../views/forms/form-element",
    FormLayout: "../views/forms/form-layout",
    FormValidation: "../views/forms/form-validation",
    FormWizard: "../views/forms/form-wizard",
    
    // Tables
    BasicTable: "../views/tables/basic-table",
    DataTable: "../views/tables/data-table",
    EditTable: "../views/tables/editable-table",
    
    // Charts
    ApexChart: "../views/charts/apex-chart",
    ChartAm: "../views/charts/chart-am",
    ChartPage: "../views/charts/chart-page",
    EChart: "../views/charts/e-chart",
    
    // Icons
    Dripicons: "../views/icons/dripicons",
    FontAwsomeFive: "../views/icons/fontawesome-Five",
    Lineawesome: "../views/icons/line-awesome",
    Remixicon: "../views/icons/remixicon",
    Unicons: "../views/icons/unicons",
    
    // Maps
    GoogleMap: "../views/maps/google-map",
    
    // Extra Pages
    AccountSetting: "../views/extra-pages/account-setting",
    BlankPage: "../views/extra-pages/blank-page",
    CommingSoon: "../views/extra-pages/pages-comingsoon",
    Error404: "../views/extra-pages/pages-error-404",
    Error500: "../views/extra-pages/pages-error-500",
    Faq: "../views/extra-pages/pages-faq",
    Invoice: "../views/extra-pages/pages-invoice",
    Maintenance: "../views/extra-pages/pages-maintenance",
    PricingOne: "../views/extra-pages/pages-pricing-one",
    Pricing: "../views/extra-pages/pages-pricing",
    Timeline: "../views/extra-pages/pages-timeline",
    PrivacyPolicy: "../views/extra-pages/privacy-policy",
    PrivacySetting: "../views/extra-pages/privacy-setting",
    TermsOfService: "../views/extra-pages/terms-of-service",
    
    // Auth Pages
    SignIn: "../views/auth/sign-in",
    SignUp: "../views/auth/sign-up",
    ConformMail: "../views/auth/confirm-mail",
    RecoverPassword: "../views/auth/recover-password",
    LockScreen: "../views/auth/lock-screen",
    RBACLogin: "../views/auth/rbac-login"
  },
  
  components: {
    AuthRouteHandler: "../components/RouteHandler"
  },
  
  external: {
    // External libraries would go here
  }
};

// Generate imports for router
export const generateRouterImports = () => {
  const manager = new ImportManager();
  let imports = [];
  
  // Register layouts
  Object.entries(routerImportConfig.layouts).forEach(([name, path]) => {
    if (manager.registerImport(name, path, 'layout')) {
      imports.push(`import ${name} from "${path}"`);
    }
  });
  
  // Register views
  Object.entries(routerImportConfig.views).forEach(([name, path]) => {
    if (manager.registerImport(name, path, 'view')) {
      imports.push(`import ${name} from "${path}"`);
    }
  });
  
  // Register components
  Object.entries(routerImportConfig.components).forEach(([name, path]) => {
    if (manager.registerImport(name, path, 'component')) {
      imports.push(`import { ${name} } from "${path}"`);
    }
  });
  
  return imports.join('\n');
};

// Validate router imports
export const validateRouterImports = () => {
  const manager = new ImportManager();
  
  // Register all imports
  Object.entries(routerImportConfig.layouts).forEach(([name, path]) => {
    manager.registerImport(name, path, 'layout');
  });
  
  Object.entries(routerImportConfig.views).forEach(([name, path]) => {
    manager.registerImport(name, path, 'view');
  });
  
  Object.entries(routerImportConfig.components).forEach(([name, path]) => {
    manager.registerImport(name, path, 'component');
  });
  
  return manager.validateImports();
};

// Route Configuration Generator
export const generateRouteConfig = (routes) => {
  return routes.map(route => ({
    path: route.path,
    element: route.element,
    ...(route.children && { children: generateRouteConfig(route.children) })
  }));
};

export default ImportManager;