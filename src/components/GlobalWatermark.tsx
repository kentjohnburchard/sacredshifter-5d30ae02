
import React from "react";

const GlobalWatermark: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-end">
      <img 
        src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[70%] max-h-[35%] object-contain opacity-[0.15]" 
      />
    </div>
  );
};

export default GlobalWatermark;
