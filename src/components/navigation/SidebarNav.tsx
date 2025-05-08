
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getActiveNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarUserDropdown from './SidebarUserDropdown';

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { liftTheVeil } = useTheme();
  const navItems = getActiveNavItems();

  // Handle resize events for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapsedState = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      {isMobile && (
        <Button 
          onClick={toggleSidebar} 
          variant="ghost" 
          size="icon"
          className="fixed top-4 left-4 z-50 text-white bg-black/40 backdrop-blur-md hover:bg-black/60"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
          isMobile ? (isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full") : 
                    (isCollapsed ? "w-20" : "w-64"),
          liftTheVeil ? "bg-black/80 border-r border-pink-900/30" : "bg-black/80 border-r border-purple-900/30",
          "backdrop-blur-md",
          className
        )}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center justify-center">
          <SidebarLogo className={isCollapsed ? "scale-75" : ""} />
          
          {!isMobile && !isCollapsed && (
            <Button 
              className="absolute right-2 top-4 text-white hover:bg-white/10"
              variant="ghost"
              size="sm"
              onClick={toggleCollapsedState}
            >
              {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const IconComponent = Icons[item.icon as keyof typeof Icons] || Icons.Circle;
              
              const getChakraColor = () => {
                if (isActive) {
                  return liftTheVeil ? 'text-pink-400' : 'text-purple-400';
                }
                return 'text-gray-400';
              };
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center p-2 rounded-lg transition-all duration-200",
                      isActive 
                        ? (liftTheVeil ? "bg-pink-900/30" : "bg-purple-900/30") 
                        : "hover:bg-gray-900/50",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex items-center",
                      getChakraColor(),
                      isActive && "animate-pulse-subtle"
                    )}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <span className={cn(
                        "ml-3 transition-opacity duration-200", 
                        isActive ? "text-white" : "text-gray-300"
                      )}>
                        {item.label}
                      </span>
                    )}
                    {isActive && !isCollapsed && (
                      <span
                        className={cn(
                          "ml-auto h-2 w-2 rounded-full",
                          liftTheVeil ? "bg-pink-400" : "bg-purple-400"
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* User Section */}
        <div className={cn(
          "border-t p-4", 
          liftTheVeil ? "border-pink-900/30" : "border-purple-900/30"
        )}>
          <SidebarUserDropdown isCollapsed={isCollapsed && !isMobile} />
        </div>
      </aside>
    </>
  );
};

export default SidebarNav;
