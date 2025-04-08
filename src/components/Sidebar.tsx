
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems";
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-white shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
    >
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
        <SidebarNavItems isCollapsed={isCollapsed} />
      </ScrollArea>

      {/* User section at the bottom */}
      <div className="border-t px-3 py-4">
        <SidebarUserDropdown isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
