
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  className = "", 
  isMobile = false,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  // CRITICAL FIX: Use explicit/specific Tailwind classes instead of opacity utility
  // This ensures classes don't get purged during production build
  const mobileActiveClass = isActive 
    ? "bg-[#9966FF]/20 !text-white font-bold" 
    : "!text-white font-bold hover:bg-[#9966FF]/15"; 
    
  const desktopActiveClass = isActive 
    ? "!text-white font-bold" 
    : "!text-white font-bold"; 
    
  const baseClass = isMobile 
    ? `text-lg px-4 py-2 rounded-md ${mobileActiveClass}` 
    : `text-sm transition-colors ${desktopActiveClass}`;
    
  return (
    <Link 
      to={to} 
      className={`${baseClass} ${className} !opacity-100`}
      onClick={onClick}
      style={{ 
        opacity: 1,
        color: "white",
        visibility: "visible",
        display: "block" 
      }}
    >
      <span 
        className="!text-white !opacity-100 font-bold" 
        style={{ 
          color: "white", 
          opacity: 1,
          visibility: "visible", 
          display: "inline" 
        }}
      >
        {children}
      </span>
    </Link>
  );
};

export default NavLink;
