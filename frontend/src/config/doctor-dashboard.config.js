// Advanced Doctor Dashboard Configuration
// Soft-coded feature management for medical professionals

const doctorDashboardConfig = {
  // Dashboard Layout Configuration
  layout: {
    gridSystem: 'bootstrap', // bootstrap, css-grid, flexbox
    columns: 12,
    spacing: 'md', // xs, sm, md, lg, xl
    theme: 'medical-professional' // medical-professional, clinical, modern
  },

  // Widget Categories with Soft-Coded Features
  widgetCategories: {
    // Patient Management Widgets
    patientManagement: {
      enabled: true,
      priority: 1,
      widgets: {
        patientQueue: {
          id: 'patient-queue',
          title: 'Patient Queue Management',
          enabled: true,
          position: { row: 1, col: 1, span: 6 },
          config: {
            maxPatients: 20,
            autoRefresh: 30000, // 30 seconds
            priorityLevels: ['Critical', 'Urgent', 'Normal', 'Low'],
            viewModes: ['list', 'card', 'timeline']
          }
        },
        patientVitals: {
          id: 'patient-vitals',
          title: 'Real-time Patient Vitals',
          enabled: true,
          position: { row: 1, col: 7, span: 6 },
          config: {
            vitalSigns: ['heartRate', 'bloodPressure', 'temperature', 'oxygenSaturation'],
            alertThresholds: {
              heartRate: { min: 60, max: 100, critical: { min: 40, max: 120 } },
              bloodPressure: { systolic: { max: 140 }, diastolic: { max: 90 } },
              temperature: { min: 36.1, max: 37.2, critical: { min: 35, max: 39 } },
              oxygenSaturation: { min: 95, critical: { min: 88 } }
            }
          }
        }
      }
    },

    // Radiology & Imaging Widgets
    radiologyWorkflow: {
      enabled: true,
      priority: 2,
      widgets: {
        imagingQueue: {
          id: 'imaging-queue',
          title: 'Radiology Imaging Queue',
          enabled: true,
          position: { row: 2, col: 1, span: 4 },
          config: {
            imagingTypes: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Nuclear Medicine'],
            urgencyLevels: ['STAT', 'Urgent', 'Routine'],
            autoAssignment: true,
            modalityPreferences: {
              'X-Ray': { slots: 8, duration: 15 },
              'CT Scan': { slots: 4, duration: 30 },
              'MRI': { slots: 2, duration: 60 },
              'Ultrasound': { slots: 6, duration: 20 }
            }
          }
        },
        aiDiagnosis: {
          id: 'ai-diagnosis',
          title: 'AI-Assisted Diagnosis',
          enabled: true,
          position: { row: 2, col: 5, span: 4 },
          config: {
            aiModels: ['chest-xray-pneumonia', 'brain-mri-tumor', 'bone-fracture-detection'],
            confidenceThreshold: 0.85,
            humanReviewRequired: true,
            integrationEndpoint: '/api/radiology/ai-analysis/',
            supportedImageFormats: ['DICOM', 'JPEG', 'PNG', 'TIFF']
          }
        },
        reportGeneration: {
          id: 'report-generation',
          title: 'Automated Report Generation',
          enabled: true,
          position: { row: 2, col: 9, span: 4 },
          config: {
            templates: ['chest-xray', 'abdominal-ct', 'brain-mri', 'bone-scan'],
            autoSave: true,
            digitalSignature: true,
            outputFormats: ['PDF', 'HL7', 'JSON'],
            languageSupport: ['en', 'es', 'fr']
          }
        }
      }
    },

    // Clinical Decision Support
    clinicalSupport: {
      enabled: true,
      priority: 3,
      widgets: {
        drugInteractionChecker: {
          id: 'drug-interactions',
          title: 'Drug Interaction Checker',
          enabled: true,
          position: { row: 3, col: 1, span: 6 },
          config: {
            database: 'rxnorm',
            severityLevels: ['minor', 'moderate', 'major', 'contraindicated'],
            includeAllergyCheck: true,
            includePregnancyWarnings: true
          }
        },
        clinicalGuidelines: {
          id: 'clinical-guidelines',
          title: 'Evidence-Based Guidelines',
          enabled: true,
          position: { row: 3, col: 7, span: 6 },
          config: {
            guidelineSources: ['WHO', 'CDC', 'AMA', 'Local Hospital Protocols'],
            specialtyFilters: ['radiology', 'internal-medicine', 'surgery', 'emergency'],
            updateFrequency: 'daily'
          }
        }
      }
    },

    // Analytics & Performance
    analytics: {
      enabled: true,
      priority: 4,
      widgets: {
        performanceMetrics: {
          id: 'performance-metrics',
          title: 'Doctor Performance Analytics',
          enabled: true,
          position: { row: 4, col: 1, span: 4 },
          config: {
            metrics: ['patientThroughput', 'diagnosticAccuracy', 'reportTurnaroundTime', 'patientSatisfaction'],
            timeRanges: ['today', 'week', 'month', 'quarter', 'year'],
            comparisonMode: 'departmentAverage'
          }
        },
        departmentAnalytics: {
          id: 'department-analytics',
          title: 'Department Analytics',
          enabled: true,
          position: { row: 4, col: 5, span: 4 },
          config: {
            departments: ['radiology', 'cardiology', 'neurology', 'orthopedics'],
            kpis: ['efficiency', 'quality', 'patientFlow', 'resourceUtilization'],
            realTimeUpdates: true
          }
        },
        predictiveAnalytics: {
          id: 'predictive-analytics',
          title: 'Predictive Healthcare Analytics',
          enabled: true,
          position: { row: 4, col: 9, span: 4 },
          config: {
            models: ['bedOccupancy', 'equipmentMaintenance', 'staffOptimization', 'patientRisk'],
            forecastHorizon: '30d',
            alertThresholds: { occupancy: 0.85, risk: 0.7 }
          }
        }
      }
    },

    // Communication & Alerts
    communicationHub: {
      enabled: true,
      priority: 5,
      widgets: {
        realTimeAlerts: {
          id: 'real-time-alerts',
          title: 'Critical Alerts & Notifications',
          enabled: true,
          position: { row: 5, col: 1, span: 6 },
          config: {
            alertTypes: ['critical-results', 'equipment-failure', 'emergency-codes', 'staff-notifications'],
            escalationRules: {
              'critical-results': { timeout: 300, escalateTo: 'attending-physician' },
              'equipment-failure': { timeout: 180, escalateTo: 'biomedical-engineer' }
            },
            deliveryMethods: ['inApp', 'sms', 'email', 'pager']
          }
        },
        teamCommunication: {
          id: 'team-communication',
          title: 'Interdisciplinary Team Communication',
          enabled: true,
          position: { row: 5, col: 7, span: 6 },
          config: {
            channels: ['radiology', 'nursing', 'pharmacy', 'surgery'],
            encryptionLevel: 'HIPAA-compliant',
            messageRetention: '30d',
            urgencyLevels: ['info', 'normal', 'urgent', 'critical']
          }
        }
      }
    }
  },

  // API Configuration for Backend Integration
  apiIntegration: {
    baseUrl: 'http://127.0.0.1:8000/api',
    endpoints: {
      patientQueue: '/patients/queue/',
      radiologyQueue: '/radiology/queue/',
      aiAnalysis: '/radiology/ai-analysis/',
      vitals: '/patients/vitals/',
      alerts: '/notifications/alerts/',
      performance: '/analytics/doctor-performance/',
      reports: '/reports/generate/',
      drugInteractions: '/clinical/drug-interactions/',
      guidelines: '/clinical/guidelines/'
    },
    authentication: {
      type: 'JWT',
      headerName: 'Authorization',
      tokenPrefix: 'Bearer'
    },
    rateLimiting: {
      requestsPerMinute: 100,
      burstLimit: 20
    }
  },

  // Security & Compliance Configuration
  security: {
    hipaaCompliance: true,
    auditLogging: {
      enabled: true,
      logLevel: 'detailed',
      retention: '7y'
    },
    dataEncryption: {
      inTransit: 'TLS 1.3',
      atRest: 'AES-256'
    },
    accessControl: {
      roleBasedAccess: true,
      sessionTimeout: 30, // minutes
      maxConcurrentSessions: 3
    }
  },

  // Feature Toggles for Soft-Coded Functionality
  featureFlags: {
    enableAIAssistance: true,
    enablePredictiveAnalytics: true,
    enableRealTimeSync: true,
    enableMobileOptimization: true,
    enableVoiceCommands: false, // Future feature
    enableTelemedicine: true,
    enableBlockchainRecords: false, // Future feature
    enableQuantumEncryption: false // Future feature
  },

  // Customization Options
  customization: {
    themes: {
      light: { primary: '#089bab', secondary: '#495057', success: '#28a745' },
      dark: { primary: '#17a2b8', secondary: '#6c757d', success: '#20c997' },
      clinical: { primary: '#0066cc', secondary: '#333333', success: '#28a745' }
    },
    layout: {
      sidebarCollapsible: true,
      headerFixed: true,
      footerVisible: true,
      breadcrumbsEnabled: true
    },
    notifications: {
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left
      autoClose: 5000,
      showProgress: true
    }
  },

  // Performance Optimization
  performance: {
    lazyLoading: true,
    virtualScrolling: true,
    imageOptimization: true,
    caching: {
      strategy: 'stale-while-revalidate',
      ttl: 300000 // 5 minutes
    },
    bundleSplitting: true
  }
};

export default doctorDashboardConfig;