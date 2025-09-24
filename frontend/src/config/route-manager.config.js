// Route Configuration Manager
// Centralized route management with soft coding capabilities

import routesConfig from './routes.config.js';
import { authRouteUtils } from './auth-routes.config.js';

class RouteConfigManager {
  constructor() {
    this.config = routesConfig;
    this.authUtils = authRouteUtils;
  }

  // Get route by key path (e.g., 'dashboard.home' or 'auth.signIn')
  getRoute(keyPath) {
    const keys = keyPath.split('.');
    let route = this.config;
    
    for (const key of keys) {
      if (route && typeof route === 'object' && route[key] !== undefined) {
        route = route[key];
      } else {
        console.warn(`Route not found for key path: ${keyPath}`);
        return null;
      }
    }
    
    return typeof route === 'string' ? route : null;
  }

  // Get all routes for a specific section
  getRouteSection(section) {
    return this.config[section] || {};
  }

  // Check if a route exists
  routeExists(path) {
    const checkInSection = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key] === path) {
          return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null && key !== 'aliases') {
          if (checkInSection(obj[key])) return true;
        }
      }
      return false;
    };

    return checkInSection(this.config) || this.config.auth.aliases[path];
  }

  // Get route with fallback
  getRouteWithFallback(keyPath, fallback = '/') {
    return this.getRoute(keyPath) || fallback;
  }

  // Build navigation items from config
  buildNavigationItems(enabledOnly = true) {
    const items = [];
    
    // Dashboard routes
    if (this.config.dashboard) {
      items.push({
        section: 'dashboard',
        title: 'Dashboard',
        items: Object.entries(this.config.dashboard).map(([key, path]) => ({
          key,
          path,
          title: this.formatTitle(key)
        }))
      });
    }

    // Add other sections as needed
    return items;
  }

  // Format key to readable title
  formatTitle(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Get breadcrumb path for navigation
  getBreadcrumbs(currentPath) {
    const breadcrumbs = [];
    
    // Find the route in config
    const findRoute = (obj, path = [], currentPath) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value === currentPath) {
          return [...path, key];
        }
        if (typeof value === 'object' && value !== null && key !== 'aliases') {
          const result = findRoute(value, [...path, key], currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    const routePath = findRoute(this.config, [], currentPath);
    if (routePath) {
      breadcrumbs.push({ title: 'Home', path: '/dashboard' });
      
      let currentConfigPath = this.config;
      let currentUrlPath = '';
      
      for (let i = 0; i < routePath.length; i++) {
        const key = routePath[i];
        currentConfigPath = currentConfigPath[key];
        
        if (typeof currentConfigPath === 'string') {
          breadcrumbs.push({
            title: this.formatTitle(key),
            path: currentConfigPath,
            isActive: i === routePath.length - 1
          });
        } else {
          breadcrumbs.push({
            title: this.formatTitle(key),
            path: null, // Section header, no direct path
            isSection: true
          });
        }
      }
    }

    return breadcrumbs;
  }

  // Generate route metadata for SEO and navigation
  getRouteMetadata(path) {
    const findMetadata = (obj, targetPath, section = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value === targetPath) {
          return {
            section: section || 'general',
            key,
            title: this.formatTitle(key),
            path: value
          };
        }
        if (typeof value === 'object' && value !== null && key !== 'aliases') {
          const result = findMetadata(value, targetPath, key);
          if (result) return result;
        }
      }
      return null;
    };

    return findMetadata(this.config, path);
  }

  // Validate route configuration
  validateConfig() {
    const errors = [];
    const warnings = [];

    // Check for duplicate routes
    const routes = new Set();
    const checkDuplicates = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          if (routes.has(value)) {
            errors.push(`Duplicate route found: ${value}`);
          } else {
            routes.add(value);
          }
        } else if (typeof value === 'object' && value !== null && key !== 'aliases') {
          checkDuplicates(value);
        }
      }
    };

    checkDuplicates(this.config);

    // Check for missing required auth routes
    const requiredAuthRoutes = ['signIn', 'signUp'];
    for (const route of requiredAuthRoutes) {
      if (!this.config.auth[route]) {
        errors.push(`Missing required auth route: ${route}`);
      }
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }

  // Get route suggestions for 404 pages
  getRouteSuggestions(invalidPath) {
    const allRoutes = [];
    
    const collectRoutes = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          allRoutes.push(value);
        } else if (typeof value === 'object' && value !== null && key !== 'aliases') {
          collectRoutes(value);
        }
      }
    };

    collectRoutes(this.config);

    // Simple string similarity matching
    const suggestions = allRoutes
      .map(route => ({
        route,
        similarity: this.calculateSimilarity(invalidPath, route)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(item => item.route);

    return suggestions;
  }

  // Calculate string similarity for suggestions
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Levenshtein distance calculation
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

// Create singleton instance
const routeManager = new RouteConfigManager();

// Export helper functions
export const getRoute = (keyPath) => routeManager.getRoute(keyPath);
export const routeExists = (path) => routeManager.routeExists(path);
export const getRouteWithFallback = (keyPath, fallback) => routeManager.getRouteWithFallback(keyPath, fallback);
export const getBreadcrumbs = (currentPath) => routeManager.getBreadcrumbs(currentPath);
export const getRouteMetadata = (path) => routeManager.getRouteMetadata(path);
export const validateRouteConfig = () => routeManager.validateConfig();
export const getRouteSuggestions = (invalidPath) => routeManager.getRouteSuggestions(invalidPath);

export default routeManager;