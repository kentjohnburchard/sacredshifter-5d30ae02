
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
  
  // Mobile styles are different from desktop styles
  const mobileActiveClass = isActive 
    ? "bg-purple-600/30 text-white" 
    : "text-white/80 hover:bg-purple-500/20 hover:text-white";
    
  const desktopActiveClass = isActive 
    ? "text-white" 
    : "text-white/80 hover:text-white";
    
  const baseClass = isMobile 
    ? `text-lg font-medium transition-colors px-4 py-2 rounded-md ${mobileActiveClass}` 
    : `text-sm font-medium transition-colors ${desktopActiveClass}`;
    
  return (
    <Link 
      to={to} 
      className={`${baseClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
