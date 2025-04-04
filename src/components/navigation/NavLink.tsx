
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className = "", isMobile = false }) => {
  const location = useLocation();
  
  const isActive = location.pathname === to;
  
  // Mobile styles are different from desktop styles
  const mobileActiveClass = isActive 
    ? "bg-[#9966FF]/10 text-[#7510c9]" 
    : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]";
    
  const desktopActiveClass = isActive 
    ? "text-[#7510c9]" 
    : "text-[#7510c9]/70 hover:text-[#7510c9]";
    
  const baseClass = isMobile 
    ? `text-lg font-medium transition-colors px-4 py-2 rounded-md ${mobileActiveClass}` 
    : `text-sm font-medium transition-colors ${desktopActiveClass}`;
    
  return (
    <Link 
      to={to} 
      className={`${baseClass} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
