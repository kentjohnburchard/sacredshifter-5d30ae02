
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Home: React.FC = () => {
  // This component now just redirects to the SacredShifterHome component
  return <Navigate to="/" replace />;
};

export default Home;
