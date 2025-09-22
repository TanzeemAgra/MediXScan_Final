import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import routesConfig, { getRoute } from '../config/routes.config';

// Route Handler Component for managing aliases and redirects
const RouteHandler = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if current path is an alias
  const actualRoute = getRoute(currentPath);
  
  // If the current path is an alias, redirect to actual route
  if (actualRoute !== currentPath) {
    return <Navigate to={actualRoute} replace />;
  }
  
  return children;
};

// Higher Order Component for route protection and alias handling
export const withRouteHandler = (Component) => {
  return (props) => (
    <RouteHandler>
      <Component {...props} />
    </RouteHandler>
  );
};

// Route Redirect Component for common aliases
export const RouteRedirect = ({ from, to }) => {
  const location = useLocation();
  
  if (location.pathname === from) {
    return <Navigate to={to} replace />;
  }
  
  return null;
};

// Auth Route Handler specifically for authentication routes
export const AuthRouteHandler = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Handle authentication route aliases
  const authAliases = routesConfig.auth.aliases;
  
  if (authAliases[currentPath]) {
    return <Navigate to={authAliases[currentPath]} replace />;
  }
  
  return null;
};

export default RouteHandler;