
import React from "react";
import { Music2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const location = useLocation();
  
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
    </header>
  );
};

export default Header;
