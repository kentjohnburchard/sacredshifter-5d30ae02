
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
          src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
          alt="Sacred Shifter Logo"
          className="h-16 w-full object-contain"
        />
      </Link>
    </div>
  );
};

export default SidebarLogo;
