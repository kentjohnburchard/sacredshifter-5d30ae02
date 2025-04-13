
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
  '/journey-player': Map,
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

  // Helper to check if path is active, including partially matching routes like journey-player
  const isPathActive = (path: string) => {
    // Check for exact match
    if (location.pathname === path) return true;
    
    // Special case for journey player routes
    if (path === '/journey-player' && location.pathname.startsWith('/journey-player/')) return true;
    
    return false;
  };

  return (
    <div className="space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = isPathActive(item.path);
        const IconComponent = iconMap[item.path] || LayoutDashboard;
        
        // CRITICAL FIX: Use explicit safelist-friendly classes with !important
        return (
          <NavLink
            key={item.path}
            to={item.path}
            isMobile={false}
            onClick={onLinkClick}
            className={cn(
              "flex items-center py-2 px-3 text-sm rounded-md transition-colors group relative !text-white !opacity-100",
              isActive
                ? liftTheVeil 
                  ? "bg-pink-700/80 !text-white font-bold" 
                  : "bg-purple-700/80 !text-white font-bold"
                : "!text-white font-bold", 
              liftTheVeil && !isActive && "hover:bg-pink-800/70 hover:!text-white",
              !liftTheVeil && !isActive && "hover:bg-purple-800/70 hover:!text-white"
            )}
          >
            {/* Active item indicator - subtle glow effect */}
            {isActive && (
              <div className={cn(
                "absolute inset-0 rounded-md opacity-40",
                liftTheVeil ? "shadow-[0_0_12px_4px_rgba(236,72,153,0.8)]" : "shadow-[0_0_12px_4px_rgba(147,51,234,0.8)]"
              )} />
            )}
            
            <div className="flex items-center z-10 relative">
              <IconComponent
                className="h-5 w-5 mr-3 !text-white"
                style={{ color: "white" }}
              />
              <span 
                className="!text-white font-bold w-auto !opacity-100"
                style={{ 
                  opacity: 1, 
                  color: "white",
                  visibility: "visible",
                  display: "inline"
                }}
              >
                {item.label}
              </span>
              {isCollapsed && (
                <ChevronRight className="h-4 w-4 ml-auto !text-white" style={{ color: "white" }} />
              )}
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
