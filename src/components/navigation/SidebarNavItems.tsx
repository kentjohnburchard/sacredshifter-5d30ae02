
import React from 'react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { getActiveNavItems } from '@/config/navigation';
import {
  Home,
  Music,
  Heart,
  HeartPulse,
  Sparkles,
  Activity,
  BookOpen,
  Mail,
  User,
  Settings,
  Triangle,
  Flame,
  Compass,
  Clock,
  Map,
  Brain,
  BarChart3,
  Star,
  LayoutTemplate,
} from 'lucide-react';

// Map of route paths to their corresponding icons
const iconMap: Record<string, React.FC<any>> = {
  '/': Home,
  '/dashboard': Home,
  '/sacred-blueprint': LayoutTemplate,
  '/frequency-library': Music,
  '/heart-center': Heart,
  '/emotion-engine': HeartPulse,
  '/timeline': Activity,
  '/music-generator': Music,
  '/mirror-portal': Compass,
  '/frequency-shift': Sparkles,
  '/shift-perception': Brain,
  '/soul-scribe': BookOpen,
  '/deity-oracle': Flame,
  '/astral-attunement': Star,
  '/subscription': User,
  '/referral': Sparkles,
  '/trinity-gateway': Triangle,
  '/about-founder': User,
  '/contact': Mail,
  '/hermetic-wisdom': BookOpen,
  '/alignment': BarChart3,
  '/focus': Brain,
  '/energy-check': Activity,
  '/astrology': Star,
  '/heart-dashboard': Heart,
  '/harmonic-map': Map,
  '/journey-templates': Map,
  '/personal-vibe': Settings,
  '/site-map': Map,
  '/profile': User,
};

interface SidebarNavItemsProps {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ 
  isCollapsed, 
  onLinkClick 
}) => {
  const location = useLocation();
  const { liftTheVeil } = useTheme();
  const activeNavItems = getActiveNavItems();

  // Filter out duplicate paths to prevent showing the same link twice
  const uniqueNavItems = activeNavItems.filter((item, index, self) => 
    index === self.findIndex((t) => t.path === item.path)
  );

  return (
    <div className="space-y-1">
      {uniqueNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const IconComponent = iconMap[item.path] || Home;
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            isMobile={false}
            onClick={onLinkClick}
            className={cn(
              "flex items-center py-2 px-3 text-sm rounded-md transition-all duration-200",
              isActive
                ? "bg-purple-600/30 text-white shadow-md"
                : "text-white/80 hover:bg-purple-500/20 hover:text-white",
              liftTheVeil && isActive && "bg-pink-500/30 text-white",
              liftTheVeil && !isActive && "hover:bg-pink-500/20 hover:text-white"
            )}
          >
            <IconComponent
              className={cn(
                "h-5 w-5 mr-2",
                isActive
                  ? liftTheVeil
                    ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                    : "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                  : "text-white/70"
              )}
            />
            {!isCollapsed && <span className="drop-shadow-sm">{item.label}</span>}
          </NavLink>
        );
      })}
      
      {/* Site Map is now only shown when sidebar is expanded and only once */}
      {!isCollapsed && !uniqueNavItems.some(item => item.path === "/site-map") && (
        <NavLink
          to="/site-map"
          isMobile={false}
          onClick={onLinkClick}
          className="flex items-center py-2 px-3 text-sm rounded-md transition-all duration-200 text-white/70 hover:bg-purple-500/20 hover:text-white mt-4 border-t border-purple-500/20 pt-4"
        >
          <Map className="h-5 w-5 mr-2 text-white/70" />
          <span className="drop-shadow-sm">Site Map</span>
        </NavLink>
      )}
    </div>
  );
};

export default SidebarNavItems;
