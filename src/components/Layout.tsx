
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Player from './Player';
import GlobalWatermark from './GlobalWatermark';
import { getThemeClasses } from '@/utils/pageUtils';
import Sidebar from './Sidebar';
import StarfieldBackground from './sacred-geometry/StarfieldBackground';
import { SacredGeometryVisualizer } from './sacred-geometry';
import { useTheme } from '@/context/ThemeContext';
import ConsciousnessToggle from './ConsciousnessToggle';

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
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  pageTitle = "Sacred Shifter", 
  showNavbar = true,
  showContextActions = true,
  showGlobalWatermark = true,
  showPlayer = true,
  hideHeader = true, // Set to true by default to hide headers
  theme,
  useBlueWaveBackground,
}) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/auth";
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);

  const themeClasses = getThemeClasses(theme);
  
  // Determine the consciousness mode class based on liftTheVeil state
  const consciousnessClass = liftTheVeil ? 'veil-mode' : 'standard-mode';

  return (
    <div className={`relative flex min-h-screen w-full overflow-hidden bg-gray-950 ${consciousnessClass}`}>
      <StarfieldBackground density="medium" opacity={0.5} isStatic={false} />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <SacredGeometryVisualizer
          defaultShape="flower-of-life"
          size="xl"
          showControls={false}
          isAudioReactive={false}
        />
      </div>
      
      <ConsciousnessToggle />

      <div className={`flex min-h-screen w-full ${consciousnessClass}`}>
        {showNavbar && <Sidebar />}
        
        <div className={`flex-1 flex flex-col min-h-screen relative z-10 ${themeClasses} ${theme ? `theme-${theme}` : ''} ${consciousnessClass}`}>
          {!hideHeader && <Header />}
          
          <div className={`flex-grow min-h-[calc(100vh-80px)] pb-32 relative ${showNavbar ? 'sm:pl-20 pt-4' : 'pt-0'}`}>
            {children}
          </div>
          
          {showPlayer && <Player />}
          
          {showGlobalWatermark && <GlobalWatermark />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
