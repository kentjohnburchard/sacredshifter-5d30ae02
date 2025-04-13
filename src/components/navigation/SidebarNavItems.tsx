
import React from 'react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { getActiveNavItems } from '@/config/navigation';
import {
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
  ChevronRight,
} from 'lucide-react';

// Map of route paths to their corresponding icons
const iconMap: Record<string, React.FC<any>> = {
  '/': LayoutDashboard,
  '/home': LayoutDashboard,
  '/dashboard': LayoutDashboard,
  '/sacred-blueprint': LayoutTemplate,
  '/frequency-library': Music,
  '/frequencies': Music,
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
  '/landing': LayoutDashboard,
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
  
  // Filter out duplicate home routes by path
  const displayedPaths = new Set<string>();
  const filteredNavItems = activeNavItems.filter(item => {
    // Consider '/' and '/home' and '/dashboard' as the same home route
    const normalizedPath = ['/home', '/dashboard', '/'].includes(item.path) ? 'home' : item.path;
    
    if (displayedPaths.has(normalizedPath)) {
      return false;
    }
    displayedPaths.add(normalizedPath);
    return true;
  });

  return (
    <div className="space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const IconComponent = iconMap[item.path] || LayoutDashboard;
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            isMobile={false}
            onClick={onLinkClick}
            className={cn(
              "flex items-center py-2 px-3 text-sm rounded-md transition-colors group relative",
              isActive
                ? liftTheVeil 
                  ? "bg-pink-700/50 text-white font-medium" 
                  : "bg-purple-700/50 text-white font-medium"
                : "text-white hover:bg-opacity-80", 
              liftTheVeil && !isActive && "hover:bg-pink-800/50 hover:text-pink-200",
              !liftTheVeil && !isActive && "hover:bg-purple-800/50 hover:text-purple-200"
            )}
          >
            {/* Active item indicator - subtle glow effect */}
            {isActive && (
              <div className={cn(
                "absolute inset-0 rounded-md opacity-20",
                liftTheVeil ? "shadow-[0_0_8px_2px_rgba(236,72,153,0.6)]" : "shadow-[0_0_8px_2px_rgba(147,51,234,0.6)]"
              )} />
            )}
            
            <IconComponent
              className={cn(
                "h-5 w-5 mr-3", 
                isActive
                  ? liftTheVeil
                    ? "text-pink-300"
                    : "text-purple-300"
                  : "text-gray-200"
              )}
            />
            <span 
              className={cn(
                "transition-all duration-300 ease-in-out",
                isCollapsed 
                  ? "opacity-0 w-0 overflow-hidden" 
                  : "opacity-100 w-auto",
                isActive
                  ? "text-white font-medium"
                  : "text-white",
                "text-sm"
              )}
            >
              {item.label}
            </span>
            {isCollapsed && (
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 text-white" />
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
