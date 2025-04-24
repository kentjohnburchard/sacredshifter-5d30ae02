
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <img 
          src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
          alt="Sacred Shifter Logo" 
          className="h-[32rem] sm:h-[36rem] animate-pulse-subtle transition-all hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-black to-transparent opacity-20 pointer-events-none" />
      </div>
    </div>
  );
};

export default Logo;
