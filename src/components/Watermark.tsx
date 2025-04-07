
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const Watermark: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();

  // Apply styling based on lift the veil mode
  const watermarkStyle = liftTheVeil ? "text-pink-500" : "text-indigo-500";
  
  // Function to toggle lift the veil mode with toast notification
  const toggleLiftTheVeil = () => {
    const newMode = !liftTheVeil;
    setLiftTheVeil(newMode);
    
    // Show a small toast to indicate the mode change
    toast.success(newMode ? "Veil Lifted!" : "Standard Mode activated", {
      icon: <Sparkles className={newMode ? "text-pink-500" : "text-indigo-500"} />,
      duration: 2000,
      position: "top-right"
    });
  };

  return (
    <div 
      className="fixed top-4 left-6 z-10 select-none opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
      onClick={toggleLiftTheVeil}
      title={liftTheVeil ? "Switch to Standard Mode" : "Lift the Veil"}
    >
      <div className={`text-sm font-light ${watermarkStyle}`}>
        Sacred Shifter
      </div>
    </div>
  );
};

export default Watermark;
