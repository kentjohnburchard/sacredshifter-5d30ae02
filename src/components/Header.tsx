
import React from "react";
import { LogOut, CreditCard, Library } from "lucide-react";
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
    <header className="w-full py-6 px-4 sm:px-6 flex flex-col items-center animate-fade-in backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a475dc5f-fe7d-4c0c-9af4-f1cf02cfe73f.png" 
            alt="Sacred Shifter Logo" 
            className="h-14 sm:h-16" 
          />
        </Link>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-4xl">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                location.pathname === "/" 
                  ? "bg-white/10 text-white" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}>
                Healing Frequencies
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/music-generation" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                location.pathname === "/music-generation" 
                  ? "bg-white/10 text-white" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}>
                Music Generation
              </Link>
            </NavigationMenuItem>
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/music-library" className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                    location.pathname === "/music-library" 
                      ? "bg-white/10 text-white" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}>
                    <Library className="h-4 w-4" />
                    <span>Music Library</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/subscription" className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                    location.pathname === "/subscription" 
                      ? "bg-white/10 text-white" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}>
                    <CreditCard className="h-4 w-4" />
                    <span>Subscribe</span>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300 hidden sm:inline-block">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1 bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
