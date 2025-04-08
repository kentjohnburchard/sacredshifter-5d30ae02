
import React from "react";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HomeIcon,
  Heart,
  Zap,
  Activity,
  BookOpen,
  Music,
  Star,
  Clock,
  UserCircle,
  Sparkles,
  Triangle,
  Mail,
  Brain
} from "lucide-react";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
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
    { path: "/personal-vibe", icon: <UserCircle size={20} />, label: "My Vibe" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-white shadow-sm">
      {/* Logo and App Title */}
      <div className="flex items-center justify-center py-5">
        <NavLink to="/" className="flex items-center space-x-2 px-3">
          <img 
            src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
            alt="Sacred Shifter Logo" 
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-purple-800">Sacred Shifter</span>
        </NavLink>
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
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
              <span className="mr-3 text-purple-600">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* User section at the bottom */}
      <div className="border-t px-3 py-4">
        <SidebarUserDropdown />
      </div>
    </aside>
  );
};

export default Sidebar;
