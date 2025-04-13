
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
  
  // IMPORTANT: Always ensure text is visible with opacity-100 and proper text-white color
  const mobileActiveClass = isActive 
    ? "bg-[#9966FF]/20 text-white font-bold opacity-100" 
    : "text-white font-bold opacity-100 hover:bg-[#9966FF]/15"; 
    
  const desktopActiveClass = isActive 
    ? "text-white font-bold opacity-100" 
    : "text-white font-bold opacity-100"; 
    
  const baseClass = isMobile 
    ? `text-lg opacity-100 transition-colors px-4 py-2 rounded-md ${mobileActiveClass}` 
    : `text-sm opacity-100 transition-colors ${desktopActiveClass}`;
    
  return (
    <Link 
      to={to} 
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={{ opacity: 1 }} // Inline style to ensure opacity
    >
      {children}
    </Link>
  );
};

export default NavLink;
