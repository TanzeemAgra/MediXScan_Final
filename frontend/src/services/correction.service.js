import apiService from './api.service';
import apiConfig from '../config/api.config';

// Correction service uses shared apiService and centralized API configuration
const correctionService = {
  submit: async (payload) => {
    // Use configured endpoint from API config
    const endpoint = apiConfig.endpoints.medicalRecords.corrections.submit;
    return apiService.post(endpoint, payload);
  },

  getRequest: async (request_id) => {
    // Use parameterized endpoint from API config
    const endpoint = apiConfig.endpoints.medicalRecords.corrections.request;
    return apiService.get(endpoint, { id: request_id });
  },

  analyze: async (text) => {
    // Use configured analyze endpoint from API config
    const endpoint = apiConfig.endpoints.medicalRecords.corrections.analyze;
    return apiService.post(endpoint, { text });
  },

  accept: async (request_id) => {
    // Use configured accept endpoint from API config
    const endpoint = apiConfig.endpoints.medicalRecords.corrections.accept;
    return apiService.post(endpoint, {}, { id: request_id });
  },

  list: async (params = {}) => {
    // Use configured list endpoint from API config
    const endpoint = apiConfig.endpoints.medicalRecords.corrections.list;
    return apiService.get(endpoint, params);
  }
};

export default correctionService;
