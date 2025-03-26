
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CallToActionProps {
  isVisible: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({ isVisible }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 1, delay: 1 }}
    >
      <Button 
        onClick={() => navigate("/energy-check")}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
        size="lg"
      >
        Begin Vibe Check-In
      </Button>
    </motion.div>
  );
};

export default CallToAction;
