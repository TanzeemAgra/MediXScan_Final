// Role-Based Access Control (RBAC) Configuration
// Comprehensive role management with soft coding approach

const rbacConfig = {
  // Define User Roles
  roles: {
    ADMIN: {
      id: 'admin',
      name: 'Administrator',
      level: 4,
      description: 'Full system access with administrative privileges',
      color: '#dc3545',
      icon: 'ri-admin-line'
    },
    RADIOLOGIST: {
      id: 'radiologist',
      name: 'Radiologist',
      level: 3,
      description: 'Medical imaging specialist with diagnostic authority',
      color: '#0d6efd',
      icon: 'ri-stethoscope-line'
    },
    TECHNICIAN: {
      id: 'technician',
      name: 'Radiology Technician',
      level: 2,
      description: 'Imaging equipment operator and basic report management',
      color: '#198754',
      icon: 'ri-tools-line'
    },
    DOCTOR: {
      id: 'doctor',
      name: 'Doctor',
      level: 2,
      description: 'Medical practitioner with patient care responsibilities',
      color: '#fd7e14',
      icon: 'ri-user-heart-line'
    },
    VIEWER: {
      id: 'viewer',
      name: 'Viewer',
      level: 1,
      description: 'Limited access for viewing approved reports',
      color: '#6c757d',
      icon: 'ri-eye-line'
    }
  },

  // Define Permissions
  permissions: {
    // Dashboard Permissions
    DASHBOARD_VIEW: 'dashboard:view',
    DASHBOARD_ADMIN: 'dashboard:admin',
    
    // Radiology Permissions
    RADIOLOGY_VIEW: 'radiology:view',
    RADIOLOGY_CREATE: 'radiology:create',
    RADIOLOGY_EDIT: 'radiology:edit',
    RADIOLOGY_DELETE: 'radiology:delete',
    RADIOLOGY_APPROVE: 'radiology:approve',
    RADIOLOGY_SCHEDULE: 'radiology:schedule',
    
    // Patient Permissions
    PATIENT_VIEW: 'patient:view',
    PATIENT_CREATE: 'patient:create',
    PATIENT_EDIT: 'patient:edit',
    PATIENT_DELETE: 'patient:delete',
    
    // Report Permissions
    REPORT_VIEW: 'report:view',
    REPORT_CREATE: 'report:create',
    REPORT_EDIT: 'report:edit',
    REPORT_DELETE: 'report:delete',
    REPORT_FINALIZE: 'report:finalize',
    REPORT_SIGN: 'report:sign',
    
    // Equipment Permissions
    EQUIPMENT_VIEW: 'equipment:view',
    EQUIPMENT_OPERATE: 'equipment:operate',
    EQUIPMENT_MAINTAIN: 'equipment:maintain',
    
    // System Permissions
    SYSTEM_ADMIN: 'system:admin',
    USER_MANAGEMENT: 'user:management',
    AUDIT_LOG: 'audit:log'
  },

  // Role-Permission Mappings
  rolePermissions: {
    admin: [
      'dashboard:view',
      'dashboard:admin',
      'radiology:view',
      'radiology:create',
      'radiology:edit',
      'radiology:delete',
      'radiology:approve',
      'radiology:schedule',
      'patient:view',
      'patient:create',
      'patient:edit',
      'patient:delete',
      'report:view',
      'report:create',
      'report:edit',
      'report:delete',
      'report:finalize',
      'report:sign',
      'equipment:view',
      'equipment:operate',
      'equipment:maintain',
      'system:admin',
      'user:management',
      'audit:log'
    ],
    radiologist: [
      'dashboard:view',
      'radiology:view',
      'radiology:create',
      'radiology:edit',
      'radiology:approve',
      'radiology:schedule',
      'patient:view',
      'patient:edit',
      'report:view',
      'report:create',
      'report:edit',
      'report:finalize',
      'report:sign',
      'equipment:view'
    ],
    technician: [
      'dashboard:view',
      'radiology:view',
      'radiology:create',
      'radiology:schedule',
      'patient:view',
      'report:view',
      'report:create',
      'equipment:view',
      'equipment:operate'
    ],
    doctor: [
      'dashboard:view',
      'radiology:view',
      'radiology:schedule',
      'patient:view',
      'patient:create',
      'patient:edit',
      'report:view'
    ],
    viewer: [
      'dashboard:view',
      'radiology:view',
      'patient:view',
      'report:view'
    ]
  },

  // Dashboard Modules Configuration by Role
  dashboardModules: {
    admin: {
      analytics: { enabled: true, priority: 1 },
      radiology: { enabled: true, priority: 2 },
      patients: { enabled: true, priority: 3 },
      reports: { enabled: true, priority: 4 },
      equipment: { enabled: true, priority: 5 },
      users: { enabled: true, priority: 6 },
      audit: { enabled: true, priority: 7 },
      settings: { enabled: true, priority: 8 }
    },
    radiologist: {
      radiology: { enabled: true, priority: 1 },
      reports: { enabled: true, priority: 2 },
      patients: { enabled: true, priority: 3 },
      analytics: { enabled: true, priority: 4 },
      equipment: { enabled: false, priority: 0 },
      users: { enabled: false, priority: 0 },
      audit: { enabled: false, priority: 0 },
      settings: { enabled: false, priority: 0 }
    },
    technician: {
      radiology: { enabled: true, priority: 1 },
      equipment: { enabled: true, priority: 2 },
      patients: { enabled: true, priority: 3 },
      reports: { enabled: true, priority: 4 },
      analytics: { enabled: false, priority: 0 },
      users: { enabled: false, priority: 0 },
      audit: { enabled: false, priority: 0 },
      settings: { enabled: false, priority: 0 }
    },
    doctor: {
      patients: { enabled: true, priority: 1 },
      radiology: { enabled: true, priority: 2 },
      reports: { enabled: true, priority: 3 },
      analytics: { enabled: true, priority: 4 },
      equipment: { enabled: false, priority: 0 },
      users: { enabled: false, priority: 0 },
      audit: { enabled: false, priority: 0 },
      settings: { enabled: false, priority: 0 }
    },
    viewer: {
      radiology: { enabled: true, priority: 1 },
      reports: { enabled: true, priority: 2 },
      patients: { enabled: true, priority: 3 },
      analytics: { enabled: false, priority: 0 },
      equipment: { enabled: false, priority: 0 },
      users: { enabled: false, priority: 0 },
      audit: { enabled: false, priority: 0 },
      settings: { enabled: false, priority: 0 }
    }
  },

  // Navigation Menu Configuration by Role
  navigationConfig: {
    admin: {
      dashboard: { visible: true, order: 1 },
      radiology: { visible: true, order: 2 },
      patients: { visible: true, order: 3 },
      doctors: { visible: true, order: 4 },
      reports: { visible: true, order: 5 },
      equipment: { visible: true, order: 6 },
      analytics: { visible: true, order: 7 },
      administration: { visible: true, order: 8 }
    },
    radiologist: {
      dashboard: { visible: true, order: 1 },
      radiology: { visible: true, order: 2 },
      reports: { visible: true, order: 3 },
      patients: { visible: true, order: 4 },
      analytics: { visible: true, order: 5 },
      doctors: { visible: false, order: 0 },
      equipment: { visible: false, order: 0 },
      administration: { visible: false, order: 0 }
    },
    technician: {
      dashboard: { visible: true, order: 1 },
      radiology: { visible: true, order: 2 },
      equipment: { visible: true, order: 3 },
      patients: { visible: true, order: 4 },
      reports: { visible: true, order: 5 },
      doctors: { visible: false, order: 0 },
      analytics: { visible: false, order: 0 },
      administration: { visible: false, order: 0 }
    },
    doctor: {
      dashboard: { visible: true, order: 1 },
      patients: { visible: true, order: 2 },
      radiology: { visible: true, order: 3 },
      reports: { visible: true, order: 4 },
      doctors: { visible: true, order: 5 },
      equipment: { visible: false, order: 0 },
      analytics: { visible: false, order: 0 },
      administration: { visible: false, order: 0 }
    },
    viewer: {
      dashboard: { visible: true, order: 1 },
      radiology: { visible: true, order: 2 },
      reports: { visible: true, order: 3 },
      patients: { visible: true, order: 4 },
      doctors: { visible: false, order: 0 },
      equipment: { visible: false, order: 0 },
      analytics: { visible: false, order: 0 },
      administration: { visible: false, order: 0 }
    }
  },

  // Feature Flags by Role
  featureFlags: {
    admin: {
      advancedAnalytics: true,
      bulkOperations: true,
      systemSettings: true,
      userManagement: true,
      dataExport: true,
      auditLogs: true,
      apiAccess: true,
      customReports: true
    },
    radiologist: {
      advancedAnalytics: true,
      bulkOperations: true,
      systemSettings: false,
      userManagement: false,
      dataExport: true,
      auditLogs: false,
      apiAccess: false,
      customReports: true
    },
    technician: {
      advancedAnalytics: false,
      bulkOperations: false,
      systemSettings: false,
      userManagement: false,
      dataExport: false,
      auditLogs: false,
      apiAccess: false,
      customReports: false
    },
    doctor: {
      advancedAnalytics: true,
      bulkOperations: false,
      systemSettings: false,
      userManagement: false,
      dataExport: true,
      auditLogs: false,
      apiAccess: false,
      customReports: true
    },
    viewer: {
      advancedAnalytics: false,
      bulkOperations: false,
      systemSettings: false,
      userManagement: false,
      dataExport: false,
      auditLogs: false,
      apiAccess: false,
      customReports: false
    }
  },

  // Default Settings
  defaults: {
    guestRole: 'viewer',
    sessionTimeout: 3600000, // 1 hour
    maxFailedAttempts: 3,
    passwordComplexity: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  }
};

// Helper Functions
export const getRoleById = (roleId) => rbacConfig.roles[roleId.toUpperCase()];

export const hasPermission = (userRole, permission) => {
  const permissions = rbacConfig.rolePermissions[userRole];
  return permissions && permissions.includes(permission);
};

export const canAccessModule = (userRole, module) => {
  const moduleConfig = rbacConfig.dashboardModules[userRole];
  return moduleConfig && moduleConfig[module] && moduleConfig[module].enabled;
};

export const getNavigationForRole = (userRole) => {
  return rbacConfig.navigationConfig[userRole] || rbacConfig.navigationConfig.viewer;
};

export const getFeatureFlagsForRole = (userRole) => {
  return rbacConfig.featureFlags[userRole] || rbacConfig.featureFlags.viewer;
};

export const isAuthorized = (userRole, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  
  const userPermissions = rbacConfig.rolePermissions[userRole] || [];
  
  // Check if user has all required permissions
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

export const getModulePriority = (userRole, module) => {
  const moduleConfig = rbacConfig.dashboardModules[userRole];
  return moduleConfig && moduleConfig[module] ? moduleConfig[module].priority : 0;
};

export default rbacConfig;