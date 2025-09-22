// RBAC Hooks and Middleware
// React hooks for role-based access control and authentication

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import rbacConfig, { hasPermission, canAccessModule, getFeatureFlagsForRole, isAuthorized } from '../config/rbac.config';

// RBAC Context
const RBACContext = createContext();

// RBAC Provider Component
export const RBACProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('viewer');
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user from localStorage or API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('medixscan_user');
        const storedToken = localStorage.getItem('medixscan_auth_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setRole(userData.role || 'viewer');
          setPermissions(rbacConfig.rolePermissions[userData.role] || rbacConfig.rolePermissions.viewer);
        } else {
          // Set default guest user
          setRole('viewer');
          setPermissions(rbacConfig.rolePermissions.viewer);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error);
        // Fallback to viewer role
        setRole('viewer');
        setPermissions(rbacConfig.rolePermissions.viewer);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Mock login - replace with actual API call
      const mockUser = {
        id: 1,
        username: credentials.username,
        email: credentials.email || `${credentials.username}@medixscan.com`,
        role: credentials.role || 'radiologist',
        firstName: 'John',
        lastName: 'Doe',
        avatar: '/assets/images/user/01.jpg',
        department: 'Radiology',
        lastLogin: new Date().toISOString()
      };

      // Store user data
      localStorage.setItem('medixscan_user', JSON.stringify(mockUser));
      localStorage.setItem('medixscan_auth_token', 'mock-jwt-token');
      
      setUser(mockUser);
      setRole(mockUser.role);
      setPermissions(rbacConfig.rolePermissions[mockUser.role] || rbacConfig.rolePermissions.viewer);
      
      return { success: true, user: mockUser };
    } catch (error) {
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('medixscan_user');
    localStorage.removeItem('medixscan_auth_token');
    setUser(null);
    setRole('viewer');
    setPermissions(rbacConfig.rolePermissions.viewer);
  };

  // Switch role (for demo purposes)
  const switchRole = (newRole) => {
    if (rbacConfig.roles[newRole.toUpperCase()]) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setRole(newRole);
      setPermissions(rbacConfig.rolePermissions[newRole] || rbacConfig.rolePermissions.viewer);
      
      if (updatedUser) {
        localStorage.setItem('medixscan_user', JSON.stringify(updatedUser));
      }
    }
  };

  const contextValue = {
    user,
    role,
    permissions,
    loading,
    error,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

// Hook to use RBAC context
export const useAuth = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useAuth must be used within RBACProvider');
  }
  return context;
};

// Hook for permission checking
export const usePermissions = () => {
  const { role } = useAuth();
  
  return useMemo(() => ({
    hasPermission: (permission) => hasPermission(role, permission),
    canAccessModule: (module) => canAccessModule(role, module),
    isAuthorized: (requiredPermissions) => isAuthorized(role, requiredPermissions),
    getFeatureFlags: () => getFeatureFlagsForRole(role),
    role
  }), [role]);
};

// Hook for role-based configuration
export const useRoleConfig = () => {
  const { role } = useAuth();
  
  return useMemo(() => {
    const roleData = rbacConfig.roles[role?.toUpperCase()] || rbacConfig.roles.VIEWER;
    const dashboardModules = rbacConfig.dashboardModules[role] || rbacConfig.dashboardModules.viewer;
    const navigationConfig = rbacConfig.navigationConfig[role] || rbacConfig.navigationConfig.viewer;
    const featureFlags = rbacConfig.featureFlags[role] || rbacConfig.featureFlags.viewer;

    return {
      roleData,
      dashboardModules,
      navigationConfig,
      featureFlags,
      role
    };
  }, [role]);
};

// Higher Order Component for protected routes
export const withRBACProtection = (Component, requiredPermissions = []) => {
  return function ProtectedComponent(props) {
    const { isAuthorized } = usePermissions();
    const { role } = useAuth();

    if (!isAuthorized(requiredPermissions)) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h4 className="text-danger">Access Denied</h4>
            <p>You don't have permission to access this resource.</p>
            <p className="text-muted">Required permissions: {requiredPermissions.join(', ')}</p>
            <p className="text-muted">Your role: {role}</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// Component for conditional rendering based on permissions
export const ProtectedComponent = ({ 
  children, 
  requiredPermissions = [], 
  fallback = null,
  role: requiredRole = null 
}) => {
  const { isAuthorized } = usePermissions();
  const { role } = useAuth();

  // Check role if specified
  if (requiredRole && role !== requiredRole) {
    return fallback;
  }

  // Check permissions
  if (!isAuthorized(requiredPermissions)) {
    return fallback;
  }

  return children;
};

// Hook for role-based dashboard widgets
export const useDashboardWidgets = () => {
  const { role } = useAuth();
  const { dashboardModules } = useRoleConfig();

  return useMemo(() => {
    const enabledModules = Object.entries(dashboardModules)
      .filter(([_, config]) => config.enabled)
      .sort(([_, a], [__, b]) => a.priority - b.priority)
      .map(([module, config]) => ({ module, ...config }));

    return enabledModules;
  }, [dashboardModules]);
};

// Hook for role-based navigation items
export const useNavigationItems = () => {
  const { navigationConfig } = useRoleConfig();

  return useMemo(() => {
    const visibleItems = Object.entries(navigationConfig)
      .filter(([_, config]) => config.visible)
      .sort(([_, a], [__, b]) => a.order - b.order)
      .map(([item, config]) => ({ item, ...config }));

    return visibleItems;
  }, [navigationConfig]);
};

// Custom hook for audit logging
export const useAuditLog = () => {
  const { user, role } = useAuth();
  const { hasPermission } = usePermissions();

  const logAction = (action, resource, details = {}) => {
    if (!hasPermission(rbacConfig.permissions.AUDIT_LOG)) {
      return;
    }

    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      username: user?.username,
      role,
      action,
      resource,
      details,
      sessionId: localStorage.getItem('medixscan_auth_token')
    };

    // In a real app, this would be sent to the backend
    console.log('Audit Log:', auditEntry);
    
    // Store locally for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem('medixscan_audit_logs') || '[]');
    existingLogs.push(auditEntry);
    
    // Keep only last 100 entries
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('medixscan_audit_logs', JSON.stringify(existingLogs));
  };

  return { logAction };
};

export default RBACContext;