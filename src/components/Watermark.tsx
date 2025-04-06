
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const Watermark: React.FC = () => {
  const { kentMode, setKentMode } = useTheme();

  // Apply styling based on kent mode
  const watermarkStyle = kentMode ? "text-pink-500" : "text-indigo-500";
  
  // Function to toggle kent mode with toast notification
  const toggleKentMode = () => {
    const newMode = !kentMode;
    setKentMode(newMode);
    
    // Show a small toast to indicate the mode change
    toast.success(newMode ? "Kent Mode activated!" : "Standard Mode activated", {
      icon: <Sparkles className={newMode ? "text-pink-500" : "text-indigo-500"} />,
      duration: 2000,
      position: "top-right"
    });
  };

  return (
    <div 
      className="fixed top-4 left-6 z-10 select-none opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
      onClick={toggleKentMode}
      title={kentMode ? "Switch to Standard Mode" : "Switch to Kent Mode"}
    >
      <div className={`text-sm font-light ${watermarkStyle}`}>
        Sacred Shifter
      </div>
    </div>
  );
};

export default Watermark;
