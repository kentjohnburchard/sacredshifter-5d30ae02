
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { Sparkles, Star, Brain, Activity, Heart, Pentagon } from "lucide-react";

const Watermark: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil, currentElement, currentWatermarkStyle } = useTheme();

  // Apply styling based on lift the veil mode and current element
  const getWatermarkColor = () => {
    if (liftTheVeil) return "text-pink-500";
    
    switch(currentElement) {
      case "fire": return "text-red-500";
      case "water": return "text-blue-500";
      case "earth": return "text-green-500";
      case "air": return "text-indigo-500";
      default: return "text-indigo-500";
    }
  };
  
  // Get watermark icon based on style
  const getWatermarkIcon = () => {
    switch(currentWatermarkStyle) {
      case "zodiac": return <Star className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
      case "sacred_geometry": return <Pentagon className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
      case "chakras": return <Heart className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
      case "crystals": return <Activity className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
      case "planets": return <Brain className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
      default: return <Sparkles className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
    }
  };
  
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
      <div className={`text-sm font-light flex items-center ${getWatermarkColor()}`}>
        {getWatermarkIcon()}
      </div>
    </div>
  );
};

export default Watermark;
