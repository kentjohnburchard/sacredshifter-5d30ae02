
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { zodiacSigns } from "@/utils/customizationOptions";

const Watermark: React.FC = () => {
  const { watermarkStyle, zodiacSign } = useTheme();
  
  const getWatermarkContent = () => {
    if (watermarkStyle === "none") {
      return null;
    }
    
    if (watermarkStyle === "zodiac") {
      const sign = zodiacSigns.find(z => z.id === zodiacSign);
      return (
        <div className="text-[150px] opacity-[0.03]">
          {sign?.symbol || "♋"}
        </div>
      );
    }
    
    return (
      <img 
        src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[25%] max-h-[25%] object-contain" 
      />
    );
  };

  if (watermarkStyle === "none") {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-5 flex items-center justify-center">
      {getWatermarkContent()}
    </div>
  );
};

export default Watermark;
