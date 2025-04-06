
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
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80">
      {/* Logo and App Title */}
      <SidebarLogo />

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 space-y-1 px-4 py-3">
        <SidebarNavItems />
      </ScrollArea>

      {/* Mobile Navigation (Visible on smaller screens) */}
      <div className="sm:hidden">
        <div className="border-t px-4 py-2">
          <SidebarUserDropdown />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
