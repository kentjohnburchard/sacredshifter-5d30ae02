
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Player from './Player';
import GlobalWatermark from './GlobalWatermark';
import { getThemeClasses } from '@/utils/pageUtils';
import Sidebar from './Sidebar';
import { useTheme } from '@/context/ThemeContext';
import ConsciousnessToggle from './ConsciousnessToggle';
import JourneyAwareSpiralVisualizer from './visualizer/JourneyAwareSpiralVisualizer';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  showNavbar?: boolean;
  showContextActions?: boolean;
  showGlobalWatermark?: boolean;
  showPlayer?: boolean;
  hideHeader?: boolean;
  theme?: string;
  useBlueWaveBackground?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  pageTitle = "Sacred Shifter", 
  showNavbar = true,
  showContextActions = true,
  showGlobalWatermark = true,
  showPlayer = true,
  hideHeader = true,
  theme,
  useBlueWaveBackground,
  className = '',
}) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/auth";
  const { liftTheVeil } = useTheme();
  
  React.useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);

  const themeClasses = getThemeClasses(theme);
  
  // Determine the consciousness mode class based on liftTheVeil state
  const consciousnessClass = liftTheVeil ? 'veil-mode' : 'standard-mode';

  return (
    <div className={`relative flex min-h-screen w-full overflow-x-hidden ${consciousnessClass} ${className}`}>
      {/* Fixed position background elements */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Use SpiralVisualizer as background */}
        <JourneyAwareSpiralVisualizer 
          showControls={false} 
          containerId="backgroundSpiral"
          className="opacity-30"
        />
        
        {/* Additional glowing line effect */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(155, 135, 245, 0.4) 0%, transparent 60%), 
                             radial-gradient(circle at 70% 60%, rgba(98, 147, 232, 0.4) 0%, transparent 60%)`,
            backgroundSize: '100% 100%',
            filter: 'blur(40px)'
          }}></div>
        </div>
      </div>
      
      {/* Overlay with increased opacity for better text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none" />
      
      <ConsciousnessToggle />

      <div className={`flex min-h-screen w-full ${consciousnessClass} z-10 relative`}>
        {showNavbar && <Sidebar />}
        
        <div className={`flex-1 flex flex-col min-h-screen relative ${themeClasses} ${theme ? `theme-${theme}` : ''} ${consciousnessClass}`}>
          {!hideHeader && <Header />}
          
          {/* Content area with proper padding to avoid sidebar overlap */}
          <div className={`flex-grow min-h-[calc(100vh-80px)] pb-32 relative ${showNavbar ? 'md:ml-20 lg:ml-64 pt-4' : 'pt-0'} overflow-x-hidden`}>
            {/* Semi-transparent overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            
            {/* Main content with responsive padding */}
            <div className="w-full mx-auto relative z-10 px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
          
          {showPlayer && <Player />}
          
          {showGlobalWatermark && <GlobalWatermark />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
