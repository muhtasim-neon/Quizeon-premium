
import React from 'react';
import { Navigate } from 'react-router-dom';

// Login system disabled/removed
export const Login: React.FC<any> = () => {
  return <Navigate to="/dashboard" replace />;
};
