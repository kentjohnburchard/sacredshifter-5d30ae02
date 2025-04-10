
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems"; 
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const AUTO_COLLAPSE_DELAY = 4000; // 4 seconds before auto-collapse

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
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

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 flex h-full flex-col bg-gradient-to-b from-purple-900/70 via-indigo-900/60 to-purple-900/70 backdrop-blur-md border-r border-purple-500/20 shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Cosmic glow effect */}
      <div className="absolute inset-0 bg-purple-500/5 rounded-r-lg"></div>
      
      {/* Collapse button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-purple-900 text-white p-0 shadow-md hover:bg-purple-800"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Logo and App Title */}
      <div className={`flex items-center justify-center py-5 ${isCollapsed ? "px-2" : "px-4"} relative z-10`}>
        <SidebarLogo className={isCollapsed ? "scale-75" : ""} />
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-2 relative z-10">
        <SidebarNavItems 
          isCollapsed={isCollapsed}
          onLinkClick={() => setIsCollapsed(true)} 
        />
      </ScrollArea>

      {/* User section at the bottom */}
      <div className="border-t border-purple-500/20 px-3 py-4 relative z-10">
        <SidebarUserDropdown isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
