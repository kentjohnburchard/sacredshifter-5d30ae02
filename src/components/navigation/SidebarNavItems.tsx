
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, Music, Brain, Users, Heart, Bookmark } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface SidebarNavItemsProps {
  isCollapsed: boolean;
  onLinkClick?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ isCollapsed, onLinkClick }) => {
  const location = useLocation();
  const { liftTheVeil } = useTheme();
  
  const navItems = [
    { path: '/', icon: <Home />, label: 'Home' },
    { path: '/journey-index', icon: <Sparkles />, label: 'Journeys' },
    { path: '/frequency-engine', icon: <Music />, label: 'Frequencies' },
    { path: '/reality-optimizer', icon: <Brain />, label: 'Optimizer' },
    { path: '/sacred-circle', icon: <Users />, label: 'Circle' },
    { path: '/heart-center', icon: <Heart />, label: 'Heart' },
    { path: '/bookmarks', icon: <Bookmark />, label: 'Bookmarks' },
  ];
  
  return (
    <nav className="px-2 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-3 rounded-md transition-all duration-300",
              isCollapsed ? "justify-center" : "justify-start",
              isActive 
                ? liftTheVeil
                  ? "bg-pink-500/20 text-white" 
                  : "bg-purple-500/20 text-white"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            )}
            onClick={onLinkClick}
            style={{
              textShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
              boxShadow: isActive 
                ? liftTheVeil 
                  ? '0 0 15px rgba(236, 72, 153, 0.2)' 
                  : '0 0 15px rgba(168, 85, 247, 0.2)' 
                : 'none'
            }}
          >
            <span className={cn(
              "flex items-center justify-center",
              isActive && liftTheVeil ? "text-pink-300" : isActive ? "text-purple-300" : ""
            )}>
              {React.cloneElement(item.icon, { 
                size: isCollapsed ? 20 : 18,
                className: cn(
                  "transition-all duration-300",
                  isCollapsed ? "" : "mr-3",
                  isActive ? "animate-pulse-subtle" : ""
                )
              })}
            </span>
            
            {!isCollapsed && (
              <span className={cn(
                "text-sm font-medium transition-all duration-300",
                isActive && liftTheVeil ? "text-pink-100" : isActive ? "text-purple-100" : ""
              )}>
                {item.label}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default SidebarNavItems;
