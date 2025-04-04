
import React from "react";
import { LogOut, CreditCard, Library, Music, User, LayoutDashboard, BookOpen, Stars, Compass, CheckSquare, Heart, Zap, Clock, HeartPulse } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  
  return (
    <header className="w-full py-4 px-4 sm:px-6 flex flex-col items-center animate-fade-in bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80 fixed top-0 z-50">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
            alt="Sacred Shifter Logo" 
            className="h-40 sm:h-48 animate-pulse-subtle transition-all hover:scale-105"
          />
        </Link>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-6xl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/journeys" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/journeys" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Compass className="h-4 w-4" />
                <span>Journeys</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/journey-templates" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/journey-templates" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <HeartPulse className="h-4 w-4" />
                <span>Healing Journeys</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/energy-check" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/energy-check" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <CheckSquare className="h-4 w-4" />
                <span>Energy Check</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/alignment" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/alignment" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Heart className="h-4 w-4" />
                <span>Alignment</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/intentions" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/intentions" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Zap className="h-4 w-4" />
                <span>Intentions</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/meditation" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/meditation" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Music className="h-4 w-4" />
                <span>Meditation</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/focus" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/focus" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <BookOpen className="h-4 w-4" />
                <span>Focus</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/astrology" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/astrology" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Stars className="h-4 w-4" />
                <span>Astrology</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/soundscapes" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/soundscapes" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Library className="h-4 w-4" />
                <span>Soundscapes</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/timeline" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/timeline" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
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
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/subscription" className="flex items-center w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
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
    </header>
  );
};

export default Header;
