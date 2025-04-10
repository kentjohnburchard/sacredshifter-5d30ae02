
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Journeys = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to journey templates page
    navigate("/journey-templates");
  }, [navigate]);
  
  return null; // This component doesn't render anything as it redirects immediately
};

export default Journeys;
