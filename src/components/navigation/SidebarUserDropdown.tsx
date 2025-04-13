
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarUserDropdownProps {
  isCollapsed?: boolean;
}

const SidebarUserDropdown: React.FC<SidebarUserDropdownProps> = ({ isCollapsed = false }) => {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <Link to="/auth" className="w-full">
          <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white">Sign In</Button>
        </Link>
      </div>
    );
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`w-full flex items-center justify-${isCollapsed ? 'center' : 'start'} p-2 text-white hover:bg-white/10`}>
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-purple-100 text-purple-800">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email}</p>
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
            <Settings className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut && signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserDropdown;
