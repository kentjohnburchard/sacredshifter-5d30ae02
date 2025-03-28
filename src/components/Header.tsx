
import React from "react";
import { LogOut, CreditCard, Library, Music } from "lucide-react";
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
    <header className="w-full py-6 px-4 sm:px-6 flex flex-col items-center animate-fade-in backdrop-blur-sm bg-[#9b87f5]/5">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
            alt="Sacred Shifter Logo" 
            className="h-40 sm:h-48 animate-pulse-subtle transition-all hover:scale-105"
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
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                Healing Frequencies
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/music-generation" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                location.pathname === "/music-generation" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                Music Generation
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/music-library" className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                location.pathname === "/music-library" 
                  ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                  : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
              )}>
                <Music className="h-4 w-4" />
                <span>Library</span>
              </Link>
            </NavigationMenuItem>
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/subscription" className={cn(
                    "px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1",
                    location.pathname === "/subscription" 
                      ? "bg-[#9b87f5]/10 text-[#9b87f5]" 
                      : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
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
            <span className="text-sm text-[#9b87f5]/70 hidden sm:inline-block">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1 bg-[#9b87f5]/5 border-[#9b87f5]/10 hover:bg-[#9b87f5]/10 text-[#9b87f5]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </Button>
          </div>
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
