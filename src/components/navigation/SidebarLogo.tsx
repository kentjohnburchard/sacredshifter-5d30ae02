
import React from "react";
import { Link } from "react-router-dom";

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png"
          alt="Sacred Shifter Logo"
          className="h-8 w-auto"
        />
        <span className="text-xl font-bold text-purple-800">Sacred Shifter</span>
      </Link>
    </div>
  );
};

export default SidebarLogo;
