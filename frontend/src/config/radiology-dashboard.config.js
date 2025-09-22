// Advanced Radiology Dashboard Configuration
// Comprehensive soft-coded configuration for radiology dashboard modules

const radiologyDashboardConfig = {
  // Dashboard Metadata
  metadata: {
    title: 'Advanced Radiology Dashboard',
    version: '2.0.0',
    description: 'Comprehensive imaging management and diagnostic platform',
    lastUpdated: '2025-09-22',
    features: ['AI-Enhanced Diagnostics', 'Real-time Collaboration', '3D Visualization', 'Automated Reporting']
  },

  // Imaging Modalities Configuration
  imagingModalities: {
    xray: {
      id: 'xray',
      name: 'X-Ray Imaging',
      shortName: 'X-Ray',
      icon: 'ri-scan-line',
      color: '#0d6efd',
      description: 'Digital radiography and fluoroscopy',
      defaultSettings: {
        kvp: { min: 40, max: 125, default: 80 },
        mas: { min: 1, max: 500, default: 50 },
        exposure: { min: 0.1, max: 10, default: 1 }
      },
      bodyParts: ['Chest', 'Abdomen', 'Spine', 'Extremities', 'Skull', 'Pelvis'],
      views: ['AP', 'PA', 'Lateral', 'Oblique', 'Decubitus'],
      protocols: {
        chest: { kvp: 120, mas: 10, exposure: 0.5 },
        abdomen: { kvp: 80, mas: 100, exposure: 2 },
        spine: { kvp: 85, mas: 150, exposure: 3 }
      }
    },
    ct: {
      id: 'ct',
      name: 'Computed Tomography',
      shortName: 'CT Scan',
      icon: 'ri-scan-2-line',
      color: '#198754',
      description: 'Cross-sectional imaging with contrast enhancement',
      defaultSettings: {
        kvp: { min: 80, max: 140, default: 120 },
        mas: { min: 50, max: 500, default: 200 },
        sliceThickness: { min: 0.5, max: 10, default: 5 }
      },
      bodyParts: ['Head', 'Neck', 'Chest', 'Abdomen', 'Pelvis', 'Spine', 'Extremities'],
      protocols: {
        head: { kvp: 120, mas: 250, sliceThickness: 5, contrast: false },
        chest: { kvp: 120, mas: 150, sliceThickness: 5, contrast: true },
        abdomen: { kvp: 120, mas: 200, sliceThickness: 3, contrast: true }
      },
      contrastTypes: ['Iodinated', 'Barium', 'None']
    },
    mri: {
      id: 'mri',
      name: 'Magnetic Resonance Imaging',
      shortName: 'MRI',
      icon: 'ri-brain-line',
      color: '#6f42c1',
      description: 'Advanced soft tissue imaging without radiation',
      defaultSettings: {
        fieldStrength: { options: ['1.5T', '3T', '7T'], default: '1.5T' },
        sliceThickness: { min: 1, max: 8, default: 4 },
        matrix: { options: ['256x256', '512x512', '1024x1024'], default: '512x512' }
      },
      bodyParts: ['Brain', 'Spine', 'Joints', 'Abdomen', 'Pelvis', 'Cardiac', 'Vascular'],
      sequences: ['T1', 'T2', 'FLAIR', 'DWI', 'T1C', 'SWI', 'TOF'],
      protocols: {
        brain: { sequences: ['T1', 'T2', 'FLAIR', 'DWI'], contrast: false },
        spine: { sequences: ['T1', 'T2', 'STIR'], contrast: false },
        cardiac: { sequences: ['Cine', 'T1', 'T2'], contrast: true }
      }
    },
    ultrasound: {
      id: 'ultrasound',
      name: 'Ultrasonography',
      shortName: 'Ultrasound',
      icon: 'ri-heart-pulse-line',
      color: '#fd7e14',
      description: 'Real-time imaging using sound waves',
      defaultSettings: {
        frequency: { min: 2, max: 15, default: 5, unit: 'MHz' },
        depth: { min: 5, max: 30, default: 15, unit: 'cm' },
        gain: { min: 0, max: 100, default: 50, unit: '%' }
      },
      bodyParts: ['Abdomen', 'Pelvis', 'Cardiac', 'Vascular', 'Superficial', 'Obstetric'],
      examTypes: ['Diagnostic', 'Doppler', '3D/4D', 'Contrast-Enhanced'],
      protocols: {
        abdominal: { frequency: 3.5, depth: 20, organs: ['Liver', 'Gallbladder', 'Kidneys'] },
        cardiac: { frequency: 2.5, depth: 15, views: ['Parasternal', 'Apical', 'Subcostal'] },
        vascular: { frequency: 7, depth: 5, doppler: true }
      }
    },
    mammography: {
      id: 'mammography',
      name: 'Mammography',
      shortName: 'Mammo',
      icon: 'ri-heart-line',
      color: '#dc3545',
      description: 'Specialized breast imaging for screening and diagnosis',
      defaultSettings: {
        kvp: { min: 22, max: 35, default: 28 },
        mas: { min: 50, max: 300, default: 120 },
        compression: { min: 10, max: 40, default: 25, unit: 'lbs' }
      },
      views: ['CC', 'MLO', 'ML', 'LM', 'XCCL'],
      protocols: {
        screening: { views: ['CC', 'MLO'], bilateral: true },
        diagnostic: { views: ['CC', 'MLO', 'ML'], spot: true },
        biopsy: { views: ['CC', 'MLO'], stereotactic: true }
      }
    }
  },

  // Dashboard Widgets Configuration
  widgets: {
    // Quick Stats Widgets
    imagingStats: {
      id: 'imaging_stats',
      type: 'stats-grid',
      title: 'Imaging Statistics',
      priority: 1,
      size: { cols: 12, rows: 1 },
      refreshInterval: 30000,
      permissions: ['radiology:view'],
      config: {
        metrics: [
          { key: 'totalExams', label: 'Total Exams Today', icon: 'ri-scan-line', color: '#0d6efd' },
          { key: 'pendingReports', label: 'Pending Reports', icon: 'ri-file-list-line', color: '#ffc107' },
          { key: 'completedReports', label: 'Completed Reports', icon: 'ri-checkbox-circle-line', color: '#198754' },
          { key: 'criticalFindings', label: 'Critical Findings', icon: 'ri-alarm-warning-line', color: '#dc3545' }
        ]
      }
    },

    // Equipment Status Widget
    equipmentStatus: {
      id: 'equipment_status',
      type: 'status-grid',
      title: 'Equipment Status',
      priority: 2,
      size: { cols: 6, rows: 2 },
      refreshInterval: 60000,
      permissions: ['equipment:view'],
      config: {
        equipmentTypes: ['CT Scanner', 'MRI Machine', 'X-Ray Unit', 'Ultrasound'],
        statusColors: {
          online: '#198754',
          offline: '#dc3545',
          maintenance: '#ffc107',
          inUse: '#0d6efd'
        }
      }
    },

    // Workload Distribution Chart
    workloadChart: {
      id: 'workload_chart',
      type: 'chart',
      title: 'Workload Distribution',
      priority: 3,
      size: { cols: 6, rows: 2 },
      refreshInterval: 300000,
      permissions: ['radiology:view'],
      config: {
        chartType: 'donut',
        dataSource: 'workload_distribution',
        colors: ['#0d6efd', '#198754', '#ffc107', '#fd7e14', '#6f42c1']
      }
    },

    // Recent Exams Table
    recentExams: {
      id: 'recent_exams',
      type: 'data-table',
      title: 'Recent Examinations',
      priority: 4,
      size: { cols: 12, rows: 3 },
      refreshInterval: 30000,
      permissions: ['radiology:view'],
      config: {
        maxRows: 10,
        columns: [
          { key: 'examId', label: 'Exam ID', sortable: true },
          { key: 'patientName', label: 'Patient', sortable: true },
          { key: 'modality', label: 'Modality', sortable: true },
          { key: 'timestamp', label: 'Time', sortable: true },
          { key: 'status', label: 'Status', sortable: false },
          { key: 'actions', label: 'Actions', sortable: false }
        ],
        actions: ['view', 'report', 'download']
      }
    },

    // Critical Alerts Widget
    criticalAlerts: {
      id: 'critical_alerts',
      type: 'alert-list',
      title: 'Critical Alerts & Notifications',
      priority: 5,
      size: { cols: 6, rows: 2 },
      refreshInterval: 15000,
      permissions: ['radiology:view'],
      config: {
        alertTypes: {
          critical: { color: '#dc3545', icon: 'ri-alarm-warning-line' },
          urgent: { color: '#fd7e14', icon: 'ri-error-warning-line' },
          info: { color: '#0dcaf0', icon: 'ri-information-line' }
        },
        maxAlerts: 5,
        autoRefresh: true
      }
    },

    // Performance Metrics
    performanceMetrics: {
      id: 'performance_metrics',
      type: 'metrics-chart',
      title: 'Performance Analytics',
      priority: 6,
      size: { cols: 6, rows: 2 },
      refreshInterval: 600000,
      permissions: ['radiology:view', 'dashboard:admin'],
      config: {
        metrics: [
          { key: 'turnaroundTime', label: 'Avg. Turnaround Time', unit: 'hours', target: 24 },
          { key: 'reportingRate', label: 'Reporting Rate', unit: '%', target: 95 },
          { key: 'qualityScore', label: 'Quality Score', unit: '%', target: 98 },
          { key: 'patientSatisfaction', label: 'Patient Satisfaction', unit: '%', target: 90 }
        ]
      }
    },

    // AI Insights Widget
    aiInsights: {
      id: 'ai_insights',
      type: 'ai-panel',
      title: 'AI-Enhanced Diagnostics',
      priority: 7,
      size: { cols: 12, rows: 2 },
      refreshInterval: 120000,
      permissions: ['radiology:view'],
      config: {
        features: [
          { name: 'Automated Findings Detection', enabled: true },
          { name: 'Comparison Studies', enabled: true },
          { name: 'Measurement Assistance', enabled: true },
          { name: 'Report Generation', enabled: false }
        ],
        confidence: { threshold: 85, display: true }
      }
    }
  },

  // Layout Configurations by Role
  layouts: {
    admin: {
      grid: { cols: 12, rows: 12, margin: [10, 10] },
      widgets: [
        { id: 'imaging_stats', position: { x: 0, y: 0, w: 12, h: 1 } },
        { id: 'equipment_status', position: { x: 0, y: 1, w: 6, h: 2 } },
        { id: 'workload_chart', position: { x: 6, y: 1, w: 6, h: 2 } },
        { id: 'recent_exams', position: { x: 0, y: 3, w: 8, h: 3 } },
        { id: 'critical_alerts', position: { x: 8, y: 3, w: 4, h: 3 } },
        { id: 'performance_metrics', position: { x: 0, y: 6, w: 6, h: 2 } },
        { id: 'ai_insights', position: { x: 6, y: 6, w: 6, h: 2 } }
      ]
    },
    radiologist: {
      grid: { cols: 12, rows: 10, margin: [10, 10] },
      widgets: [
        { id: 'imaging_stats', position: { x: 0, y: 0, w: 12, h: 1 } },
        { id: 'recent_exams', position: { x: 0, y: 1, w: 8, h: 4 } },
        { id: 'critical_alerts', position: { x: 8, y: 1, w: 4, h: 2 } },
        { id: 'workload_chart', position: { x: 8, y: 3, w: 4, h: 2 } },
        { id: 'ai_insights', position: { x: 0, y: 5, w: 12, h: 2 } }
      ]
    },
    technician: {
      grid: { cols: 12, rows: 8, margin: [10, 10] },
      widgets: [
        { id: 'imaging_stats', position: { x: 0, y: 0, w: 12, h: 1 } },
        { id: 'equipment_status', position: { x: 0, y: 1, w: 6, h: 2 } },
        { id: 'recent_exams', position: { x: 6, y: 1, w: 6, h: 4 } },
        { id: 'critical_alerts', position: { x: 0, y: 3, w: 6, h: 2 } }
      ]
    },
    doctor: {
      grid: { cols: 12, rows: 8, margin: [10, 10] },
      widgets: [
        { id: 'imaging_stats', position: { x: 0, y: 0, w: 12, h: 1 } },
        { id: 'recent_exams', position: { x: 0, y: 1, w: 8, h: 3 } },
        { id: 'critical_alerts', position: { x: 8, y: 1, w: 4, h: 2 } },
        { id: 'workload_chart', position: { x: 8, y: 3, w: 4, h: 1 } }
      ]
    },
    viewer: {
      grid: { cols: 12, rows: 6, margin: [10, 10] },
      widgets: [
        { id: 'imaging_stats', position: { x: 0, y: 0, w: 12, h: 1 } },
        { id: 'recent_exams', position: { x: 0, y: 1, w: 12, h: 3 } }
      ]
    }
  },

  // Advanced Features Configuration
  features: {
    realTimeCollaboration: {
      enabled: true,
      maxConcurrentUsers: 10,
      sessionTimeout: 300000, // 5 minutes
      permissions: ['radiology:view']
    },
    aiDiagnostics: {
      enabled: true,
      confidenceThreshold: 85,
      modelVersion: 'v2.1',
      supportedModalities: ['xray', 'ct', 'mri'],
      permissions: ['radiology:view']
    },
    threeD_visualization: {
      enabled: true,
      supportedFormats: ['DICOM', 'NIfTI', 'STL'],
      maxFileSize: '500MB',
      permissions: ['radiology:view']
    },
    automaticMeasurements: {
      enabled: true,
      measurements: ['distance', 'angle', 'area', 'volume'],
      accuracy: 0.1, // mm
      permissions: ['radiology:create']
    },
    reportTemplates: {
      enabled: true,
      templates: [
        'chest_xray',
        'abdominal_ct',
        'brain_mri',
        'cardiac_echo',
        'mammography_screening'
      ],
      customTemplates: true,
      permissions: ['report:create']
    },
    qualityAssurance: {
      enabled: true,
      autoChecks: ['image_quality', 'protocol_compliance', 'dose_monitoring'],
      thresholds: {
        imageQuality: 85,
        doseLimit: 10, // mSv
        protocolCompliance: 95
      },
      permissions: ['equipment:view']
    }
  },

  // Color Themes
  themes: {
    light: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#0dcaf0',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529'
    },
    dark: {
      primary: '#4dabf7',
      secondary: '#adb5bd',
      success: '#51cf66',
      warning: '#ffd43b',
      danger: '#ff6b6b',
      info: '#74c0fc',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff'
    },
    medical: {
      primary: '#2c5aa0',
      secondary: '#95a5a6',
      success: '#27ae60',
      warning: '#f39c12',
      danger: '#e74c3c',
      info: '#3498db',
      background: '#ecf0f1',
      surface: '#ffffff',
      text: '#2c3e50'
    }
  },

  // Integration Settings
  integrations: {
    pacs: {
      enabled: true,
      endpoint: '/api/pacs',
      supportedFormats: ['DICOM'],
      autoSync: true
    },
    ris: {
      enabled: true,
      endpoint: '/api/ris',
      autoScheduling: true,
      statusUpdates: true
    },
    hl7: {
      enabled: true,
      version: '2.5',
      messageTypes: ['ADT', 'ORM', 'ORU'],
      autoAck: true
    },
    dicomSR: {
      enabled: true,
      templates: ['Measurement', 'CAD', 'Comprehensive'],
      autoGeneration: false
    }
  },

  // Default Settings
  defaults: {
    theme: 'medical',
    autoRefresh: true,
    refreshInterval: 30000,
    maxConcurrentSessions: 5,
    sessionWarningTime: 300000, // 5 minutes before logout
    imageCaching: true,
    compressionLevel: 'medium',
    annotationTools: ['arrow', 'text', 'measure', 'roi'],
    keyboardShortcuts: true
  }
};

// Helper Functions
export const getWidgetsByRole = (role) => {
  const layout = radiologyDashboardConfig.layouts[role] || radiologyDashboardConfig.layouts.viewer;
  return layout.widgets.map(widget => ({
    ...radiologyDashboardConfig.widgets[widget.id],
    position: widget.position
  }));
};

export const getModalityConfig = (modalityId) => {
  return radiologyDashboardConfig.imagingModalities[modalityId];
};

export const getFeatureFlag = (feature) => {
  return radiologyDashboardConfig.features[feature]?.enabled || false;
};

export const getTheme = (themeName = 'medical') => {
  return radiologyDashboardConfig.themes[themeName] || radiologyDashboardConfig.themes.medical;
};

export const isFeatureEnabled = (feature, userPermissions = []) => {
  const featureConfig = radiologyDashboardConfig.features[feature];
  if (!featureConfig || !featureConfig.enabled) return false;
  
  if (!featureConfig.permissions) return true;
  
  return featureConfig.permissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export default radiologyDashboardConfig;