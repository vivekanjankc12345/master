import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((s) => s.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // DO NOT wrap layout here
};

export default ProtectedRoute;
