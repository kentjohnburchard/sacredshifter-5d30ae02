
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, CreditCard, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarUserDropdownProps {
  isCollapsed?: boolean;
}

const SidebarUserDropdown: React.FC<SidebarUserDropdownProps> = ({ isCollapsed = false }) => {
  const { user, profile, signOut } = useAuth();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Link to="/auth" className="w-full">
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white">Sign In</Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const userInitials = displayName.substring(0, 2).toUpperCase();
  const isPremium = profile?.is_premium;
  const isAdmin = profile?.role === 'admin';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`w-full flex items-center justify-${isCollapsed ? 'center' : 'start'} p-2 text-white hover:bg-white/10`}>
          <div className="relative">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-purple-100 text-purple-800">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {isPremium && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Crown className="h-3 w-3 text-amber-900" />
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <p className="text-sm font-medium text-white mr-1">{displayName}</p>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-600 text-white">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 truncate max-w-[140px]">
                {user.email}
              </p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/personal-vibe">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/subscription">
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>
              {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
              {!isPremium && <span className="ml-1 text-xs text-amber-500">✨</span>}
            </span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserDropdown;
