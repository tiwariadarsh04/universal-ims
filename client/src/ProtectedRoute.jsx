// ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles }) => {
  const userProfileString = localStorage.getItem('user');

  // Check if userProfile exists and is a valid JSON string
  let userProfile;
  try {
    userProfile = userProfileString ? JSON.parse(userProfileString) : null;
  } catch (error) {
    console.error('Error parsing userProfile:', error);
    localStorage.removeItem('user'); // Remove invalid data
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user is authenticated
  if (!userProfile) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user has the required role
  if (roles && !roles.includes(userProfile.roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;