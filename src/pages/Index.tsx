
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Navigate to the landing page directly
  return <Navigate to="/landing" replace />;
};

export default Index;
