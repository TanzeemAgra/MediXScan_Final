// Advanced Patient API Service - Database Integration
// Comprehensive patient management with soft-coded database operations

import apiConfig from '../config/api.config.js';
import patientDashboardConfig from '../config/patient-dashboard.config.js';

class PatientAPIService {
  constructor() {
    this.config = patientDashboardConfig;
    this.baseURL = apiConfig.apiUrl || 'http://localhost:8000';
    this.endpoints = this.config.apiIntegration.endpoints;
  }

  // Utility method for API requests with error handling
  async apiRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    };

    const config = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data, status: response.status };
    } catch (error) {
      console.error('API Request failed:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  // Patient CRUD Operations
  async getAllPatients(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      page_size: params.pageSize || this.config.apiIntegration.pagination.defaultPageSize,
      ordering: params.ordering || '-created_at',
      ...params.filters
    });

    return await this.apiRequest(`${this.endpoints.patients.list}?${queryParams}`);
  }

  async getPatientById(patientId) {
    const url = this.endpoints.patients.detail.replace('{id}', patientId);
    return await this.apiRequest(url);
  }

  async createPatient(patientData) {
    return await this.apiRequest(this.endpoints.patients.create, {
      method: 'POST',
      body: JSON.stringify(this.formatPatientData(patientData))
    });
  }

  async updatePatient(patientId, patientData) {
    const url = this.endpoints.patients.update.replace('{id}', patientId);
    return await this.apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(this.formatPatientData(patientData))
    });
  }

  async deletePatient(patientId) {
    const url = this.endpoints.patients.delete.replace('{id}', patientId);
    return await this.apiRequest(url, { method: 'DELETE' });
  }

  // Advanced Search Operations
  async searchPatients(searchQuery, filters = {}) {
    const searchParams = {
      q: searchQuery,
      ...filters,
      fields: this.config.searchConfiguration.searchableFields.join(',')
    };

    const queryParams = new URLSearchParams(searchParams);
    return await this.apiRequest(`${this.endpoints.patients.search}?${queryParams}`);
  }

  async getPatientStatistics() {
    return await this.apiRequest(this.endpoints.patients.stats);
  }

  // Medical Records Integration
  async getPatientMedicalRecords(patientId, params = {}) {
    const url = this.endpoints.medicalRecords.list.replace('{patientId}', patientId);
    const queryParams = new URLSearchParams(params);
    return await this.apiRequest(`${url}?${queryParams}`);
  }

  async getPatientVitalSigns(patientId, timeRange = 'last6Months') {
    const url = this.endpoints.medicalRecords.vitals.replace('{patientId}', patientId);
    return await this.apiRequest(`${url}&time_range=${timeRange}`);
  }

  // Appointment Integration
  async getPatientAppointments(patientId, type = 'all') {
    let url;
    switch (type) {
      case 'upcoming':
        url = this.endpoints.appointments.upcoming.replace('{patientId}', patientId);
        break;
      case 'history':
        url = this.endpoints.appointments.history.replace('{patientId}', patientId);
        break;
      default:
        url = this.endpoints.appointments.list.replace('{patientId}', patientId);
    }
    return await this.apiRequest(url);
  }

  // Data Formatting and Validation
  formatPatientData(rawData) {
    const formatted = {};
    const dataModel = this.config.patientDataModel;

    // Format personal information
    if (rawData.personalInfo) {
      formatted.personal_info = this.validateAndFormat(
        rawData.personalInfo,
        dataModel.personalInfo
      );
    }

    // Format contact information
    if (rawData.contactInfo) {
      formatted.contact_info = this.validateAndFormat(
        rawData.contactInfo,
        dataModel.contactInfo
      );
    }

    // Format medical information
    if (rawData.medicalInfo) {
      formatted.medical_info = this.validateAndFormat(
        rawData.medicalInfo,
        dataModel.medicalInfo
      );
    }

    // Format insurance information
    if (rawData.insuranceInfo) {
      formatted.insurance_info = this.validateAndFormat(
        rawData.insuranceInfo,
        dataModel.insuranceInfo
      );
    }

    return formatted;
  }

  validateAndFormat(data, schema) {
    const validated = {};

    // Process required fields
    schema.required.forEach(field => {
      if (data[field] !== undefined) {
        validated[field] = this.formatField(data[field], field, schema.validation);
      }
    });

    // Process optional fields
    if (schema.optional) {
      schema.optional.forEach(field => {
        if (data[field] !== undefined) {
          validated[field] = this.formatField(data[field], field, schema.validation);
        }
      });
    }

    return validated;
  }

  formatField(value, fieldName, validation) {
    if (!validation || !validation[fieldName]) return value;

    const fieldValidation = validation[fieldName];

    // Apply formatting based on field type
    switch (fieldValidation.type) {
      case 'date':
        return this.formatDate(value);
      case 'phone':
        return this.formatPhone(value);
      case 'email':
        return value.toLowerCase().trim();
      default:
        return typeof value === 'string' ? value.trim() : value;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  formatPhone(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    return phone; // Return original if not standard format
  }

  // Bulk Operations
  async bulkUpdatePatients(patientIds, updateData) {
    return await this.apiRequest('/api/patients/bulk-update/', {
      method: 'POST',
      body: JSON.stringify({
        patient_ids: patientIds,
        update_data: updateData
      })
    });
  }

  async exportPatientData(patientIds = [], format = 'csv') {
    const params = {
      format,
      ...(patientIds.length > 0 && { patient_ids: patientIds.join(',') })
    };

    const queryParams = new URLSearchParams(params);
    return await this.apiRequest(`/api/patients/export/?${queryParams}`);
  }

  // Analytics and Reporting
  async getPatientDemographics() {
    return await this.apiRequest('/api/patients/demographics/');
  }

  async getPatientTrends(timeRange = 'last12Months') {
    return await this.apiRequest(`/api/patients/trends/?time_range=${timeRange}`);
  }

  async getPatientInsights(patientId) {
    return await this.apiRequest(`/api/patients/${patientId}/insights/`);
  }
}

// Patient Data Processing Utilities
export class PatientDataProcessor {
  constructor(config = patientDashboardConfig) {
    this.config = config;
  }

  // Calculate patient age from date of birth
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Format patient display name
  formatPatientName(patient) {
    const format = this.config.dataFormatting.displayFormats.patientName;
    return format
      .replace('{lastName}', patient.lastName || '')
      .replace('{firstName}', patient.firstName || '')
      .replace('{middleName}', patient.middleName || '')
      .trim()
      .replace(/\s+/g, ' '); // Remove extra spaces
  }

  // Process vital signs data for charts
  processVitalSignsData(vitalSigns, metric) {
    return vitalSigns
      .filter(vs => vs[metric] !== null && vs[metric] !== undefined)
      .map(vs => ({
        date: new Date(vs.recorded_date),
        value: vs[metric],
        isNormal: this.isVitalSignNormal(vs[metric], metric)
      }))
      .sort((a, b) => a.date - b.date);
  }

  // Check if vital sign is within normal range
  isVitalSignNormal(value, metric) {
    const vitalConfig = this.config.widgetConfigurations.vitalSigns.metrics
      .find(m => m.key === metric);
    
    if (!vitalConfig || !vitalConfig.normalRange) return true;

    // This is a simplified implementation
    // In a real application, you'd have more sophisticated range checking
    switch (metric) {
      case 'heartRate':
        return value >= 60 && value <= 100;
      case 'oxygenSaturation':
        return value >= 95;
      case 'temperature':
        return value >= 97 && value <= 100;
      default:
        return true;
    }
  }

  // Generate patient summary
  generatePatientSummary(patient, medicalRecords = [], appointments = []) {
    return {
      basicInfo: {
        name: this.formatPatientName(patient),
        age: this.calculateAge(patient.dateOfBirth),
        gender: patient.gender,
        id: patient.patientId
      },
      
      medicalSummary: {
        totalVisits: medicalRecords.length,
        lastVisit: medicalRecords.length > 0 
          ? new Date(Math.max(...medicalRecords.map(r => new Date(r.date))))
          : null,
        chronicConditions: patient.chronicConditions || [],
        allergies: patient.allergies || []
      },
      
      appointmentSummary: {
        total: appointments.length,
        upcoming: appointments.filter(a => new Date(a.date) > new Date()).length,
        lastAppointment: appointments.length > 0
          ? appointments[appointments.length - 1]
          : null
      }
    };
  }
}

// Create singleton instance
export const patientAPIService = new PatientAPIService();
export const patientDataProcessor = new PatientDataProcessor();

export default PatientAPIService;