
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems";
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-white shadow-sm">
      {/* Logo and App Title */}
      <div className="flex items-center justify-center py-5">
        <SidebarLogo />
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNavItems />
      </ScrollArea>

      {/* User section at the bottom */}
      <div className="border-t px-3 py-4">
        <SidebarUserDropdown />
      </div>
    </aside>
  );
};

export default Sidebar;
