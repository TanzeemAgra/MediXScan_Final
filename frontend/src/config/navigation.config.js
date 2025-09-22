// Import routes configuration for soft coding
import routesConfig from './routes.config.js';

// Navigation Configuration for MediXScan Dashboard
const navigationConfig = {
  // Dashboard Items - Using soft coded routes
  dashboardItems: [
    {
      id: 'medixscan-dashboard',
      title: 'MediXScan Dashboard',
      path: routesConfig.dashboard.home,
      icon: 'ri-hospital-fill',
      tooltip: 'MediXScan Dashboard',
      enabled: true
    },
    {
      id: 'doctor-dashboard',
      title: 'Doctor Dashboard',
      path: routesConfig.dashboard.hospital1,
      icon: 'ri-stethoscope-fill',
      tooltip: 'Doctor Dashboard',
      enabled: true
    },
    {
      id: 'patient-dashboard',
      title: 'Patient Dashboard',
      path: routesConfig.dashboard.patient,
      icon: 'ri-user-heart-fill',
      tooltip: 'Patient Dashboard',
      enabled: true
    }
  ],

  // Disabled Dashboard Items (can be re-enabled by setting enabled: true)
  disabledDashboardItems: [
    {
      id: 'medical-analytics',
      title: 'Medical Analytics Dashboard',
      path: '/dashboard-pages/dashboard-2',
      icon: 'ri-briefcase-4-fill',
      tooltip: 'Medical Analytics Dashboard',
      enabled: false
    },
    {
      id: 'health-monitoring',
      title: 'Health Monitoring Dashboard',
      path: '/dashboard-pages/dashboard-4',
      icon: 'ri-hospital-fill',
      tooltip: 'Health Monitoring Dashboard',
      enabled: false
    }
  ],

  // Apps Section Configuration
  appItems: {
    radiology: {
      enabled: true,
      title: 'Radiology',
      icon: 'ri-scan-line',
      tooltip: 'Radiology Department',
      items: [
        { title: 'Advanced Dashboard', path: '/radiology/dashboard', icon: 'ri-dashboard-3-line' },
        { title: 'X-Ray Reports', path: routesConfig.radiology.xrayReports, icon: 'ri-file-list-3-line' },
        { title: 'CT Scans', path: routesConfig.radiology.ctScans, icon: 'ri-scan-2-line' },
        { title: 'MRI Results', path: routesConfig.radiology.mriResults, icon: 'ri-brain-line' },
        { title: 'Ultrasound', path: routesConfig.radiology.ultrasound, icon: 'ri-heart-pulse-line' },
        { title: 'Schedule Imaging', path: routesConfig.radiology.scheduleImaging, icon: 'ri-calendar-schedule-line' }
      ]
    },
    // Disabled Apps (can be re-enabled by setting enabled: true)
    email: {
      enabled: false,
      title: 'Email',
      icon: 'ri-mail-open-fill',
      tooltip: 'Email',
      items: [
        { title: 'Inbox', path: '/email/inbox', icon: 'ri-inbox-fill' },
        { title: 'Compose', path: '/email/email-compose', icon: 'ri-edit-2-fill' }
      ]
    },
    doctor: {
      enabled: false,
      title: 'Doctor',
      icon: 'ri-stethoscope-fill',
      tooltip: 'Doctor Management',
      items: [
        { title: 'Doctor List', path: '/doctor/doctor-list', icon: 'ri-file-list-fill' },
        { title: 'Add Doctor', path: '/doctor/add-doctor', icon: 'ri-user-add-fill' },
        { title: 'Doctor Profile', path: '/doctor/doctor-profile', icon: 'ri-user-fill' },
        { title: 'Edit Doctor', path: '/doctor/edit-doctor', icon: 'ri-edit-fill' }
      ]
    }
  },

  // Single App Items (no sub-items)
  singleAppItems: {
    calendar: {
      enabled: false,
      title: 'Calendar',
      path: '/calendar',
      icon: 'ri-calendar-2-line',
      tooltip: 'Calendar'
    },
    chat: {
      enabled: false,
      title: 'Chat',
      path: '/chat',
      icon: 'ri-message-fill',
      tooltip: 'Chat'
    }
  },

  // Components Section Configuration
  componentsSection: {
    enabled: false, // Set to false to hide entire components section
    showHeader: false, // Control components header visibility
    items: {
      uiElements: {
        enabled: false,
        title: 'UI Elements',
        eventKey: 'UIElements',
        icon: 'ri-apps-fill',
        tooltip: 'UIElements'
      },
      forms: {
        enabled: false,
        title: 'Forms',
        eventKey: 'Forms',
        icon: 'ri-device-fill',
        tooltip: 'Forms'
      },
      formWizard: {
        enabled: false,
        title: 'Form Wizard',
        eventKey: 'Form-Wizard',
        icon: 'ri-file-word-fill',
        tooltip: 'Forms Wizard'
      },
      tables: {
        enabled: false,
        title: 'Table',
        eventKey: 'table',
        icon: 'ri-table-fill',
        tooltip: 'Table'
      },
      charts: {
        enabled: false,
        title: 'Charts',
        eventKey: 'Chart',
        icon: 'ri-bar-chart-2-fill',
        tooltip: 'Chart'
      },
      icons: {
        enabled: false,
        title: 'Icons',
        eventKey: 'Icons',
        icon: 'ri-bar-chart-2-fill',
        tooltip: 'Icons'
      }
    }
  },

  // Pages Section Configuration
  pagesSection: {
    enabled: true, // Control entire pages section visibility
    showHeader: true, // Control "Pages" header visibility
    items: {
      authentication: {
        enabled: true,
        title: 'Authentication',
        eventKey: 'Authentication',
        icon: 'ri-server-fill',
        tooltip: 'Authentication'
      },
      maps: {
        enabled: false, // DISABLED - Maps section hidden
        title: 'Maps',
        eventKey: 'Maps',
        icon: 'ri-map-pin-2-fill',
        tooltip: 'Maps'
      },
      extraPages: {
        enabled: false, // DISABLED - Extra Pages section hidden
        title: 'Extra Pages',
        eventKey: 'Extrapages',
        icon: 'ri-folders-fill',
        tooltip: 'Extrapages'
      }
    }
  }
};

export default navigationConfig;