import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarLogo from "@/components/navigation/SidebarLogo";
import SidebarNavItems from "@/components/navigation/SidebarNavItems"; 
import SidebarUserDropdown from "@/components/navigation/SidebarUserDropdown";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const AUTO_COLLAPSE_DELAY = 4000; // 4 seconds before auto-collapse

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen, isMounted]);

  useEffect(() => {
    let timer: number | undefined;
    
    if (!isCollapsed && isMounted && window.innerWidth >= 640 && !isHovering) {
      timer = window.setTimeout(() => {
        setIsCollapsed(true);
      }, AUTO_COLLAPSE_DELAY);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCollapsed, isMounted, isHovering]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const effectivelyCollapsed = isMobileMenuOpen ? false : isCollapsed;
  
  const themeClasses = liftTheVeil 
    ? "bg-gradient-to-b from-pink-900 via-pink-700 to-fuchsia-900" // strong pink/fuchsia gradient
    : "bg-gradient-to-b from-purple-800 via-purple-900 to-indigo-900"; // strong purple/indigo gradient

  useEffect(() => {
    console.log("Sidebar theme updated, liftTheVeil:", liftTheVeil);
    console.log("Applied theme classes:", themeClasses);
  }, [liftTheVeil, themeClasses]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 sm:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-white" />
      </Button>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r shadow-lg transition-all duration-300 sm:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          effectivelyCollapsed ? "w-20" : "w-64",
          themeClasses,
          className
        )}
        onMouseEnter={() => {
          if (window.innerWidth >= 640) {
            setIsHovering(true);
            setIsCollapsed(false);
          }
        }}
        onMouseLeave={() => {
          if (window.innerWidth >= 640) {
            setIsHovering(false);
          }
        }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-6 h-6 w-6 rounded-full border bg-white p-0 shadow-md hidden sm:flex items-center justify-center",
            liftTheVeil ? "border-pink-300" : "border-purple-300"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
          ) : (
            <ChevronLeft className={cn("h-4 w-4", liftTheVeil ? "text-pink-500" : "text-purple-500")} />
          )}
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full sm:hidden",
            liftTheVeil ? "text-pink-300" : "text-purple-300"
          )}
          aria-label="Close menu"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className={`flex items-center justify-center py-3 sm:py-5 ${effectivelyCollapsed ? "px-2" : "px-4"}`}>
          <SidebarLogo className={effectivelyCollapsed ? "scale-75" : ""} />
        </div>

        <ScrollArea className="flex-1 px-2 sm:px-3 py-2">
          <SidebarNavItems 
            isCollapsed={effectivelyCollapsed}
            onLinkClick={() => {
              if (window.innerWidth < 640) {
                setIsMobileMenuOpen(false);
              } else {
                setIsCollapsed(true);
              }
            }} 
          />
        </ScrollArea>

        <div className={cn(
          "border-t px-3 py-4", 
          liftTheVeil ? "border-pink-700" : "border-purple-700"
        )}>
          <SidebarUserDropdown isCollapsed={effectivelyCollapsed} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
