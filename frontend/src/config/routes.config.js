// Routes Configuration for MediXScan
// Centralized route definitions with soft coding approach

const routesConfig = {
  // Authentication Routes
  auth: {
    // Primary routes
    signIn: '/auth/sign-in',
    login: '/auth/login', // Alias for sign-in
    signUp: '/auth/sign-up',
    register: '/auth/register', // Alias for sign-up
    recoverPassword: '/auth/recover-password',
    forgotPassword: '/auth/forgot-password', // Alias for recover-password
    confirmMail: '/auth/confirm-mail',
    lockScreen: '/auth/lock-screen',
    logout: '/auth/logout',
    
    // Route aliases mapping
    aliases: {
      '/auth/login': '/auth/sign-in',
      '/auth/register': '/auth/sign-up',
      '/auth/forgot-password': '/auth/recover-password',
      '/login': '/auth/sign-in',
      '/register': '/auth/sign-up',
      '/logout': '/auth/sign-in'
    }
  },

  // Dashboard Routes
  dashboard: {
    home: '/',
    dummy: '/dashboard/dummy',
    hospital1: '/dashboard-pages/dashboard-1',
    hospital2: '/dashboard-pages/dashboard-2',
    patient: '/dashboard-pages/patient-dashboard',
    covid19: '/dashboard-pages/dashboard-4'
  },

  // Radiology Routes
  radiology: {
    dashboard: '/radiology/dashboard',
    xrayReports: '/radiology/xray-reports',
    ctScans: '/radiology/ct-scans',
    mriResults: '/radiology/mri-results',
    ultrasound: '/radiology/ultrasound',
    scheduleImaging: '/radiology/schedule'
  },

  // Doctor Routes
  doctor: {
    list: '/doctor/doctor-list',
    add: '/doctor/add-doctor',
    profile: '/doctor/doctor-profile',
    edit: '/doctor/edit-doctor'
  },

  // Email Routes
  email: {
    inbox: '/email/inbox',
    compose: '/email/email-compose'
  },

  // Calendar & Chat
  calendar: '/calendar',
  chat: '/chat',

  // Extra Pages
  extraPages: {
    accountSetting: '/extra-pages/account-setting',
    blankPage: '/extra-pages/blank-page',
    comingSoon: '/extra-pages/pages-comingsoon',
    error404: '/extra-pages/pages-error-404',
    error500: '/extra-pages/pages-error-500',
    faq: '/extra-pages/pages-faq',
    invoice: '/extra-pages/pages-invoice',
    maintenance: '/extra-pages/pages-maintenance',
    pricingOne: '/extra-pages/pages-pricing-one',
    pricing: '/extra-pages/pages-pricing',
    timeline: '/extra-pages/pages-timeline',
    privacyPolicy: '/extra-pages/privacy-policy',
    privacySetting: '/extra-pages/privacy-setting',
    termsOfService: '/extra-pages/terms-of-use'
  },

  // UI Elements Routes
  uiElements: {
    alerts: '/ui-elements/ui-alerts',
    badges: '/ui-elements/ui-badges',
    breadcrumb: '/ui-elements/ui-breadcrumb',
    buttons: '/ui-elements/ui-buttons',
    cards: '/ui-elements/ui-cards',
    carousel: '/ui-elements/ui-carousel',
    colors: '/ui-elements/ui-colors',
    grid: '/ui-elements/ui-grid',
    images: '/ui-elements/ui-images',
    listGroups: '/ui-elements/ui-list-group',
    modal: '/ui-elements/ui-modal',
    notification: '/ui-elements/ui-notification',
    pagination: '/ui-elements/ui-pagination',
    popovers: '/ui-elements/ui-popovers',
    progressbars: '/ui-elements/ui-progressbars',
    tabs: '/ui-elements/ui-tabs',
    tooltips: '/ui-elements/ui-tooltips',
    typography: '/ui-elements/ui-typography',
    video: '/ui-elements/ui-video'
  },

  // Forms Routes
  forms: {
    checkbox: '/forms/form-checkbox',
    elements: '/forms/form-elements',
    radio: '/forms/form-radio',
    switch: '/forms/form-switch',
    validations: '/forms/form-validations'
  },

  // Wizard Routes
  wizard: {
    simple: '/wizard/simple-wizard',
    validate: '/wizard/validate-wizard',
    vertical: '/wizard/vertical-wizard'
  },

  // Table Routes
  tables: {
    basic: '/tables/basic-table',
    data: '/tables/data-table',
    editable: '/tables/editable-table'
  },

  // Charts Routes
  charts: {
    apex: '/charts/apex-chart',
    am: '/charts/am-chart',
    chart: '/charts/chart',
    echart: '/charts/e-chart'
  },

  // Icons Routes
  icons: {
    dripicons: '/icons/dripicons',
    fontAwesome: '/icons/font-awesome-5',
    lineAwesome: '/icons/line-awesome',
    remixicon: '/icons/remixicon',
    unicons: '/icons/unicons'
  },

  // Maps Routes
  maps: {
    google: '/maps/google-map'
  }
};

// Helper function to get route by path or alias
export const getRoute = (path) => {
  // Check if it's an alias
  if (routesConfig.auth.aliases[path]) {
    return routesConfig.auth.aliases[path];
  }
  return path;
};

// Helper function to check if route exists
export const isValidRoute = (path) => {
  const checkInObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key] === path) {
        return true;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkInObject(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };
  
  return checkInObject(routesConfig) || routesConfig.auth.aliases[path];
};

// Helper function to get all routes as flat array
export const getAllRoutes = () => {
  const routes = [];
  
  const extractRoutes = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].startsWith('/')) {
        routes.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null && key !== 'aliases') {
        extractRoutes(obj[key]);
      }
    }
  };
  
  extractRoutes(routesConfig);
  return [...new Set(routes)]; // Remove duplicates
};

export default routesConfig;