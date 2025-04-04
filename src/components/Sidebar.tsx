
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, CreditCard, User, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-[#9b87f5]/10 text-[#9b87f5]"
        : "text-[#9b87f5]/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
    )}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  
  const navItems = [
    { to: "/journey-templates", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m12 2 0 4"></path><path d="m18.36 5.64-2.83 2.83"></path><path d="m22 12-4 0"></path><path d="m18.36 18.36-2.83-2.83"></path><path d="m12 22 0-4"></path><path d="m5.64 18.36 2.83-2.83"></path><path d="m2 12 4 0"></path><path d="m5.64 5.64 2.83 2.83"></path></svg>, label: "Healing Journeys" },
    { to: "/energy-check", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"></path><path d="M2 17 12 22 22 17"></path><path d="M2 12 12 17 22 12"></path></svg>, label: "Energy Check" },
    { to: "/alignment", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a2.5 2.5 0 0 0-3.533 0l-10.2 10.2a2.5 2.5 0 0 0 3.536 3.536l10.2-10.2A2.5 2.5 0 0 0 20.8 4.6z"></path><path d="M20.8 16.341a2.5 2.5 0 0 0-.045-3.49l-5.559-5.558a2.5 2.5 0 0 0-3.49-.022L7.7 11.275a2.5 2.5 0 0 0 0 3.535l1.766 1.767a2.5 2.5 0 0 0 3.535 0L17 12.577"></path></svg>, label: "Alignment" },
    { to: "/intentions", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L18 2 L18 7"></path><path d="M18 2 L11 9"></path><path d="M19 15 V18 A2 2 0 0 1 17 20 H7 A2 2 0 0 1 5 18 V8 A2 2 0 0 1 7 6 H10"></path></svg>, label: "Intentions" },
    { to: "/meditation", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path><path d="M12 6V12L16 14"></path></svg>, label: "Meditation" },
    { to: "/focus", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.8v10.4"></path><path d="M6.8 12h10.4"></path><path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12Z"></path></svg>, label: "Focus" },
    { to: "/astrology", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-7"></path><path d="M5 5c0 2.8 0 4.2 1.7 5.9 1.5 1.5 4.2 2.1 5.3.4"></path><path d="M19 5c0 2.8 0 4.2-1.7 5.9-1.5 1.5-4.2 2.1-5.3.4"></path><path d="M5 2v2"></path><path d="M2 5h2"></path><path d="M7 5h12"></path><path d="M19 2v3"></path><path d="M22 5h-2"></path></svg>, label: "Astrology" },
    { to: "/soundscapes", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8L22 12L18 16"></path><path d="M6 16L2 12L6 8"></path><path d="M2 12H22"></path></svg>, label: "Soundscapes" },
    { to: "/timeline", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18"></path><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M3 21h18"></path></svg>, label: "Timeline" }
  ];
  
  return (
    <div className="h-screen w-64 border-r border-[#9966FF]/10 flex flex-col bg-white fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center justify-center py-6">
        <Link to="/">
          <img 
            src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
            alt="Sacred Shifter Logo" 
            className="h-24 w-auto"
          />
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <NavItem 
              key={index} 
              to={item.to} 
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
      </div>
      
      {/* User Account Section */}
      <div className="p-4 border-t border-[#9966FF]/10">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start w-full text-left px-3 py-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="" alt={user.email || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white text-xs">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">{user.email?.split('@')[0] || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
            <Button variant="outline" size="sm" className="w-full bg-[#9b87f5]/5 border-[#9b87f5]/10 hover:bg-[#9b87f5]/10 text-[#9b87f5]">
              Sign In
            </Button>
          </Link>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center py-6">
                <Link to="/">
                  <img 
                    src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
                    alt="Sacred Shifter Logo" 
                    className="h-24 w-auto"
                  />
                </Link>
              </div>
              
              <div className="flex-1 py-6 px-3 overflow-y-auto">
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <NavItem 
                      key={index} 
                      to={item.to} 
                      icon={item.icon}
                      label={item.label}
                    />
                  ))}
                </nav>
              </div>
              
              <div className="p-4 border-t border-[#9966FF]/10">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.email || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white text-xs">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.email?.split('@')[0] || "User"}</span>
                      <button 
                        onClick={handleSignOut}
                        className="text-xs text-[#9b87f5] hover:underline flex items-center"
                      >
                        <LogOut className="mr-1 h-3 w-3" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="w-full bg-[#9b87f5]/5 border-[#9b87f5]/10 hover:bg-[#9b87f5]/10 text-[#9b87f5]">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Sidebar;
