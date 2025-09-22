import apiService from './api.service';
import apiConfig from '../config/api.config';

// Correction service uses shared apiService so headers, auth and URL building are consistent
const correctionService = {
  submit: async (payload) => {
    // Build endpoint relative path using configured medicalRecords.list and append corrections path
    const basePath = (apiConfig.endpoints.medicalRecords && apiConfig.endpoints.medicalRecords.list)
      ? apiConfig.endpoints.medicalRecords.list
      : '/api/v1/medical-records/';

    const endpoint = `${basePath}corrections/submit/`;
    // Use apiService.post which handles headers, auth token and retries
    return apiService.post(endpoint, payload);
  },

  getRequest: async (request_id) => {
    // Use parameterized endpoint so apiService.buildURL can replace the {id}
    const endpoint = '/api/v1/medical-records/corrections/{id}/';
    return apiService.get(endpoint, { id: request_id });
  }
  ,
  analyze: async (text) => {
    const endpoint = '/api/v1/medical-records/corrections/analyze/';
    return apiService.post(endpoint, { text });
  }
};

export default correctionService;
