// Custom React Hooks for Data Fetching - MediXScan
import { useState, useEffect, useCallback, useRef } from 'react';
import apiConfig from '../config/api.config';
import {
  dashboardService,
  patientService,
  doctorService,
  appointmentService,
  medicalRecordService,
  notificationService
} from '../services/api.service';

// Generic hook for API data fetching with soft coding configuration
export const useApi = (serviceFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchCount, setRefetchCount] = useState(0);
  const mountedRef = useRef(true);

  // Configuration with soft coding defaults
  const config = {
    enabled: options.enabled !== false,
    refetchInterval: options.refetchInterval || (apiConfig.features.realTimeUpdates.enabled ? apiConfig.dataFetching.refetchInterval : null),
    staleTime: options.staleTime || apiConfig.dataFetching.staleTime,
    retryOnError: options.retryOnError !== false,
    cacheKey: options.cacheKey,
    mockData: options.mockData || (apiConfig.features.mockData.enabled ? options.fallbackData : null),
    ...options
  };

  const fetchData = useCallback(async () => {
    if (!config.enabled || !mountedRef.current) return;

    try {
      setError(null);
      if (refetchCount === 0) setLoading(true);

      // Check cache first if enabled
      if (config.cacheKey && apiConfig.features.caching.enabled) {
        const cached = getCachedData(config.cacheKey);
        if (cached && !isStale(cached.timestamp, config.staleTime)) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      const result = await serviceFunction();

      if (mountedRef.current) {
        setData(result);

        // Cache the result if enabled
        if (config.cacheKey && apiConfig.features.caching.enabled) {
          setCachedData(config.cacheKey, result);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);

        // Handle 401 errors by stopping auto-refetch to prevent infinite loops
        if (err.status === 401 || err.type === 'unauthorized') {
          console.warn('Authentication error - stopping auto-refetch to prevent infinite loop');
          return;
        }

        // Use mock data as fallback if enabled
        if (config.mockData && apiConfig.features.mockData.fallbackOnError) {
          setData(config.mockData);
        }

        // Log error if enabled
        if (apiConfig.features.errorReporting.enabled) {
          console.error('useApi Error:', err);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [serviceFunction, refetchCount, config.enabled]);

  // Refetch function
  const refetch = useCallback(() => {
    setRefetchCount(count => count + 1);
  }, []);

  // Effect for initial fetch and dependencies
  useEffect(() => {
    if (config.enabled) {
      fetchData();
    }
  }, [JSON.stringify(dependencies), refetchCount, config.enabled]);

  // Effect for auto-refetch interval
  useEffect(() => {
    if (!config.refetchInterval || !config.enabled) return;

    // Don't auto-refresh if there's an authentication error
    if (error && (error.status === 401 || error.type === 'unauthorized')) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchData();
    }, config.refetchInterval);

    return () => clearInterval(intervalId);
  }, [fetchData, config.refetchInterval, config.enabled, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale: data ? isStale(Date.now(), config.staleTime) : false
  };
};

// Dashboard hooks
export const useDashboardOverview = (options = {}) => {
  return useApi(
    dashboardService.getOverview,
    [],
    {
      cacheKey: 'dashboard-overview',
      refetchInterval: apiConfig.features.realTimeUpdates.dashboardRefresh,
      fallbackData: {
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        completedAppointments: 0
      },
      ...options
    }
  );
};

export const useDashboardStats = (options = {}) => {
  const patientStats = useApi(
    dashboardService.getPatientStats,
    [],
    { cacheKey: 'dashboard-patient-stats', ...options }
  );
  
  const appointmentStats = useApi(
    dashboardService.getAppointmentStats,
    [],
    { cacheKey: 'dashboard-appointment-stats', ...options }
  );
  
  const doctorStats = useApi(
    dashboardService.getDoctorStats,
    [],
    { cacheKey: 'dashboard-doctor-stats', ...options }
  );

  return {
    patients: patientStats,
    appointments: appointmentStats,
    doctors: doctorStats,
    loading: patientStats.loading || appointmentStats.loading || doctorStats.loading,
    error: patientStats.error || appointmentStats.error || doctorStats.error
  };
};

export const useDashboardChartData = (chartType, options = {}) => {
  return useApi(
    () => dashboardService.getChartData(chartType),
    [chartType],
    {
      cacheKey: `dashboard-chart-${chartType}`,
      refetchInterval: apiConfig.features.realTimeUpdates.dashboardRefresh,
      fallbackData: {
        labels: [],
        datasets: []
      },
      ...options
    }
  );
};

// Patient hooks
export const usePatients = (queryParams = {}, options = {}) => {
  return useApi(
    () => patientService.getAll(queryParams),
    [queryParams],
    {
      cacheKey: `patients-${JSON.stringify(queryParams)}`,
      fallbackData: {
        results: [],
        count: 0
      },
      ...options
    }
  );
};

export const usePatient = (patientId, options = {}) => {
  return useApi(
    () => patientService.getById(patientId),
    [patientId],
    {
      enabled: !!patientId,
      cacheKey: `patient-${patientId}`,
      ...options
    }
  );
};

export const usePatientStatistics = (options = {}) => {
  return useApi(
    patientService.getStatistics,
    [],
    {
      cacheKey: 'patient-statistics',
      fallbackData: {
        total: 0,
        newThisMonth: 0,
        averageAge: 0,
        genderDistribution: {}
      },
      ...options
    }
  );
};

// Doctor hooks
export const useDoctors = (queryParams = {}, options = {}) => {
  return useApi(
    () => doctorService.getAll(queryParams),
    [queryParams],
    {
      cacheKey: `doctors-${JSON.stringify(queryParams)}`,
      fallbackData: {
        results: [],
        count: 0
      },
      ...options
    }
  );
};

export const useDoctor = (doctorId, options = {}) => {
  return useApi(
    () => doctorService.getById(doctorId),
    [doctorId],
    {
      enabled: !!doctorId,
      cacheKey: `doctor-${doctorId}`,
      ...options
    }
  );
};

export const useDoctorStatistics = (options = {}) => {
  return useApi(
    doctorService.getStatistics,
    [],
    {
      cacheKey: 'doctor-statistics',
      fallbackData: {
        total: 0,
        specializations: {},
        averageExperience: 0
      },
      ...options
    }
  );
};

// Appointment hooks
export const useAppointments = (queryParams = {}, options = {}) => {
  return useApi(
    () => appointmentService.getAll(queryParams),
    [queryParams],
    {
      cacheKey: `appointments-${JSON.stringify(queryParams)}`,
      refetchInterval: apiConfig.features.realTimeUpdates.appointmentUpdates,
      fallbackData: {
        results: [],
        count: 0
      },
      ...options
    }
  );
};

export const useTodayAppointments = (options = {}) => {
  return useApi(
    appointmentService.getToday,
    [],
    {
      cacheKey: 'today-appointments',
      refetchInterval: apiConfig.features.realTimeUpdates.appointmentUpdates,
      fallbackData: [],
      ...options
    }
  );
};

export const useUpcomingAppointments = (options = {}) => {
  return useApi(
    appointmentService.getUpcoming,
    [],
    {
      cacheKey: 'upcoming-appointments',
      refetchInterval: apiConfig.features.realTimeUpdates.appointmentUpdates,
      fallbackData: [],
      ...options
    }
  );
};

export const useAppointmentStatistics = (options = {}) => {
  return useApi(
    appointmentService.getStatistics,
    [],
    {
      cacheKey: 'appointment-statistics',
      refetchInterval: apiConfig.features.realTimeUpdates.appointmentUpdates,
      fallbackData: {
        total: 0,
        today: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
      },
      ...options
    }
  );
};

// Medical Records hooks
export const useMedicalRecords = (queryParams = {}, options = {}) => {
  return useApi(
    () => medicalRecordService.getAll(queryParams),
    [queryParams],
    {
      cacheKey: `medical-records-${JSON.stringify(queryParams)}`,
      fallbackData: {
        results: [],
        count: 0
      },
      ...options
    }
  );
};

export const useRadiologyRecords = (queryParams = {}, options = {}) => {
  return useApi(
    () => medicalRecordService.getRadiology(queryParams),
    [queryParams],
    {
      cacheKey: `radiology-records-${JSON.stringify(queryParams)}`,
      fallbackData: {
        xrayReports: [],
        ctScans: [],
        mriResults: [],
        ultrasounds: []
      },
      ...options
    }
  );
};

export const usePatientMedicalRecords = (patientId, options = {}) => {
  return useApi(
    () => medicalRecordService.getByPatient(patientId),
    [patientId],
    {
      enabled: !!patientId,
      cacheKey: `patient-medical-records-${patientId}`,
      fallbackData: [],
      ...options
    }
  );
};

// Notification hooks
export const useNotifications = (options = {}) => {
  return useApi(
    notificationService.getAll,
    [],
    {
      cacheKey: 'notifications',
      refetchInterval: apiConfig.features.realTimeUpdates.notificationPolling,
      fallbackData: [],
      ...options
    }
  );
};

export const useUnreadNotifications = (options = {}) => {
  return useApi(
    notificationService.getUnread,
    [],
    {
      cacheKey: 'unread-notifications',
      refetchInterval: apiConfig.features.realTimeUpdates.notificationPolling,
      fallbackData: [],
      ...options
    }
  );
};

// Utility functions for caching
const getCachedData = (key) => {
  if (!apiConfig.features.caching.localStorage) return null;
  
  try {
    const cached = localStorage.getItem(`medixscan_cache_${key}`);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setCachedData = (key, data) => {
  if (!apiConfig.features.caching.localStorage) return;
  
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`medixscan_cache_${key}`, JSON.stringify(cacheEntry));
  } catch {
    // Handle localStorage errors gracefully
  }
};

const isStale = (timestamp, staleTime) => {
  return Date.now() - timestamp > staleTime;
};

// Hook for mutations (create, update, delete)
export const useMutation = (mutationFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (variables) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mutationFunction(variables);
      
      setData(result);
      
      // Call success callback if provided
      if (options.onSuccess) {
        options.onSuccess(result, variables);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      // Call error callback if provided
      if (options.onError) {
        options.onError(err, variables);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction, options]);

  return {
    mutate,
    data,
    loading,
    error,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
};