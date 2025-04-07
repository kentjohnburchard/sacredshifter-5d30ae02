
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
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SidebarNavItems = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: "Home", path: "/home", icon: <Home className="h-5 w-5" />, access: "free" },
    { name: "Energy Check", path: "/energy-check", icon: <Activity className="h-5 w-5" />, access: "premium" },
    { name: "Sacred Blueprint", path: "/sacred-blueprint", icon: <Sparkles className="h-5 w-5" />, access: "premium" },
    { name: "Heart Center", path: "/heart-center", icon: <Heart className="h-5 w-5" />, access: "free" },
    { name: "Shift Your Perception", path: "/shift-perception", icon: <Zap className="h-5 w-5" />, access: "free" },
    { name: "Frequency Library", path: "/frequency-library", icon: <Music className="h-5 w-5" />, access: "premium" },
    { name: "Intention Setting", path: "/intentions", icon: <PenTool className="h-5 w-5" />, access: "premium" },
    { name: "Hermetic Wisdom", path: "/hermetic-wisdom", icon: <BookOpen className="h-5 w-5" />, access: "premium" },
    { name: "Astrology", path: "/astrology", icon: <Stars className="h-5 w-5" />, access: "premium" },
    { name: "Journey Templates", path: "/journey-templates", icon: <Compass className="h-5 w-5" />, access: "premium" },
    { name: "Music Library", path: "/music-library", icon: <Headphones className="h-5 w-5" />, access: "premium" },
    { name: "About The Founder", path: "/about-founder", icon: <UserRound className="h-5 w-5" />, access: "free" },
  ];
  
  const secondaryNavItems = [
    { name: "Focus", path: "/focus", icon: <Clock className="h-5 w-5" />, access: "free" },
    { name: "Personal Vibe", path: "/personal-vibe", icon: <Wand2 className="h-5 w-5" />, access: "premium" },
    { name: "Subscription", path: "/subscription", icon: <ArrowUpRight className="h-5 w-5" />, access: "free" },
    { name: "Profile", path: "/profile", icon: <UserRound className="h-5 w-5" />, access: "free" },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" />, access: "free" },
  ];
  
  const renderLink = (item: { name: string; path: string; icon: JSX.Element; access: "free" | "premium" }) => {
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.access === "premium" ? "/subscription" : item.path}
        className={`flex items-center px-3 py-1.5 text-sm transition-colors rounded-lg ${
          active
            ? "text-primary-foreground bg-primary/90"
            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        }`}
      >
        <span className={`mr-2 ${active ? "text-primary-foreground" : ""}`}>
          {item.icon}
        </span>
        <span className="flex-1">{item.name}</span>
        {item.access === "premium" && (
          <Badge variant="outline" className="ml-2 bg-purple-100/30 text-purple-600 text-[10px] px-1 border-purple-200">
            Premium
          </Badge>
        )}
      </Link>
    );
  };
  
  return (
    <div className="space-y-2 py-1">
      <div className="px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>{renderLink(item)}</div>
          ))}
        </div>
      </div>
      
      <div className="px-2">
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
