// RBAC Middleware Components
// Advanced middleware for role-based access control and route protection

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { useAuth, usePermissions } from '../hooks/useRBAC.jsx';
import rbacConfig from '../config/rbac.config';
import { isDevelopment, isFeatureEnabled } from '../config/environment.config';

// Route Protection Middleware
export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null,
  redirectTo = '/auth/sign-in',
  fallbackComponent = null 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { isAuthorized, role } = usePermissions();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role requirement
  if (requiredRole && role !== requiredRole) {
    return fallbackComponent || <AccessDenied requiredRole={requiredRole} currentRole={role} />;
  }

  // Check permissions
  if (!isAuthorized(requiredPermissions)) {
    return fallbackComponent || <AccessDenied requiredPermissions={requiredPermissions} currentRole={role} />;
  }

  return children;
};

// Access Denied Component
const AccessDenied = ({ requiredPermissions = [], requiredRole = null, currentRole }) => {
  const roleData = rbacConfig.roles[currentRole?.toUpperCase()] || rbacConfig.roles.VIEWER;
  
  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6">
          <div className="text-center">
            <div className="mb-4">
              <i className="ri-lock-line" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
            </div>
            <h2 className="text-danger mb-3">Access Denied</h2>
            <p className="lead mb-4">You don't have permission to access this resource.</p>
            
            <div className="mb-4">
              <Alert variant="info">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <strong>Your Current Role:</strong>
                  <Badge 
                    bg="primary" 
                    style={{ backgroundColor: roleData.color }}
                    className="d-flex align-items-center"
                  >
                    <i className={`${roleData.icon} me-1`}></i>
                    {roleData.name}
                  </Badge>
                </div>
                {requiredRole && (
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <strong>Required Role:</strong>
                    <Badge bg="warning">{requiredRole}</Badge>
                  </div>
                )}
                {requiredPermissions.length > 0 && (
                  <div>
                    <strong>Required Permissions:</strong>
                    <div className="mt-2">
                      {requiredPermissions.map((permission, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Alert>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="primary" 
                onClick={() => window.history.back()}
              >
                <i className="ri-arrow-left-line me-1"></i>
                Go Back
              </Button>
              <Button 
                variant="outline-secondary"
                href="/"
              >
                <i className="ri-home-line me-1"></i>
                Home
              </Button>
            </div>

            <div className="mt-4 text-muted">
              <small>
                If you believe this is an error, please contact your system administrator.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conditional Renderer based on permissions
export const PermissionGate = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null,
  fallback = null,
  showFallback = false,
  operator = 'AND' // 'AND' or 'OR'
}) => {
  const { isAuthorized, role } = usePermissions();

  // Check role requirement
  if (requiredRole && role !== requiredRole) {
    return showFallback ? fallback : null;
  }

  // Check permissions based on operator
  let hasAccess = false;
  
  if (requiredPermissions.length === 0) {
    hasAccess = true;
  } else if (operator === 'OR') {
    // User needs at least one of the required permissions
    hasAccess = requiredPermissions.some(permission => isAuthorized([permission]));
  } else {
    // User needs all required permissions (AND)
    hasAccess = isAuthorized(requiredPermissions);
  }

  if (!hasAccess) {
    return showFallback ? fallback : null;
  }

  return children;
};

// Role Badge Component
export const RoleBadge = ({ role, showIcon = true, showDescription = false }) => {
  const roleData = rbacConfig.roles[role?.toUpperCase()] || rbacConfig.roles.VIEWER;
  
  return (
    <div className="d-flex align-items-center">
      <Badge 
        bg="primary" 
        style={{ backgroundColor: roleData.color }}
        className="d-flex align-items-center"
      >
        {showIcon && <i className={`${roleData.icon} me-1`}></i>}
        {roleData.name}
      </Badge>
      {showDescription && (
        <small className="text-muted ms-2">{roleData.description}</small>
      )}
    </div>
  );
};

// Permission Checker Component (for debugging)
export const PermissionDebugger = () => {
  const { role, permissions } = useAuth();
  const { isAuthorized, getFeatureFlags } = usePermissions();
  const featureFlags = getFeatureFlags();

  if (!isDevelopment) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '400px',
        overflow: 'auto'
      }}
    >
      <div className="mb-2">
        <strong>Role:</strong> {role}
      </div>
      <div className="mb-2">
        <strong>Permissions:</strong>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          {permissions.map((perm, index) => (
            <div key={index}>• {perm}</div>
          ))}
        </div>
      </div>
      <div className="mb-2">
        <strong>Feature Flags:</strong>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          {Object.entries(featureFlags).map(([flag, enabled]) => (
            <div key={flag}>
              • {flag}: {enabled ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Role Switcher Component (for development/demo)
export const RoleSwitcher = () => {
  const { switchRole, role } = useAuth();
  const availableRoles = Object.keys(rbacConfig.roles).map(key => key.toLowerCase());

  if (!isDevelopment && !isFeatureEnabled('roleSwitcher')) {
    return null;
  }

  return (
    <div className="dropdown">
      <Button
        variant="outline-secondary"
        size="sm"
        className="dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <i className="ri-user-settings-line me-1"></i>
        Switch Role
      </Button>
      <ul className="dropdown-menu">
        {availableRoles.map(roleId => {
          const roleData = rbacConfig.roles[roleId.toUpperCase()];
          return (
            <li key={roleId}>
              <button
                className={`dropdown-item ${role === roleId ? 'active' : ''}`}
                onClick={() => switchRole(roleId)}
              >
                <i className={`${roleData.icon} me-2`}></i>
                {roleData.name}
                {role === roleId && <i className="ri-check-line ms-auto"></i>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Feature Flag Component
export const FeatureFlag = ({ flag, children, fallback = null }) => {
  const { getFeatureFlags } = usePermissions();
  const featureFlags = getFeatureFlags();
  
  if (!featureFlags[flag]) {
    return fallback;
  }
  
  return children;
};

// Audit Logger HOC
export const withAuditLogging = (Component, resource) => {
  return function AuditLoggedComponent(props) {
    const { user } = useAuth();
    
    React.useEffect(() => {
      // Log component access
      if (user) {
        const auditEntry = {
          timestamp: new Date().toISOString(),
          userId: user.id,
          action: 'ACCESS',
          resource: resource || Component.name,
          details: { path: window.location.pathname }
        };
        
        console.log('Audit Log:', auditEntry);
      }
    }, [user]);

    return <Component {...props} />;
  };
};

// Session Timeout Handler
export const SessionTimeoutHandler = ({ children }) => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;

    const sessionTimeout = rbacConfig.defaults.sessionTimeout;
    const warningTime = 5 * 60 * 1000; // 5 minutes before timeout
    
    let warningTimer, logoutTimer, countdownTimer;

    const startSession = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);

      // Set warning timer
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(warningTime);

        // Start countdown
        countdownTimer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1000) {
              logout();
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }, sessionTimeout - warningTime);

      // Set logout timer
      logoutTimer = setTimeout(() => {
        logout();
      }, sessionTimeout);
    };

    const resetSession = () => {
      setShowWarning(false);
      startSession();
    };

    // Start initial session
    startSession();

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetSession, { passive: true });
    });

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetSession);
      });
    };
  }, [user, logout]);

  const extendSession = () => {
    setShowWarning(false);
    setTimeLeft(0);
  };

  return (
    <>
      {children}
      {showWarning && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Session Timeout Warning</h5>
              </div>
              <div className="modal-body">
                <p>Your session will expire in:</p>
                <div className="text-center">
                  <h3 className="text-danger">
                    {Math.floor(timeLeft / 60000)}:{String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}
                  </h3>
                </div>
                <p>Would you like to extend your session?</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={logout}>
                  Logout Now
                </Button>
                <Button variant="primary" onClick={extendSession}>
                  Extend Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default {
  ProtectedRoute,
  PermissionGate,
  RoleBadge,
  PermissionDebugger,
  RoleSwitcher,
  FeatureFlag,
  withAuditLogging,
  SessionTimeoutHandler
};