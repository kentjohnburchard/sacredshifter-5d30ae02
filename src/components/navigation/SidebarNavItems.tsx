
import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Music,
  Compass,
  CheckSquare,
  Heart,
  Zap,
  Palette,
  Stars,
  Eye,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
  highlight?: boolean;
}

export const useNavItems = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      title: "Energy Check",
      icon: Zap,
      href: "/energy-check",
      active: pathname === "/energy-check",
    },
    {
      title: "Alignment",
      icon: Heart,
      href: "/alignment",
      active: pathname === "/alignment",
    },
    {
      title: "Intentions",
      icon: CheckSquare,
      href: "/intentions",
      active: pathname === "/intentions",
    },
    {
      title: "Focus",
      icon: Eye,
      href: "/focus",
      active: pathname === "/focus",
    },
    {
      title: "Hermetic Wisdom",
      icon: BookOpen,
      href: "/hermetic-wisdom",
      active: pathname === "/hermetic-wisdom",
    },
    {
      title: "Music Library",
      icon: Music,
      href: "/music-library",
      active: pathname === "/music-library",
    },
    {
      title: "Astrology",
      icon: Stars,
      href: "/astrology",
      active: pathname === "/astrology",
    },
    {
      title: "Journey Templates",
      icon: Compass,
      href: "/journey-templates",
      active: pathname === "/journey-templates",
    },
    {
      title: "My Vibe",
      icon: Palette,
      href: "/personal-vibe",
      active: pathname === "/personal-vibe",
      highlight: true
    },
  ];

  return navItems;
};

interface SidebarNavItemsProps {
  className?: string;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ className }) => {
  const navItems = useNavItems();
  
  return (
    <div className={`space-y-1 ${className}`}>
      {navItems.map((item) => (
        <Link key={item.title} to={item.href}>
          <Button
            variant="ghost"
            className={`w-full justify-start ${item.active ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''} ${item.highlight ? 'font-semibold text-brand-iridescent' : ''}`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default SidebarNavItems;
