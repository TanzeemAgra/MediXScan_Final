// API Service Layer for MediXScan Frontend
import apiConfig from '../config/api.config';

class ApiService {
  constructor() {
    this.baseURL = apiConfig.backend.baseURL;
    this.timeout = apiConfig.backend.timeout;
    this.retryAttempts = apiConfig.backend.retryAttempts;
    this.retryDelay = apiConfig.backend.retryDelay;
  }

  // Build full URL from endpoint configuration
  buildURL(endpointPath, params = {}) {
    let url = this.baseURL + endpointPath;
    
    // Replace path parameters (e.g., {id} with actual id)
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    // Support both legacy and new token keys
    return localStorage.getItem('medixscan_access_token') ||
           localStorage.getItem('medixscan_auth_token') ||
           localStorage.getItem('authToken');
  }

  // Get refresh token from localStorage
  getRefreshToken() {
    return localStorage.getItem('medixscan_refresh_token') ||
           localStorage.getItem('refresh_token');
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(this.buildURL(apiConfig.endpoints.auth.refreshToken), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      // Store new access token
      if (data.access) {
        localStorage.setItem('medixscan_access_token', data.access);
      }

      // Store new refresh token if provided
      if (data.refresh) {
        localStorage.setItem('medixscan_refresh_token', data.refresh);
      }

      return data.access;
    } catch (error) {
      // If refresh fails, clear all tokens and throw error
      localStorage.removeItem('authToken');
      localStorage.removeItem('medixscan_auth_token');
      localStorage.removeItem('medixscan_access_token');
      localStorage.removeItem('medixscan_refresh_token');
      throw error;
    }
  }

  // Build request headers
  buildHeaders(customHeaders = {}) {
    const headers = { ...apiConfig.headers.default };
    
    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { ...headers, ...customHeaders };
  }

  // Handle API errors with soft coding configuration
  handleError(error, context = '') {
    if (apiConfig.features.errorReporting.logToConsole) {
      console.error(`API Error [${context}]:`, error);
    }

    // Check if it's a network error
    if (!error.response) {
      throw {
        type: 'network',
        message: 'Network error. Please check your connection.',
        original: error
      };
    }

    const { status, data } = error.response;
    
    // Handle different status codes based on configuration
    if (apiConfig.statusCodes.unauthorized === status) {
      // Handle unauthorized access
      // Remove all stored tokens but do not force a navigation here; let UI handle redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('medixscan_auth_token');
      localStorage.removeItem('medixscan_access_token');
      localStorage.removeItem('medixscan_refresh_token');
      throw {
        type: 'unauthorized',
        message: 'Session expired. Please login again.',
        status
      };
    }

    if (apiConfig.statusCodes.clientError.includes(status)) {
      throw {
        type: 'client',
        message: data?.message || 'Client error occurred',
        details: data?.errors || data?.detail,
        status
      };
    }

    if (apiConfig.statusCodes.serverError.includes(status)) {
      throw {
        type: 'server',
        message: 'Server error occurred. Please try again later.',
        status
      };
    }

    // Generic error
    throw {
      type: 'unknown',
      message: data?.message || 'An unexpected error occurred',
      status
    };
  }

  // Generic request method with retry logic and automatic token refresh
  async makeRequest(url, options = {}, context = '', attempt = 1, skipTokenRefresh = false) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers: this.buildHeaders(options.headers),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 Unauthorized - attempt token refresh
        if (response.status === 401 && !skipTokenRefresh && this.getRefreshToken()) {
          try {
            console.log('Token expired, attempting refresh...');
            await this.refreshAccessToken();

            // Retry the original request with new token
            return this.makeRequest(url, options, context, attempt, true);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Continue with original error handling
          }
        }

        // Soft-coded error handling: Try to parse JSON, fallback to text for HTML responses
        let errorData;
        const contentType = response.headers.get('content-type');

        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            // Handle HTML error pages or plain text responses
            const textResponse = await response.text();
            errorData = {
              message: `Server returned ${response.status}`,
              detail: textResponse.includes('<!DOCTYPE')
                ? `Server returned HTML instead of JSON. Check if the endpoint exists.`
                : textResponse
            };
          }
        } catch (parseError) {
          // Fallback if parsing fails
          errorData = {
            message: `Server error ${response.status}`,
            detail: 'Unable to parse error response'
          };
        }

        throw { response: { status: response.status, data: errorData } };
      }

      // Soft-coded response handling: Check content type before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Handle non-JSON responses
        const textResponse = await response.text();
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}: ${textResponse.substring(0, 100)}...`);
      }
    } catch (error) {
      if (attempt < this.retryAttempts &&
          (error.name === 'AbortError' || error.type === 'network')) {
        console.warn(`Retry attempt ${attempt} for ${context}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.makeRequest(url, options, context, attempt + 1, skipTokenRefresh);
      }

      this.handleError(error, context);
    }
  }

  // GET request
  async get(endpointPath, params = {}, queryParams = {}) {
    const url = new URL(this.buildURL(endpointPath, params));
    
    // Add query parameters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    return this.makeRequest(url.toString(), { method: 'GET' }, `GET ${endpointPath}`);
  }

  // POST request
  async post(endpointPath, data = {}, params = {}) {
    const url = this.buildURL(endpointPath, params);
    
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, `POST ${endpointPath}`);
  }

  // PUT request
  async put(endpointPath, data = {}, params = {}) {
    const url = this.buildURL(endpointPath, params);
    
    return this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, `PUT ${endpointPath}`);
  }

  // PATCH request
  async patch(endpointPath, data = {}, params = {}) {
    const url = this.buildURL(endpointPath, params);
    
    return this.makeRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, `PATCH ${endpointPath}`);
  }

  // DELETE request
  async delete(endpointPath, params = {}) {
    const url = this.buildURL(endpointPath, params);
    
    return this.makeRequest(url, {
      method: 'DELETE'
    }, `DELETE ${endpointPath}`);
  }

  // File upload request
  async uploadFile(endpointPath, formData, params = {}) {
    const url = this.buildURL(endpointPath, params);
    
    return this.makeRequest(url, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set content-type for multipart
    }, `UPLOAD ${endpointPath}`);
  }
}

// Create singleton instance
const apiService = new ApiService();

// Specific service methods using endpoint configuration
export const authService = {
  login: (credentials) => apiService.post(apiConfig.endpoints.auth.login, credentials),
  logout: () => apiService.post(apiConfig.endpoints.auth.logout),
  register: (userData) => apiService.post(apiConfig.endpoints.auth.register, userData),
  refreshToken: (refreshToken) => apiService.post(apiConfig.endpoints.auth.refreshToken, { refresh: refreshToken }),
  getProfile: () => apiService.get(apiConfig.endpoints.auth.profile),
  changePassword: (passwords) => apiService.post(apiConfig.endpoints.auth.changePassword, passwords)
};

export const patientService = {
  getAll: (queryParams = {}) => apiService.get(apiConfig.endpoints.patients.list, {}, queryParams),
  getById: (id) => apiService.get(apiConfig.endpoints.patients.detail, { id }),
  create: (patientData) => apiService.post(apiConfig.endpoints.patients.create, patientData),
  update: (id, patientData) => apiService.put(apiConfig.endpoints.patients.update, patientData, { id }),
  delete: (id) => apiService.delete(apiConfig.endpoints.patients.delete, { id }),
  getStatistics: () => apiService.get(apiConfig.endpoints.patients.statistics),
  search: (query) => apiService.get(apiConfig.endpoints.patients.search, {}, { q: query })
};

export const doctorService = {
  getAll: (queryParams = {}) => apiService.get(apiConfig.endpoints.doctors.list, {}, queryParams),
  getById: (id) => apiService.get(apiConfig.endpoints.doctors.detail, { id }),
  create: (doctorData) => apiService.post(apiConfig.endpoints.doctors.create, doctorData),
  update: (id, doctorData) => apiService.put(apiConfig.endpoints.doctors.update, doctorData, { id }),
  delete: (id) => apiService.delete(apiConfig.endpoints.doctors.delete, { id }),
  getSpecializations: () => apiService.get(apiConfig.endpoints.doctors.specializations),
  getAvailability: (id) => apiService.get(apiConfig.endpoints.doctors.availability, { id }),
  getStatistics: () => apiService.get(apiConfig.endpoints.doctors.statistics)
};

export const appointmentService = {
  getAll: (queryParams = {}) => apiService.get(apiConfig.endpoints.appointments.list, {}, queryParams),
  getById: (id) => apiService.get(apiConfig.endpoints.appointments.detail, { id }),
  create: (appointmentData) => apiService.post(apiConfig.endpoints.appointments.create, appointmentData),
  update: (id, appointmentData) => apiService.put(apiConfig.endpoints.appointments.update, appointmentData, { id }),
  delete: (id) => apiService.delete(apiConfig.endpoints.appointments.delete, { id }),
  getToday: () => apiService.get(apiConfig.endpoints.appointments.today),
  getUpcoming: () => apiService.get(apiConfig.endpoints.appointments.upcoming),
  getStatistics: () => apiService.get(apiConfig.endpoints.appointments.statistics),
  getByDoctor: (doctorId) => apiService.get(apiConfig.endpoints.appointments.byDoctor, { doctorId }),
  getByPatient: (patientId) => apiService.get(apiConfig.endpoints.appointments.byPatient, { patientId })
};

export const medicalRecordService = {
  getAll: (queryParams = {}) => apiService.get(apiConfig.endpoints.medicalRecords.list, {}, queryParams),
  getById: (id) => apiService.get(apiConfig.endpoints.medicalRecords.detail, { id }),
  create: (recordData) => apiService.post(apiConfig.endpoints.medicalRecords.create, recordData),
  update: (id, recordData) => apiService.put(apiConfig.endpoints.medicalRecords.update, recordData, { id }),
  delete: (id) => apiService.delete(apiConfig.endpoints.medicalRecords.delete, { id }),
  getByPatient: (patientId) => apiService.get(apiConfig.endpoints.medicalRecords.byPatient, { patientId }),
  getRadiology: (queryParams = {}) => apiService.get(apiConfig.endpoints.medicalRecords.radiology, {}, queryParams),
  getRadiologyTypes: () => apiService.get(apiConfig.endpoints.medicalRecords.radiologyTypes),
  getStatistics: () => apiService.get(apiConfig.endpoints.medicalRecords.statistics)
};

export const anonymizationService = {
  analyze: (textData) => apiService.post(apiConfig.endpoints.medicalRecords.anonymization.analyze, { text: textData }),
  anonymize: (anonymizationRequest) => apiService.post(apiConfig.endpoints.medicalRecords.anonymization.anonymize, anonymizationRequest),
  batchAnonymize: (batchRequest) => apiService.post(apiConfig.endpoints.medicalRecords.anonymization.batchAnonymize, batchRequest),
  getInsights: (textData) => apiService.post(apiConfig.endpoints.medicalRecords.anonymization.getInsights, { text: textData }),
  exportAnonymized: (id) => apiService.get(apiConfig.endpoints.medicalRecords.anonymization.exportAnonymized, { id }),
  getAuditLog: (queryParams = {}) => apiService.get(apiConfig.endpoints.medicalRecords.anonymization.auditLog, {}, queryParams),
  getConfig: () => apiService.get(apiConfig.endpoints.medicalRecords.anonymization.config),
  updateConfig: (configData) => apiService.post(apiConfig.endpoints.medicalRecords.anonymization.config, configData),
  
  // File processing methods
  processFile: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add options to form data
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    try {
      const response = await fetch(apiService.buildURL(apiConfig.endpoints.medicalRecords.anonymization.processFile), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiService.getAuthToken() || ''}`,
          // Note: Don't set Content-Type for FormData, let browser set it
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  },

  getSupportedFormats: () => apiService.get(apiConfig.endpoints.medicalRecords.anonymization.supportedFormats),
  
  downloadAnonymizedFile: (requestId, format = 'txt') => {
    const url = apiService.buildURL(apiConfig.endpoints.medicalRecords.anonymization.exportAnonymized, { id: requestId });
    const downloadUrl = `${url}?format=${format}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `anonymized_${requestId}.${format}`;
    
    // Add authorization header for download
    const token = apiService.getAuthToken();
    if (token) {
      // For file downloads, we need to handle authorization differently
      // This creates a temporary download with auth
      fetch(downloadUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Download failed:', error);
        throw error;
      });
    } else {
      // No auth needed or fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export const dashboardService = {
  getOverview: () => apiService.get(apiConfig.endpoints.dashboard.overview),
  getPatientStats: () => apiService.get(apiConfig.endpoints.dashboard.patientStats),
  getAppointmentStats: () => apiService.get(apiConfig.endpoints.dashboard.appointmentStats),
  getDoctorStats: () => apiService.get(apiConfig.endpoints.dashboard.doctorStats),
  getRecentActivities: () => apiService.get(apiConfig.endpoints.dashboard.recentActivities),
  getChartData: (type) => apiService.get(apiConfig.endpoints.dashboard.chartData, {}, { type })
};

export const notificationService = {
  getAll: () => apiService.get(apiConfig.endpoints.notifications.list),
  getUnread: () => apiService.get(apiConfig.endpoints.notifications.unread),
  markAsRead: (id) => apiService.patch(apiConfig.endpoints.notifications.markRead, {}, { id }),
  markAllAsRead: () => apiService.patch(apiConfig.endpoints.notifications.markAllRead)
};

export const equipmentService = {
  getAll: (queryParams = {}) => apiService.get(apiConfig.endpoints.equipment.list, {}, queryParams),
  getById: (id) => apiService.get(apiConfig.endpoints.equipment.detail, { id }),
  create: (equipmentData) => apiService.post(apiConfig.endpoints.equipment.create, equipmentData),
  update: (id, equipmentData) => apiService.put(apiConfig.endpoints.equipment.update, equipmentData, { id }),
  delete: (id) => apiService.delete(apiConfig.endpoints.equipment.delete, { id }),
  
  // Equipment Status Operations
  getStatus: () => apiService.get(apiConfig.endpoints.equipment.status),
  getMaintenance: () => apiService.get(apiConfig.endpoints.equipment.maintenance),
  getUtilization: () => apiService.get(apiConfig.endpoints.equipment.utilization),
  getStatistics: () => apiService.get(apiConfig.endpoints.equipment.statistics),
  
  // Equipment Type Operations
  getByType: (type) => apiService.get(apiConfig.endpoints.equipment.byType, { type }),
  
  // Scheduling Operations
  getSchedule: (id) => apiService.get(apiConfig.endpoints.equipment.schedule, { id }),
  bookSlot: (id, slotData) => apiService.post(apiConfig.endpoints.equipment.bookSlot, slotData, { id }),
  getAvailability: (id, queryParams = {}) => apiService.get(apiConfig.endpoints.equipment.availability, { id }, queryParams),
  
  // Maintenance Operations
  getMaintenanceLog: (id) => apiService.get(apiConfig.endpoints.equipment.maintenanceLog, { id }),
  addMaintenanceEntry: (id, maintenanceData) => apiService.post(apiConfig.endpoints.equipment.maintenanceLog, maintenanceData, { id }),
  
  // Performance Metrics
  getPerformanceMetrics: (id, queryParams = {}) => apiService.get(apiConfig.endpoints.equipment.performanceMetrics, { id }, queryParams),
  
  // Soft-coded mock data for development (when backend is not available)
  getMockEquipmentData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalEquipment: 24,
            activeEquipment: 18,
            maintenanceEquipment: 4,
            offlineEquipment: 2,
            utilizationRate: 75.8,
            equipmentList: [
              {
                id: 1,
                name: 'MRI Scanner - Siemens',
                type: 'MRI',
                status: 'active',
                utilization: 85.2,
                location: 'Radiology Wing A',
                nextMaintenance: '2025-10-15',
                lastUsed: '2025-09-22T08:30:00'
              },
              {
                id: 2,
                name: 'CT Scanner - GE Healthcare',
                type: 'CT',
                status: 'active',
                utilization: 92.1,
                location: 'Radiology Wing B',
                nextMaintenance: '2025-09-30',
                lastUsed: '2025-09-22T09:15:00'
              },
              {
                id: 3,
                name: 'X-Ray Machine - Philips',
                type: 'XRAY',
                status: 'maintenance',
                utilization: 0,
                location: 'Emergency Department',
                nextMaintenance: '2025-09-25',
                lastUsed: '2025-09-20T16:45:00'
              },
              {
                id: 4,
                name: 'Ultrasound - Samsung',
                type: 'ULTRASOUND',
                status: 'active',
                utilization: 68.5,
                location: 'Radiology Wing C',
                nextMaintenance: '2025-11-05',
                lastUsed: '2025-09-22T07:20:00'
              }
            ],
            performanceMetrics: {
              dailyScans: 156,
              weeklyAverage: 142,
              monthlyTotal: 4230,
              equipmentUptime: 96.2,
              averageWaitTime: 12.5
            }
          }
        });
      }, 800);
    });
  }
};

export default apiService;