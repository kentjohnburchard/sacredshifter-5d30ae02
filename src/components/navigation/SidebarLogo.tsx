
import React from "react";
import { Link } from "react-router-dom";

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 ${className}`}>
      <Link to="/" className="flex items-center">
        <img
          src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png"
          alt="Sacred Shifter Logo"
          className="h-10 animate-pulse-subtle transition-all hover:scale-105"
        />
        <span className="ml-2 hidden text-lg font-semibold sm:block">
          Sacred Shifter
        </span>
      </Link>
    </div>
  );
};

export default SidebarLogo;
