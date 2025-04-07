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
  Triangle
} from "lucide-react";

interface SidebarNavItemsProps {
  isCollapsed: boolean;
}

const navItems = [
  {
    path: "/",
    icon: HomeIcon,
    label: "Home",
  },
  {
    path: "/sacred-blueprint",
    icon: LayoutTemplate,
    label: "Sacred Blueprint™",
  },
  {
    path: "/mirror-portal",
    icon: Music,
    label: "Mirror Portal™",
  },
  {
    path: "/emotion-engine",
    icon: Heart,
    label: "Emotion Engine™",
  },
  {
    path: "/timeline",
    icon: Activity,
    label: "Timeline",
  },
  {
    path: "/music-generator",
    icon: Music4,
    label: "Music Generator",
  },
  {
    path: "/frequency-shift",
    icon: Zap,
    label: "Frequency Shift™",
  },
  {
    path: "/soul-scribe",
    icon: Brain,
    label: "Soul Scribe™",
  },
  {
    path: "/deity-oracle",
    icon: Flame,
    label: "Deity Oracle™",
  },
  {
    path: "/astral-attunement",
    icon: Star,
    label: "Astral Attunement™",
  },
  {
    path: "/subscription",
    icon: User2,
    label: "Subscription",
  },
  {
    path: "/referral",
    icon: Sparkles,
    label: "Referral Program",
  },
];

const SidebarNavItems = () => {
  return (
    <div className="space-y-1 py-2">
      {navItems.map((item) => (
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
          <item.icon size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
      
      <NavLink
        to="/trinity-gateway"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isActive
              ? "bg-gradient-to-r from-purple-900/70 to-indigo-900/70 text-white"
              : "text-gray-400 hover:text-gray-100 hover:bg-gray-900/50"
          }`
        }
      >
        <Triangle size={18} />
        <span>Trinity Gateway™</span>
      </NavLink>
    </div>
  );
};

export default SidebarNavItems;
