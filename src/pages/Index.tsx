
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Navigate to the home page, not directly to the dashboard
  return <Navigate to="/home" replace />;
};

export default Index;
