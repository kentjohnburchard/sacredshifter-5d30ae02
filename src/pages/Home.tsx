
import React from "react";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
  // Redirect to the SacredShifterHome component but avoid infinite loop
  return <Navigate to="/dashboard" replace />;
};

export default Home;
