// Advanced Patient Management System Configuration - MediXScan
// Soft-coded configuration for comprehensive patient dashboard with database integration

export const patientDashboardConfig = {
  // Feature flags for soft-coded functionality
  featureFlags: {
    enableRealTimeUpdates: true,
    enablePatientSearch: true,
    enableAdvancedFiltering: true,
    enablePatientAnalytics: true,
    enableAppointmentIntegration: true,
    enableMedicalRecords: true,
    enableVitalSigns: true,
    enablePatientCommunication: true,
    enableBillingIntegration: true,
    enableInsuranceManagement: true,
    enableEmergencyContacts: true,
    enablePatientPortal: true,
    enableAIInsights: true,
    enableHIPAACompliance: true,
    enableDataExport: true,
    enableBulkOperations: true
  },

  // Dashboard layout configuration
  dashboardLayout: {
    gridSystem: {
      columns: 12,
      breakpoints: {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1400
      }
    },
    
    // Widget categories for organized display
    widgetCategories: {
      patientOverview: {
        enabled: true,
        title: 'Patient Overview',
        order: 1,
        widgets: ['patientStats', 'recentPatients', 'quickActions']
      },
      
      patientSearch: {
        enabled: true,
        title: 'Patient Search & Management',
        order: 2,
        widgets: ['advancedSearch', 'patientList', 'filters']
      },
      
      medicalData: {
        enabled: true,
        title: 'Medical Information',
        order: 3,
        widgets: ['vitalSigns', 'medicalHistory', 'currentMedications']
      },
      
      appointments: {
        enabled: true,
        title: 'Appointments & Scheduling',
        order: 4,
        widgets: ['upcomingAppointments', 'appointmentHistory', 'scheduling']
      },
      
      analytics: {
        enabled: true,
        title: 'Patient Analytics',
        order: 5,
        widgets: ['demographics', 'trends', 'insights']
      }
    }
  },

  // Patient data structure and fields
  patientDataModel: {
    personalInfo: {
      required: ['firstName', 'lastName', 'dateOfBirth', 'gender'],
      optional: ['middleName', 'preferredName', 'suffix', 'socialSecurityNumber'],
      validation: {
        firstName: { minLength: 2, maxLength: 50, pattern: '^[a-zA-Z\\s]+$' },
        lastName: { minLength: 2, maxLength: 50, pattern: '^[a-zA-Z\\s]+$' },
        dateOfBirth: { type: 'date', maxDate: 'today' },
        gender: { options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
      }
    },
    
    contactInfo: {
      required: ['phone', 'email'],
      optional: ['alternatePhone', 'address', 'emergencyContact'],
      validation: {
        phone: { pattern: '^\\+?[1-9]\\d{1,14}$' },
        email: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
      }
    },
    
    medicalInfo: {
      required: ['bloodType', 'allergies'],
      optional: ['chronicConditions', 'currentMedications', 'pastSurgeries'],
      categories: {
        allergies: ['Drug', 'Food', 'Environmental', 'Other'],
        bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      }
    },
    
    insuranceInfo: {
      required: ['insuranceProvider', 'policyNumber'],
      optional: ['groupNumber', 'subscriberName', 'effectiveDate', 'expirationDate']
    }
  },

  // Search and filtering configuration
  searchConfiguration: {
    searchableFields: [
      'firstName', 'lastName', 'email', 'phone', 'patientId', 
      'medicalRecordNumber', 'insuranceId', 'socialSecurityNumber'
    ],
    
    advancedFilters: {
      demographic: {
        fields: ['age', 'gender', 'city', 'state', 'zipCode'],
        operators: ['equals', 'contains', 'between', 'in']
      },
      
      medical: {
        fields: ['bloodType', 'allergies', 'chronicConditions', 'lastVisitDate'],
        operators: ['equals', 'contains', 'before', 'after', 'between']
      },
      
      administrative: {
        fields: ['registrationDate', 'lastAppointment', 'insuranceProvider', 'status'],
        operators: ['equals', 'before', 'after', 'between', 'in']
      }
    },
    
    sortOptions: [
      { field: 'lastName', label: 'Last Name', direction: 'asc' },
      { field: 'firstName', label: 'First Name', direction: 'asc' },
      { field: 'dateOfBirth', label: 'Age', direction: 'desc' },
      { field: 'lastVisit', label: 'Last Visit', direction: 'desc' },
      { field: 'registrationDate', label: 'Registration Date', direction: 'desc' }
    ]
  },

  // API integration configuration
  apiIntegration: {
    endpoints: {
      patients: {
        list: '/api/patients/',
        detail: '/api/patients/{id}/',
        create: '/api/patients/',
        update: '/api/patients/{id}/',
        delete: '/api/patients/{id}/',
        search: '/api/patients/search/',
        stats: '/api/patients/statistics/'
      },
      
      medicalRecords: {
        list: '/api/medical-records/?patient={patientId}',
        create: '/api/medical-records/',
        update: '/api/medical-records/{id}/',
        vitals: '/api/medical-records/vitals/?patient={patientId}'
      },
      
      appointments: {
        list: '/api/appointments/?patient={patientId}',
        upcoming: '/api/appointments/upcoming/?patient={patientId}',
        history: '/api/appointments/history/?patient={patientId}'
      }
    },
    
    // Pagination configuration
    pagination: {
      defaultPageSize: 25,
      pageSizeOptions: [10, 25, 50, 100],
      maxPageSize: 200
    },
    
    // Real-time updates
    realTimeUpdates: {
      enabled: true,
      updateInterval: 30000, // 30 seconds
      events: ['patient_updated', 'appointment_created', 'vital_signs_recorded']
    }
  },

  // Widget-specific configurations
  widgetConfigurations: {
    patientStats: {
      metrics: [
        { key: 'totalPatients', label: 'Total Patients', icon: 'FaUsers', color: 'primary' },
        { key: 'newPatients', label: 'New This Month', icon: 'FaUserPlus', color: 'success' },
        { key: 'upcomingAppointments', label: 'Upcoming Appointments', icon: 'FaCalendarAlt', color: 'info' },
        { key: 'criticalAlerts', label: 'Critical Alerts', icon: 'FaExclamationTriangle', color: 'warning' }
      ],
      refreshInterval: 60000 // 1 minute
    },
    
    patientList: {
      displayFields: [
        { key: 'patientId', label: 'ID', sortable: true, width: '10%' },
        { key: 'fullName', label: 'Name', sortable: true, width: '25%' },
        { key: 'age', label: 'Age', sortable: true, width: '10%' },
        { key: 'gender', label: 'Gender', sortable: true, width: '10%' },
        { key: 'lastVisit', label: 'Last Visit', sortable: true, width: '15%', type: 'date' },
        { key: 'status', label: 'Status', sortable: true, width: '15%', type: 'badge' },
        { key: 'actions', label: 'Actions', width: '15%', type: 'actions' }
      ],
      
      actionButtons: [
        { key: 'view', label: 'View', icon: 'FaEye', variant: 'outline-primary' },
        { key: 'edit', label: 'Edit', icon: 'FaEdit', variant: 'outline-secondary' },
        { key: 'appointment', label: 'Schedule', icon: 'FaCalendarAlt', variant: 'outline-success' }
      ]
    },
    
    vitalSigns: {
      metrics: [
        { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', normalRange: '120/80', icon: 'FaHeartbeat' },
        { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', normalRange: '60-100', icon: 'FaHeart' },
        { key: 'temperature', label: 'Temperature', unit: '°F', normalRange: '98.6', icon: 'FaThermometerHalf' },
        { key: 'weight', label: 'Weight', unit: 'lbs', icon: 'FaWeight' },
        { key: 'height', label: 'Height', unit: 'ft/in', icon: 'FaRuler' },
        { key: 'oxygenSaturation', label: 'O2 Saturation', unit: '%', normalRange: '95-100', icon: 'FaLungs' }
      ],
      chartConfiguration: {
        type: 'line',
        showTrends: true,
        timeRange: 'last6Months'
      }
    }
  },

  // Security and compliance
  security: {
    hipaaCompliance: {
      auditLogging: true,
      dataEncryption: true,
      accessControls: true,
      dataRetention: {
        activeRecords: '7 years',
        inactiveRecords: '10 years'
      }
    },
    
    permissions: {
      view: ['doctor', 'nurse', 'admin', 'receptionist'],
      create: ['doctor', 'nurse', 'admin'],
      update: ['doctor', 'nurse', 'admin'],
      delete: ['admin'],
      export: ['doctor', 'admin']
    }
  },

  // UI/UX configuration
  userInterface: {
    theme: {
      primaryColor: '#0d6efd',
      successColor: '#198754',
      warningColor: '#ffc107',
      dangerColor: '#dc3545',
      infoColor: '#0dcaf0'
    },
    
    animations: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out'
    },
    
    responsiveBreakpoints: {
      mobile: '576px',
      tablet: '768px',
      desktop: '992px',
      large: '1200px'
    }
  },

  // Data validation and formatting
  dataFormatting: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    currencyFormat: 'USD',
    phoneFormat: '(XXX) XXX-XXXX',
    
    displayFormats: {
      patientName: '{lastName}, {firstName} {middleName}',
      address: '{street}, {city}, {state} {zipCode}',
      insurance: '{provider} - {policyNumber}'
    }
  }
};

export default patientDashboardConfig;