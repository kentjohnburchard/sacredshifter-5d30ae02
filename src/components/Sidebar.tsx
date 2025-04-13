
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems"; 
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const AUTO_COLLAPSE_DELAY = 4000; // 4 seconds before auto-collapse

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { liftTheVeil } = useTheme();
  
  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  // Set up auto-collapse timer
  useEffect(() => {
    let timer: number | undefined;
    
    if (!isCollapsed) {
      timer = window.setTimeout(() => {
        setIsCollapsed(true);
      }, AUTO_COLLAPSE_DELAY);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCollapsed]);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 sm:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-white" />
      </Button>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar for mobile (full screen when active) */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r shadow-md transition-all duration-300 sm:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64",
          liftTheVeil 
            ? "bg-gradient-to-b from-pink-900/95 via-pink-800/90 to-pink-900/95 border-pink-700/50" 
            : "bg-gradient-to-b from-purple-900/95 via-purple-800/90 to-purple-900/95 border-purple-700/50",
          "sm:translate-x-0", // Always show on sm breakpoint and up
          className
        )}
      >
        {/* Collapse button - Hidden on mobile */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-white p-0 shadow-md hidden sm:flex items-center justify-center",
            liftTheVeil ? "border-pink-300" : "border-purple-300"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
          ) : (
            <ChevronLeft className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
          )}
        </Button>

        {/* Close button - Only on mobile */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full sm:hidden",
            liftTheVeil ? "text-pink-300" : "text-purple-300"
          )}
          aria-label="Close menu"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Logo and App Title */}
        <div className={`flex items-center justify-center py-3 sm:py-5 ${isCollapsed ? "px-2" : "px-4"}`}>
          <SidebarLogo className={isCollapsed ? "scale-75" : ""} />
        </div>

        {/* Scrollable Navigation Items */}
        <ScrollArea className="flex-1 px-2 sm:px-3 py-2">
          <SidebarNavItems 
            isCollapsed={isCollapsed}
            onLinkClick={() => {
              setIsCollapsed(true);
              setIsMobileMenuOpen(false);
            }} 
          />
        </ScrollArea>

        {/* User section at the bottom */}
        <div className={cn(
          "border-t px-3 py-4", 
          liftTheVeil ? "border-pink-700/50" : "border-purple-700/50"
        )}>
          <SidebarUserDropdown isCollapsed={isCollapsed} />
        </div>
      </aside>
      
      {/* Desktop behavior */}
      <aside 
        className={cn(
          "hidden sm:flex fixed left-0 top-0 z-40 h-full flex-col border-r shadow-md transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          liftTheVeil 
            ? "bg-gradient-to-b from-pink-900/95 via-pink-800/90 to-pink-900/95 border-pink-700/50" 
            : "bg-gradient-to-b from-purple-900/95 via-purple-800/90 to-purple-900/95 border-purple-700/50",
          className
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      />
    </>
  );
};

export default Sidebar;
