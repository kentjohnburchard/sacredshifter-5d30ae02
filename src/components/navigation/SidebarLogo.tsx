
import React from "react";
import { Link } from "react-router-dom";

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center px-4 py-3 ${className}`}>
      <Link to="/" className="flex justify-center items-center">
        <img
          src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png"
          alt="Sacred Shifter Logo"
          className="h-24 w-24 object-contain animate-pulse-subtle transition-all hover:scale-105"
        />
      </Link>
    </div>
  );
};

export default SidebarLogo;
