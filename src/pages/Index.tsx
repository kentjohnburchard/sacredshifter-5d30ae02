
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Simply redirect to landing page
  return <Navigate to="/" replace />;
};

export default Index;
