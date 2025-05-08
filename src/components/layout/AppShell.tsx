
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNav from '@/components/navigation/SidebarNav';
import { useTheme } from '@/context/ThemeContext';
import ThemeEnhancer from '@/components/ThemeEnhancer';
import GlobalWatermark from '@/components/GlobalWatermark';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import Player from '@/components/Player';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

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
  
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);
  
  return (
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
        
        <main className={`flex-1 flex flex-col min-h-screen relative ${showSidebar ? 'md:pl-20 lg:pl-64' : ''}`}>
          <div className="flex-grow min-h-[calc(100vh-80px)] pb-32 relative overflow-x-hidden">
            {/* Darker semi-transparent overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            
            <div className="w-full mx-auto relative z-10">
              {children}
            </div>
          </div>
          
          {showPlayer && <Player />}
          
          {/* Sacred Chat Bubble - Fixed Position */}
          {showChatBubble && (
            <div className="fixed right-6 bottom-24 z-50">
              <Button 
                size="lg" 
                className={`rounded-full shadow-lg p-4 ${
                  liftTheVeil 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } transition-all duration-300 hover:scale-105`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Sacred Chat</span>
              </Button>
            </div>
          )}
          
          <GlobalWatermark />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
