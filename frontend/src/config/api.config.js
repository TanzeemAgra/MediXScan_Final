// API Configuration for MediXScan Frontend
import environmentConfig from './environment.config';

const apiConfig = {
  // Backend API Settings - using environment config for soft coding with Railway production URL
  backend: {
    baseURL: environmentConfig.buildApiUrl() || 
             import.meta.env.VITE_API_URL || 
             (import.meta.env.MODE === 'production' ? 'https://medixscanfinal-production.up.railway.app' : 'http://localhost:8000'),
    version: 'v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    retryDelay: 1000
  },

  // API Endpoints Configuration
  endpoints: {
    // Authentication endpoints
    auth: {
      login: '/api/v1/auth/login/',
      logout: '/api/v1/auth/logout/',
      register: '/api/v1/auth/register/',
      refreshToken: '/api/v1/auth/refresh/',
      profile: '/api/v1/auth/profile/',
      changePassword: '/api/v1/auth/change-password/'
    },

    // Patient endpoints
    patients: {
      list: '/api/v1/patients/',
      detail: '/api/v1/patients/{id}/',
      create: '/api/v1/patients/',
      update: '/api/v1/patients/{id}/',
      delete: '/api/v1/patients/{id}/',
      statistics: '/api/v1/patients/statistics/',
      search: '/api/v1/patients/search/'
    },

    // Doctor endpoints
    doctors: {
      list: '/api/v1/doctors/',
      detail: '/api/v1/doctors/{id}/',
      create: '/api/v1/doctors/',
      update: '/api/v1/doctors/{id}/',
      delete: '/api/v1/doctors/{id}/',
      specializations: '/api/v1/doctors/specializations/',
      availability: '/api/v1/doctors/{id}/availability/',
      statistics: '/api/v1/doctors/statistics/'
    },

    // Appointment endpoints
    appointments: {
      list: '/api/v1/appointments/',
      detail: '/api/v1/appointments/{id}/',
      create: '/api/v1/appointments/',
      update: '/api/v1/appointments/{id}/',
      delete: '/api/v1/appointments/{id}/',
      today: '/api/v1/appointments/today/',
      upcoming: '/api/v1/appointments/upcoming/',
      statistics: '/api/v1/appointments/statistics/',
      byDoctor: '/api/v1/appointments/doctor/{doctorId}/',
      byPatient: '/api/v1/appointments/patient/{patientId}/'
    },

    // Medical Records endpoints
    medicalRecords: {
      list: '/api/v1/medical-records/',
      detail: '/api/v1/medical-records/{id}/',
      create: '/api/v1/medical-records/',
      update: '/api/v1/medical-records/{id}/',
      delete: '/api/v1/medical-records/{id}/',
      byPatient: '/api/v1/medical-records/patient/{patientId}/',
      radiology: '/api/v1/medical-records/radiology/',
      radiologyTypes: '/api/v1/medical-records/radiology/types/',
      statistics: '/api/v1/medical-records/statistics/',
      // Report Correction endpoints
      corrections: {
        submit: '/api/v1/medical-records/corrections/submit/',
        analyze: '/api/v1/medical-records/corrections/analyze/',
        request: '/api/v1/medical-records/corrections/{id}/',
        accept: '/api/v1/medical-records/corrections/{id}/accept/',
        list: '/api/v1/medical-records/corrections/'
      },
      // Anonymization endpoints
      anonymization: {
        analyze: '/api/v1/medical-records/anonymization/analyze/',
        anonymize: '/api/v1/medical-records/anonymization/anonymize/',
        batchAnonymize: '/api/v1/medical-records/anonymization/batch/',
        getInsights: '/api/v1/medical-records/anonymization/insights/',
        exportAnonymized: '/api/v1/medical-records/anonymization/export/{id}/',
        auditLog: '/api/v1/medical-records/anonymization/audit/',
        config: '/api/v1/medical-records/anonymization/config/',
        processFile: '/api/v1/medical-records/anonymization/process-file/',
        supportedFormats: '/api/v1/medical-records/anonymization/supported-formats/'
      }
    },

    // Dashboard endpoints
    dashboard: {
      overview: '/api/v1/dashboard/overview/',
      patientStats: '/api/v1/dashboard/patient-stats/',
      appointmentStats: '/api/v1/dashboard/appointment-stats/',
      doctorStats: '/api/v1/dashboard/doctor-stats/',
      recentActivities: '/api/v1/dashboard/recent-activities/',
      chartData: '/api/v1/dashboard/chart-data/'
    },

    // Notifications endpoints
    notifications: {
      list: '/api/v1/notifications/',
      unread: '/api/v1/notifications/unread/',
      markRead: '/api/v1/notifications/{id}/mark-read/',
      markAllRead: '/api/v1/notifications/mark-all-read/'
    },

    // Equipment/Radiology Equipment endpoints
    equipment: {
      list: '/api/v1/equipment/',
      detail: '/api/v1/equipment/{id}/',
      create: '/api/v1/equipment/',
      update: '/api/v1/equipment/{id}/',
      delete: '/api/v1/equipment/{id}/',
      status: '/api/v1/equipment/status/',
      maintenance: '/api/v1/equipment/maintenance/',
      utilization: '/api/v1/equipment/utilization/',
      statistics: '/api/v1/equipment/statistics/',
      byType: '/api/v1/equipment/type/{type}/',
      schedule: '/api/v1/equipment/{id}/schedule/',
      bookSlot: '/api/v1/equipment/{id}/book-slot/',
      availability: '/api/v1/equipment/{id}/availability/',
      maintenanceLog: '/api/v1/equipment/{id}/maintenance-log/',
      performanceMetrics: '/api/v1/equipment/{id}/performance-metrics/'
    }
  },

  // Request Headers Configuration
  headers: {
    default: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    multipart: {
      'Content-Type': 'multipart/form-data'
    }
  },

  // Response Status Codes
  statusCodes: {
    success: [200, 201, 202, 204],
    clientError: [400, 401, 403, 404, 422],
    serverError: [500, 502, 503, 504],
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    validationError: 422
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageParam: 'page',
    sizeParam: 'page_size'
  },

  // Data Fetching Configuration
  dataFetching: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // 30 seconds for real-time data
    retry: {
      attempts: 3,
      delay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  },

  // Feature Flags for Soft Coding
  features: {
    realTimeUpdates: {
      enabled: true,
      dashboardRefresh: 30000, // 30 seconds
      appointmentUpdates: 15000, // 15 seconds
      notificationPolling: 10000 // 10 seconds
    },
    caching: {
      enabled: true,
      localStorage: true,
      sessionStorage: false
    },
    errorReporting: {
      enabled: true,
      logToConsole: true,
      sendToServer: false
    },
    mockData: {
      enabled: false, // Set to true for development with mock data
      fallbackOnError: true
    },
    dashboard: {
      useRealData: true, // Set to false to use original dummy dashboard
      enableFiltering: true,
      enableSearch: true,
      autoRefresh: true
    },
    radiology: {
      useRealData: true, // Set to false to use original static data
      enableStatusUpdates: true,
      enablePriority: true
    }
  }
};

export default apiConfig;