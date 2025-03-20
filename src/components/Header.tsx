
import React from "react";
import { Music2, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    <header className="w-full py-6 px-4 sm:px-6 flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-accent/10">
          <Music2 className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight">
          <span className="font-light">Sacred</span>
          <span className="font-semibold">Shifter</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-4xl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
              )}>
                Healing Frequencies
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/music-generation" className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/music-generation" 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
              )}>
                Music Generation
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
