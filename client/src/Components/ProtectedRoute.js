import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// ProtectedRoute component to check user role before rendering the route
const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const userRole = localStorage.getItem("roleCompany"); // Retrieve the user's role from localStorage

  console.log(userRole);
  // If no role is found in localStorage (user is not logged in), redirect to login
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  // If the user's role is not allowed, redirect to the default page (e.g., dashboard)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
