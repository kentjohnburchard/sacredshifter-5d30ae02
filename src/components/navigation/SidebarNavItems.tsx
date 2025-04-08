
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  LayoutTemplate,
  Music,
  Heart,
  User2,
  Star,
  Sparkles,
  Zap,
  Flame,
  Brain,
  Activity,
  Music4,
  Triangle,
  Mail
} from "lucide-react";
import { getActiveNavItems } from "@/config/navigation";

interface SidebarNavItemsProps {
  isCollapsed?: boolean;
}

// Map of icon names to their components
const iconMap = {
  HomeIcon,
  LayoutTemplate,
  Music,
  Heart,
  User2,
  Star,
  Sparkles,
  Zap,
  Flame,
  Brain,
  Activity,
  Music4,
  Triangle,
  Mail
};

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ isCollapsed = false }) => {
  const activeNavItems = getActiveNavItems();
  
  return (
    <div className="space-y-1 py-2">
      {activeNavItems.map((item) => {
        const IconComponent = iconMap[item.icon as keyof typeof iconMap];
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-purple-900/70 to-indigo-900/70 text-white"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-900/50"
              }`
            }
          >
            <IconComponent size={18} />
            <span className={isCollapsed ? "sr-only" : ""}>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
