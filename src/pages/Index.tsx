
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Navigate to the dashboard directly, not the home page
  return <Navigate to="/dashboard" replace />;
};

export default Index;
