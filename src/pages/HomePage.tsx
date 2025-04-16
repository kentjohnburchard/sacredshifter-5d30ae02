
import React from "react";
import { Navigate } from "react-router-dom";

const HomePage: React.FC = () => {
  // Redirect to the journey-templates page for now
  return <Navigate to="/journey-templates" replace />;
};

export default HomePage;
