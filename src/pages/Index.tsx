
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Always navigate to the home page
  return <Navigate to="/home" replace />;
};

export default Index;
