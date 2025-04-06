
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Music,
  UserRound,
  Home,
  Activity,
  Sparkles,
  ArrowUpRight,
  Compass,
  Heart,
  BookOpen,
  Stars,
  Clock,
  Settings,
  Headphones,
  PenTool,
  Wand2,
} from "lucide-react";

const SidebarNavItems = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: "Home", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "Energy Check", path: "/energy-check", icon: <Activity className="h-5 w-5" /> },
    { name: "Sacred Blueprint", path: "/sacred-blueprint", icon: <Sparkles className="h-5 w-5" /> },
    { name: "Heart Center", path: "/heart-center", icon: <Heart className="h-5 w-5" /> },
    { name: "Frequency Library", path: "/frequency-library", icon: <Music className="h-5 w-5" /> },
    { name: "Intention Setting", path: "/intentions", icon: <PenTool className="h-5 w-5" /> },
    { name: "Hermetic Wisdom", path: "/hermetic-wisdom", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Astrology", path: "/astrology", icon: <Stars className="h-5 w-5" /> },
    { name: "Journey Templates", path: "/journey-templates", icon: <Compass className="h-5 w-5" /> },
    { name: "Music Library", path: "/music-library", icon: <Headphones className="h-5 w-5" /> },
    { name: "About The Founder", path: "/about-founder", icon: <UserRound className="h-5 w-5" /> },
  ];
  
  const secondaryNavItems = [
    { name: "Focus", path: "/focus", icon: <Clock className="h-5 w-5" /> },
    { name: "Personal Vibe", path: "/personal-vibe", icon: <Wand2 className="h-5 w-5" /> },
    { name: "Subscription", path: "/subscription", icon: <ArrowUpRight className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <UserRound className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  const renderLink = (item: { name: string; path: string; icon: JSX.Element }) => {
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center px-3 py-2 text-sm transition-colors rounded-lg ${
          active
            ? "text-primary-foreground bg-primary/90"
            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        }`}
      >
        <span className={`mr-2 ${active ? "text-primary-foreground" : ""}`}>
          {item.icon}
        </span>
        {item.name}
      </Link>
    );
  };
  
  return (
    <div className="space-y-3 py-2">
      <div className="px-2 py-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>{renderLink(item)}</div>
          ))}
        </div>
      </div>
      
      <div className="px-2 py-1">
        <h2 className="mb-1 px-3 text-xs font-semibold text-muted-foreground tracking-wider">
          Settings & Tools
        </h2>
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <div key={item.path}>{renderLink(item)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarNavItems;
