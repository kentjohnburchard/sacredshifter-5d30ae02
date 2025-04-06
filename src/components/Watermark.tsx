
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

    if (watermarkStyle === "sacred_geometry") {
      return (
        <div className="opacity-[0.03]">
          <svg viewBox="0 0 100 100" width="150" height="150">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      );
    }

    if (watermarkStyle === "planets") {
      return (
        <div className="opacity-[0.03]">
          <div className="relative">
            <div className="rounded-full w-40 h-40 border-2 border-current"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full w-16 h-16 border border-current"></div>
            </div>
          </div>
        </div>
      );
    }

    if (watermarkStyle === "crystals") {
      return (
        <div className="opacity-[0.03]">
          <div className="rotate-45 w-40 h-40 border-2 border-current"></div>
        </div>
      );
    }
    
    if (watermarkStyle === "chakras") {
      return (
        <div className="opacity-[0.03]">
          <div className="w-40 h-40 rounded-full border-2 border-current flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-current flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-current"></div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <img 
        src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[25%] max-h-[25%] object-contain opacity-[0.03]" 
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
