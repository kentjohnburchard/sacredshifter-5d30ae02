
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Always navigate to the welcome page
  return <Navigate to="/welcome" replace />;
};

export default Index;
