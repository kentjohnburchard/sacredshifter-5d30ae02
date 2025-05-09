
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { 
  Home, Music, Brain, Sparkles, Users, Heart, Menu, ChevronLeft, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import SidebarUserDropdown from './SidebarUserDropdown';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

const SidebarNav: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const navItems: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Journeys',
      href: '/journeys',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      title: 'Frequency Engine',
      href: '/frequency-engine',
      icon: <Music className="h-5 w-5" />
    },
    {
      title: 'Reality Optimizer',
      href: '/reality-optimizer',
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: 'Sacred Circle',
      href: '/sacred-circle',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Heart Dashboard',
      href: '/heart',
      icon: <Heart className="h-5 w-5" />
    },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        liftTheVeil ? 
          "bg-pink-950/60 border-r border-pink-800/30 backdrop-blur-md" :
          "bg-purple-950/60 border-r border-purple-800/30 backdrop-blur-md"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="text-lg font-bold text-white/90">
              Sacred Shifter
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-white/10",
                isActive ? (liftTheVeil ? "bg-pink-800/30 text-pink-100" : "bg-purple-800/30 text-purple-100") : "text-white/70",
                isCollapsed ? "justify-center" : ""
              )}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      liftTheVeil ? 'bg-pink-900 text-pink-200' : 'bg-purple-900 text-purple-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="p-4">
          {user ? (
            <SidebarUserDropdown isCollapsed={isCollapsed} />
          ) : (
            <NavLink to="/auth">
              <Button
                variant="outline"
                size={isCollapsed ? "icon" : "default"}
                className={`w-full ${
                  liftTheVeil 
                    ? 'border-pink-400/30 text-pink-200 hover:bg-pink-800/40' 
                    : 'border-purple-400/30 text-purple-200 hover:bg-purple-800/40'
                }`}
              >
                <LogIn className={cn("h-5 w-5", isCollapsed ? "" : "mr-2")} />
                {!isCollapsed && "Sign In"}
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
