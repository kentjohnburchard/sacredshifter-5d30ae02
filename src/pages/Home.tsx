
import React from "react";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
  // Redirect to the SacredShifterHome component
  return <Navigate to="/home" replace />;
};

export default Home;
