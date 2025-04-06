
import React from "react";

const GlobalWatermark: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-end">
      <img 
        src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[70%] max-h-[35%] object-contain opacity-[0.04]" 
      />
    </div>
  );
};

export default GlobalWatermark;
