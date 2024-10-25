import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext); // Get user authentication status from context

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }
  // Render the component if authenticated
  return children;
};

export default ProtectedRoute;
