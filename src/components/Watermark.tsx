
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { Sparkles, Star, Brain, Activity, Heart, Pentagon } from "lucide-react";

const Watermark: React.FC = () => {
  const { liftTheVeil, toggleVeil } = useTheme();

  // Apply styling based on lift the veil mode
  const getWatermarkColor = () => {
    if (liftTheVeil) return "text-pink-500";
    return "text-indigo-500";
  };
  
  // Get watermark icon
  const getWatermarkIcon = () => {
    return <Sparkles className={`h-3 w-3 mr-1 ${getWatermarkColor()}`} />;
  };
  
  const handleClick = () => {
    toggleVeil();
  };

  return (
    <div 
      className="fixed top-4 left-6 z-10 select-none opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
      onClick={handleClick}
      title={liftTheVeil ? "Switch to Standard Mode" : "Lift the Veil"}
    >
      <div className={`text-sm font-light flex items-center ${getWatermarkColor()}`}>
        {getWatermarkIcon()}
      </div>
    </div>
  );
};

export default Watermark;
