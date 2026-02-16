import React from "react";
import { Navigate } from "react-router-dom";
// import { decodeToken } from "../utils/decodeToken";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};
