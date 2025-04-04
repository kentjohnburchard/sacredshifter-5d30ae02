
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { 
  Music, 
  BookOpen, 
  Moon, 
  Users, 
  BarChart2, 
  Calendar,
  Clock, 
  Zap, 
  Heart, 
  FileText, 
  Settings,
  Menu,
  X,
  LifeBuoy,
  Sparkles,
  Compass
} from "lucide-react";
import Logo from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isPro?: boolean;
  isNew?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isActive, isPro = false, isNew = false }) => {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-purple-600 ${
        isActive
          ? "bg-purple-50 font-medium text-purple-600"
          : "text-muted-foreground hover:bg-purple-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {isPro && (
        <Badge variant="outline" className="ml-auto bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0">
          PRO
        </Badge>
      )}
      {isNew && (
        <Badge variant="outline" className="ml-auto bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0">
          NEW
        </Badge>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const session = useSession();
  const [opened, setOpened] = useState(false);
  const { toast } = useToast();

  const isActive = (path) => location.pathname === path;
  
  const closeSheet = () => {
    setOpened(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-hidden py-2">
      <div className="flex items-center justify-center mb-4">
        <Link to="/" className="flex items-center gap-2 px-4 py-2">
          <Logo />
          <span className="text-xl font-semibold text-foreground">
            Sacred <span className="text-purple-600">Shifter</span>
          </span>
        </Link>
      </div>
      
      <div className="flex-1 space-y-1 px-4">
        <div className="py-2">
          <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            SOUND EXPERIENCES
          </h3>
          <div className="space-y-1">
            <SidebarLink to="/journey-templates" icon={BookOpen} label="Sacred Healing Journeys" isActive={isActive("/journey-templates")} />
            <SidebarLink to="/meditation" icon={Moon} label="Frequency Meditation" isActive={isActive("/meditation")} />
            <SidebarLink to="/focus" icon={Zap} label="Focus Flow" isActive={isActive("/focus")} />
            <SidebarLink to="/soundscapes" icon={Music} label="Sonic Alchemy" isActive={isActive("/soundscapes")} isNew={true} />
          </div>
        </div>
        
        <div className="py-2">
          <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            VIBRATIONAL TOOLS
          </h3>
          <div className="space-y-1">
            <SidebarLink to="/energy-check" icon={BarChart2} label="Energy Check-in" isActive={isActive("/energy-check")} />
            <SidebarLink to="/alignment" icon={Heart} label="Chakra Alignment" isActive={isActive("/alignment")} />
            <SidebarLink to="/intentions" icon={FileText} label="Intention Setting" isActive={isActive("/intentions")} />
            <SidebarLink to="/hermetic-wisdom" icon={Sparkles} label="Hermetic Wisdom" isActive={isActive("/hermetic-wisdom")} isNew={true} />
            <SidebarLink to="/astrology" icon={Compass} label="Frequency Astrology" isActive={isActive("/astrology")} isPro={true} />
          </div>
        </div>
        
        <div className="py-2">
          <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            YOUR JOURNEY
          </h3>
          <div className="space-y-1">
            <SidebarLink to="/timeline" icon={Clock} label="Frequency Timeline" isActive={isActive("/timeline")} />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        {session ? (
          <Link
            to="/account"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary hover:bg-accent ${
              isActive("/account") ? "bg-accent font-medium text-primary" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            <Users className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r border-border bg-background md:flex md:flex-col">
        {sidebarContent}
      </aside>
      
      {/* Mobile Menu Button */}
      <div className="fixed bottom-4 left-4 z-40 md:hidden">
        <Sheet open={opened} onOpenChange={setOpened}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full shadow-md bg-purple-600 hover:bg-purple-700 text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0" onInteractOutside={closeSheet}>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
