
import React from "react";
import { Link } from "react-router-dom";

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center w-full px-4 ${className}`}>
      <Link to="/" className="flex items-center w-full">
        <img
          src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png"
          alt="Sacred Shifter Logo"
          className="h-16 w-full object-contain"
        />
      </Link>
    </div>
  );
};

export default SidebarLogo;
