
import React from "react";

const GlobalWatermark: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-end">
      <img 
        src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[70%] max-h-[35%] object-contain opacity-[0.25]" 
      />
    </div>
  );
};

export default GlobalWatermark;
