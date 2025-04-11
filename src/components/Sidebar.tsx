
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems"; 
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const AUTO_COLLAPSE_DELAY = 4000; // 4 seconds before auto-collapse

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { liftTheVeil } = useTheme();
  
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
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r shadow-md transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        liftTheVeil 
          ? "bg-gradient-to-b from-pink-50/80 via-white/70 to-pink-50/80 border-pink-200" 
          : "bg-gradient-to-b from-purple-50/80 via-white/70 to-purple-50/80 border-purple-200",
        className
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Collapse button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-white p-0 shadow-md",
          liftTheVeil ? "border-pink-300" : "border-purple-300"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
        ) : (
          <ChevronLeft className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
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
      <div className={cn(
        "border-t px-3 py-4", 
        liftTheVeil ? "border-pink-200" : "border-purple-200"
      )}>
        <SidebarUserDropdown isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
