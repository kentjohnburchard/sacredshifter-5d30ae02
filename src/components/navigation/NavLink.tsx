
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
    ? "bg-[#9966FF]/20 text-white font-bold" 
    : "text-white font-semibold hover:bg-[#9966FF]/15"; 
    
  const desktopActiveClass = isActive 
    ? "text-white font-bold" 
    : "text-white font-semibold"; 
    
  const baseClass = isMobile 
    ? `text-lg transition-colors px-4 py-2 rounded-md ${mobileActiveClass}` 
    : `text-sm transition-colors ${desktopActiveClass}`;
    
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
