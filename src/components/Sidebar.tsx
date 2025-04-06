import React from "react";
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Music,
  Compass,
  CheckSquare,
  Heart,
  Zap,
  Clock,
  Palette,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
  highlight?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const pathname = location.pathname;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

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
      title: "Timeline",
      icon: Clock,
      href: "/timeline",
      active: pathname === "/timeline",
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
      highlight: true // Add highlighting to make it stand out
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80">
      {/* Logo and App Title */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png"
            alt="Sacred Shifter Logo"
            className="h-10 animate-pulse-subtle transition-all hover:scale-105"
          />
          <span className="ml-2 hidden text-lg font-semibold sm:block">
            Sacred Shifter
          </span>
        </Link>
      </div>

      {/* Scrollable Navigation Items */}
      <ScrollArea className="flex-1 space-y-1 px-4 py-3">
        <div className="space-y-1">
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
      </ScrollArea>

      {/* Mobile Navigation (Visible on smaller screens) */}
      <div className="sm:hidden">
        <div className="border-t px-4 py-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.email || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="bg-[#9b87f5]/5 border-[#9b87f5]/10 hover:bg-[#9b87f5]/10 text-[#9b87f5]">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
