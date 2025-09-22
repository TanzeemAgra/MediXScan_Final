// URL Management Utility for React Components
// Provides hooks and utilities for soft-coded URL management

import { useCallback, useMemo } from 'react';
import environmentConfig, { urlHelpers } from '../config/environment.config';
// Port detection temporarily removed

// Custom hook for URL management
export const useURLManager = () => {
  // Get current environment config using soft-coded approach
  const config = environmentConfig.config;
  // Temporarily use direct URL - const { buildURL: buildPortURL, portInfo } = usePortDetection();
  const buildPortURL = null;
  const portInfo = null;
  
  // Memoized URL builders with port detection integration
  const urls = useMemo(() => ({
    // Feature URLs with dynamic port detection
    reportCorrection: (params = {}) => {
      const basePath = '/radiology/report-correction';
      const url = buildPortURL ? buildPortURL(basePath) : `${config.frontendUrl}${basePath}`;
      return params && Object.keys(params).length > 0 ? 
        `${url}?${new URLSearchParams(params).toString()}` : url;
    },
    
    radiologyDashboard: (params = {}) => {
      const basePath = '/radiology/dashboard';
      const url = buildPortURL ? buildPortURL(basePath) : `${config.frontendUrl}${basePath}`;
      return params && Object.keys(params).length > 0 ? 
        `${url}?${new URLSearchParams(params).toString()}` : url;
    },
    
    anonymizer: (params = {}) => {
      const basePath = '/radiology/anonymizer';
      const url = buildPortURL ? buildPortURL(basePath) : `${config.frontendUrl}${basePath}`;
      return params && Object.keys(params).length > 0 ? 
        `${url}?${new URLSearchParams(params).toString()}` : url;
    },
    
    // Generic builder with port detection
    build: (path, params = {}) => {
      const url = buildPortURL ? buildPortURL(path) : `${config.frontendUrl}${path}`;
      return params && Object.keys(params).length > 0 ? 
        `${url}?${new URLSearchParams(params).toString()}` : url;
    }
  }), [config, buildPortURL]);
  
  // Helper functions
  const buildShareableLink = useCallback((route, params = {}) => {
    return environmentConfig.urlHelpers.buildShareableUrl(route, params);
  }, []);
  
  const getCurrentBaseURL = useCallback(() => {
    return config.frontendUrl;
  }, [config]);
  
  const isCurrentEnvironment = useCallback((envName) => {
    return environmentConfig.env.NODE_ENV === envName;
  }, []);
  
  // Copy URL to clipboard
  const copyURLToClipboard = useCallback(async (url) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          return true;
        } catch (err) {
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      return false;
    }
  }, []);
  
  // Share URL via Web Share API if available
  const shareURL = useCallback(async (url, title = 'MediXScan', text = '') => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url
        });
        return true;
      } else {
        // Fallback to clipboard
        return await copyURLToClipboard(url);
      }
    } catch (err) {
      console.error('Failed to share URL:', err);
      return false;
    }
  }, [copyURLToClipboard]);
  
  return {
    urls,
    config,
    buildShareableLink,
    getCurrentBaseURL,
    isCurrentEnvironment,
    copyURLToClipboard,
    shareURL,
    // Include port detection information
    portInfo,
    connectionStatus: portInfo?.connectionStatus || 'unknown',
    environment: {
      name: config.name || environmentConfig.env.NODE_ENV,
      isDevelopment: environmentConfig.isDevelopment,
      isProduction: environmentConfig.isProduction,
      features: config,
      portDetection: config.portDetection
    }
  };
};

// URL Manager factory function (soft-coded approach without JSX)
export const createURLManager = (config = {}) => {
  const defaultConfig = {
    environment: 'development',
    baseURL: 'http://localhost:5173',
    apiURL: 'http://localhost:8000/api'
  };
  
  const mergedConfig = { ...defaultConfig, ...config };
  
  return {
    getURL: (path = '', params = {}) => {
      const queryString = Object.keys(params).length > 0 
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return `${mergedConfig.baseURL}${path}${queryString}`;
    },
    getAPIURL: (endpoint = '') => {
      return `${mergedConfig.apiURL}${endpoint}`;
    },
    config: mergedConfig
  };
};

// URL validation utility
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Build query parameters from object
export const buildQueryParams = (params = {}) => {
  const validParams = Object.entries(params).filter(([_, value]) => 
    value !== null && value !== undefined && value !== ''
  );
  
  if (validParams.length === 0) return '';
  
  const searchParams = new URLSearchParams();
  validParams.forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  
  return `?${searchParams.toString()}`;
};

// Parse query parameters from URL
export const parseQueryParams = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// URL state management for React Router
export const useURLState = (paramName, defaultValue = '') => {
  const [searchParams, setSearchParams] = window.location.search ? 
    [new URLSearchParams(window.location.search), () => {}] : 
    [new URLSearchParams(), () => {}];
  
  const value = searchParams.get(paramName) || defaultValue;
  
  const setValue = useCallback((newValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (newValue === null || newValue === undefined || newValue === '') {
      newSearchParams.delete(paramName);
    } else {
      newSearchParams.set(paramName, String(newValue));
    }
    
    // Update URL without page reload
    const newURL = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  }, [paramName, searchParams]);
  
  return [value, setValue];
};

// Export all utilities
export default {
  useURLManager,
  createURLManager,
  validateURL,
  buildQueryParams,
  parseQueryParams,
  useURLState
};