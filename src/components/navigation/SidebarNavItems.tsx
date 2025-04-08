
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
  Mail,
  Clock,
  BookOpen
} from "lucide-react";

interface SidebarNavItemsProps {
  isCollapsed?: boolean;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ isCollapsed = false }) => {
  // Navigation items based on the screenshot
  const navItems = [
    { path: "/dashboard", icon: <HomeIcon size={20} />, label: "Dashboard" },
    { path: "/energy-check", icon: <Zap size={20} />, label: "Energy Check" },
    { path: "/heart-center", icon: <Heart size={20} />, label: "Heart Center" },
    { path: "/alignment", icon: <Activity size={20} />, label: "Alignment" },
    { path: "/intentions", icon: <Sparkles size={20} />, label: "Intentions" },
    { path: "/focus", icon: <Clock size={20} />, label: "Focus" },
    { path: "/hermetic-wisdom", icon: <BookOpen size={20} />, label: "Hermetic Wisdom" },
    { path: "/music-library", icon: <Music size={20} />, label: "Music Library" },
    { path: "/astrology", icon: <Star size={20} />, label: "Astrology" },
    { path: "/journey-templates", icon: <Triangle size={20} />, label: "Journey Templates" },
    { path: "/personal-vibe", icon: <User2 size={20} />, label: "My Vibe" },
    { path: "/trinity-gateway", icon: <Triangle size={20} />, label: "Trinity Gateway" }
  ];
  
  return (
    <div className="space-y-1 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"
            }`
          }
        >
          <span className={`mr-3 text-purple-600 ${isCollapsed ? "mx-auto" : ""}`}>
            {item.icon}
          </span>
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default SidebarNavItems;
