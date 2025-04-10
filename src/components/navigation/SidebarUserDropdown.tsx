
import React from 'react';
import { User, Settings, LogOut, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SidebarUserDropdownProps {
  isCollapsed?: boolean;
}

const SidebarUserDropdown: React.FC<SidebarUserDropdownProps> = ({ isCollapsed = false }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full bg-purple-600/20 text-white hover:bg-purple-600/40 justify-start px-2"
        onClick={() => navigate('/auth')}
      >
        {!isCollapsed && <span className="ml-2">Sign In</span>}
        {isCollapsed && <User className="h-5 w-5 text-white" />}
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`w-full justify-start px-2 text-white hover:bg-purple-600/20 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-700 text-white text-xs">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className="truncate max-w-[140px] text-xs">
              {user.email || 'User'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-purple-900/90 backdrop-blur-lg text-white border border-purple-500/30">
        <DropdownMenuLabel className="text-white/70">
          <span className="truncate block">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/30" />
        
        <DropdownMenuItem
          className="text-white hover:bg-purple-700/50 cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-white hover:bg-purple-700/50 cursor-pointer"
          onClick={() => navigate('/subscription')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-white hover:bg-purple-700/50 cursor-pointer"
          onClick={() => navigate('/personal-vibe')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-purple-500/30" />
        
        <DropdownMenuItem
          className="text-white hover:bg-purple-700/50 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserDropdown;
