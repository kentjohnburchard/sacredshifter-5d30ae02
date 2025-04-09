
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
      className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-gradient-to-b from-purple-50 via-white to-purple-50 shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Overlay logo that shows when sidebar is collapsed */}
      {isCollapsed && (
        <div className="absolute inset-x-0 top-0 h-48 flex justify-center items-center">
          <div className="rotate-90 transform origin-center h-48 flex items-center justify-center">
            <img 
              src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
              alt="Sacred Shifter Logo" 
              className="h-40 w-auto object-contain"
            />
          </div>
        </div>
      )}
      
      {/* Collapse button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-white p-0 shadow-md"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Logo and App Title */}
      <div className={`flex items-center justify-center py-5 ${isCollapsed ? "px-2" : "px-4"}`}>
        <SidebarLogo className={isCollapsed ? "scale-75" : ""} />
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNavItems 
          isCollapsed={isCollapsed}
          onLinkClick={() => setIsCollapsed(true)} 
        />
      </ScrollArea>

      {/* User section at the bottom */}
      <div className="border-t px-3 py-4">
        <SidebarUserDropdown isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
