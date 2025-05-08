
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getActiveNavItems, type NavItem, type PageKey } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
// Import specific icon components instead of the entire library
import { Circle, Layers } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

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
  const { pathname: locationPath } = useLocation();
  const [activeNavLinks, setActiveNavLinks] = useState<NavItem[]>([]);
  const [themeState, setThemeState] = useState(liftTheVeil);

  useEffect(() => {
    console.log("SidebarNavItems theme updated, liftTheVeil:", liftTheVeil);
    setThemeState(liftTheVeil);
  }, [liftTheVeil]);

  useEffect(() => {
    const items = getActiveNavItems();
    setActiveNavLinks(items);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      console.log("SidebarNavItems detected theme change event");
      setThemeState(prev => !prev);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <div className="space-y-1 py-2">
      {activeNavLinks.map((item) => {
        const isActive = locationPath === item.path;
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

// Function to map icon string to a component
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Circle': return <Circle />;
    case 'Layers': return <Layers />;
    // Add other icon cases as needed for your navigation
    default: return <Circle />;  // Default icon
  }
};

// NavLink component that renders an individual navigation item
const NavLinkItem: React.FC<NavLinkItemProps> = ({
  icon,
  label,
  path,
  isCollapsed,
  isActive,
  onClick,
  liftTheVeil
}) => {
  const linkClasses = cn(
    "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:bg-white/10 nav-link text-white",
    isActive ? 
      liftTheVeil ? "bg-pink-900/40 font-bold" : "bg-purple-900/40 font-bold" 
      : "",
    isCollapsed ? "justify-center" : "justify-start",
    "transition-all duration-200"
  );

  return (
    <Link
      to={path}
      className={linkClasses}
      onClick={onClick}
    >
      <div className="relative flex min-h-[32px] w-full items-center gap-3">
        {/* Use the function to get the appropriate icon */}
        <div className={cn(
          "h-[18px] w-[18px] shrink-0 text-white",
          isActive ? "text-shadow-md" : ""
        )}>
          {icon ? getIconComponent(icon) : <Circle />}
        </div>

        {!isCollapsed && (
          <span className="truncate text-sm text-white">{label}</span>
        )}

        {isActive && !isCollapsed && (
          <span
            className={cn(
              "ml-auto h-2 w-2 rounded-full",
              liftTheVeil ? "bg-pink-400" : "bg-purple-400"
            )}
          />
        )}
      </div>
    </Link>
  );
};

export default SidebarNavItems;
