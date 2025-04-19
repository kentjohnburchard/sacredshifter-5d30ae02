
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
import { getActiveNavItems } from "@/config/navigation";

const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const activeNavItems = getActiveNavItems();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  
  return (
    <header className="w-full py-3 px-4 sm:px-6 flex items-center justify-between animate-fade-in bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80 fixed top-0 z-50">
      {/* Logo - Increased size by 50% */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
            alt="Sacred Shifter Logo" 
            className="h-28 sm:h-32 animate-pulse-subtle transition-all hover:scale-105"
          />
        </Link>
      </div>
      
      {/* Navigation Links - Add these back */}
      <div className="hidden md:flex items-center space-x-4">
        {activeNavItems.slice(0, 5).map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "text-sm transition-colors hover:text-purple-600",
              location.pathname === item.path ? "font-medium text-purple-700" : "text-gray-600"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* User Profile */}
      <div className="flex items-center">
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
