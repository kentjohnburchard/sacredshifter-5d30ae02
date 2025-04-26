
import React from "react";
// Use spa-router's Link and useRoute instead of react-router-dom
import { Link, useRoute } from "@/lib/spa-router";

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
  const { path } = useRoute();
  const isActive = path === to;

  React.useEffect(() => {
    // Log navigation for debugging
    if (isActive) {
      console.log("Active nav link:", to);
    }
  }, [isActive, to]);
  
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
    >
      <span 
        className="!text-white !opacity-100 font-bold"
      >
        {children}
      </span>
    </Link>
  );
};

export default NavLink;
