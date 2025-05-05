
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getActiveNavItems, type PageKey, navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
// Use react-router-dom's hooks and Link
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
  const [activeNavLinks, setActiveNavLinks] = useState<typeof navItems>([]);

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
  const IconComponent = useMemo(() => {
    if (!icon || typeof icon !== 'string') return Icons.Layers;
    // @ts-ignore - we know these icon names exist in Lucide
    return Icons[icon] || Icons.Layers;
  }, [icon]);

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
        <IconComponent
          className={cn(
            "h-[18px] w-[18px] shrink-0 text-white",
            isActive ? "text-shadow-md" : ""
          )}
        />

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
