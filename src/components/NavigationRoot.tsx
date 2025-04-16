
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationRoot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // This is a placeholder component that can be used for global navigation logic
  // without adding another Router
  
  return null;
};

export default NavigationRoot;
