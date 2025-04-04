
import React from "react";

const Watermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-5 flex items-center justify-center">
      <img 
        src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
        alt="Sacred Shifter Watermark" 
        className="max-w-[25%] max-h-[25%] object-contain" 
      />
    </div>
  );
};

export default Watermark;
