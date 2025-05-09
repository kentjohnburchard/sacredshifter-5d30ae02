
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SidebarNav from '@/components/navigation/SidebarNav';
import { useTheme } from '@/context/ThemeContext';
import ThemeEnhancer from '@/components/ThemeEnhancer';
import GlobalWatermark from '@/components/GlobalWatermark';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import Player from '@/components/Player';
import SacredChat from '@/components/SacredChat';
import { CommunityProvider } from '@/contexts/CommunityContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import SidebarUserDropdown from '@/components/navigation/SidebarUserDropdown';

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showPlayer?: boolean;
  showChatBubble?: boolean;
  pageTitle?: string;
  chakraColor?: string;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  showSidebar = true,
  showPlayer = true,
  showChatBubble = true,
  pageTitle = 'Sacred Shifter',
  chakraColor,
  className = '',
}) => {
  const location = useLocation();
  const { liftTheVeil } = useTheme();
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);
  
  return (
    <CommunityProvider>
      <div className={`relative flex min-h-screen w-full overflow-hidden ${className}`}>
        {/* Background Elements */}
        <div className="fixed inset-0 w-full h-full z-0">
          <JourneyAwareSpiralVisualizer 
            showControls={false} 
            containerId="backgroundSpiral"
            className="opacity-30"
          />
        </div>
        
        {/* Chakra-colored overlay gradient based on chakraColor prop */}
        {chakraColor && (
          <div 
            className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
            style={{
              background: `radial-gradient(circle at center, ${chakraColor}30 0%, transparent 70%)`,
            }}
          />
        )}
        
        {/* Theme-based overlay */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none" />
        <ThemeEnhancer />

        {/* Layout Structure */}
        <div className="flex min-h-screen w-full z-10 relative">
          {showSidebar && <SidebarNav />}
          
          <main className={`flex-1 flex flex-col min-h-screen relative ${showSidebar ? 'md:ml-16 lg:ml-64' : ''}`}>
            {/* Header with Auth Button */}
            <div className="p-4 flex justify-end">
              {!user ? (
                <Link to="/auth">
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              ) : (
                <div className="w-full max-w-64">
                  <SidebarUserDropdown isCollapsed={false} />
                </div>
              )}
            </div>
            
            <div className="flex-grow min-h-[calc(100vh-80px)] pb-32 relative overflow-x-hidden">
              {/* Darker semi-transparent overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/20 z-0"></div>
              
              {/* Add responsive padding to ensure content doesn't touch edges on mobile */}
              <div className="w-full mx-auto relative z-10 px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
            
            {showPlayer && <Player />}
            
            {/* Community Chat Component - Only show if user is logged in and showChatBubble is true */}
            {showChatBubble && user && <SacredChat />}
            
            <GlobalWatermark />
          </main>
        </div>
      </div>
    </CommunityProvider>
  );
};

export default AppShell;
