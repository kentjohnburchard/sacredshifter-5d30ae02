
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
  LayoutDashboard,
} from 'lucide-react';

// Map of route paths to their corresponding icons
const iconMap: Record<string, React.FC<any>> = {
  '/': Home,
  '/dashboard': LayoutDashboard,
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

  return (
    <div className="space-y-1">
      {activeNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const IconComponent = iconMap[item.path] || Home;
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            isMobile={false}
            onClick={onLinkClick}
            className={cn(
              "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
              isActive
                ? liftTheVeil 
                  ? "bg-pink-100 text-pink-900" 
                  : "bg-purple-100 text-purple-900"
                : "text-gray-600 hover:bg-opacity-80",
              liftTheVeil && !isActive && "hover:bg-pink-50 hover:text-pink-900",
              !liftTheVeil && !isActive && "hover:bg-purple-50 hover:text-purple-900"
            )}
          >
            <IconComponent
              className={cn(
                "h-5 w-5 mr-2",
                isActive
                  ? liftTheVeil
                    ? "text-pink-800"
                    : "text-purple-800"
                  : "text-gray-500"
              )}
            />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
