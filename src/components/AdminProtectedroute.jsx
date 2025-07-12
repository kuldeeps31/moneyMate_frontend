import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const apiBaseUrl = import.meta.env.VITE_API_URL;

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Agar token nahi mila, redirect kar login page pe
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar token hai, toh outlet render karo jo child routes ko dikhayega
  return <Outlet />;
};

export default ProtectedRoute;
