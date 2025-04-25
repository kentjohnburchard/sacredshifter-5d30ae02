import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getActiveNavItems, type PageKey, navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface SidebarNavItemsProps {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}

interface NavLinkItemProps {
  icon?: string;
  label: string;
  path: string;
  isCollapsed?: boolean;
  pageKey: PageKey;
  isActive: boolean;
  onClick?: () => void;
  liftTheVeil: boolean;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({
  isCollapsed = false,
  onLinkClick,
}) => {
  const { liftTheVeil } = useTheme();
  const location = useLocation();
  const [activeNavLinks, setActiveNavLinks] = useState<typeof navItems>([]);
  
  // Force re-render when theme changes
  const [themeState, setThemeState] = useState(liftTheVeil);
  
  // Added logging to debug theme changes
  useEffect(() => {
    console.log("SidebarNavItems theme updated, liftTheVeil:", liftTheVeil);
    setThemeState(liftTheVeil); // Update local state to force re-render
  }, [liftTheVeil]);

  useEffect(() => {
    // Get active nav items based on application config
    const items = getActiveNavItems();
    setActiveNavLinks(items);
  }, []);

  // Listen for global theme change events
  useEffect(() => {
    const handleThemeChange = () => {
      console.log("SidebarNavItems detected theme change event");
      setThemeState(prev => !prev); // Toggle to force re-render
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <div className="space-y-1 py-2">
      {activeNavLinks.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLinkItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            pageKey={item.key}
            isCollapsed={isCollapsed}
            isActive={isActive}
            onClick={onLinkClick}
            liftTheVeil={liftTheVeil}
          />
        );
      })}
    </div>
  );
};

// NavLink component that renders an individual navigation item
const NavLinkItem: React.FC<NavLinkItemProps> = ({
  icon,
  label,
  path,
  isCollapsed,
  isActive,
  onClick,
}) => {
  // Dynamic import of Lucide icons - with fallback to default icon
  const IconComponent = useMemo(() => {
    if (!icon || typeof icon !== 'string') return Icons.Layers;
    // @ts-ignore - we know these icon names exist in Lucide
    return Icons[icon] || Icons.Layers;
  }, [icon]);
  
  // IMPORTANT: Always use text-white, no matter theme or state!
  const linkClasses = cn(
    "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-white/10 nav-link text-white",
    isActive ? "bg-white/10 font-bold" : "",
    isCollapsed ? "justify-center" : "justify-start",
    // No theme color text classes at all
  );

  return (
    <NavLink
      to={path}
      className={linkClasses}
      onClick={onClick}
    >
      <div className="relative flex min-h-[32px] w-full items-center gap-2">
        <IconComponent 
          className={cn(
            "h-[18px] w-[18px] shrink-0 text-white"
          )} 
        />
        
        {!isCollapsed && (
          <span className="truncate text-sm text-white">{label}</span>
        )}
        
        {isActive && !isCollapsed && (
          <span 
            className={cn(
              "ml-auto h-1.5 w-1.5 rounded-full bg-white"
            )}
          />
        )}
      </div>
    </NavLink>
  );
};

export default SidebarNavItems;
