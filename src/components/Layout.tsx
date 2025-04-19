
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Player from './Player';
import GlobalWatermark from './GlobalWatermark';
import { getThemeClasses } from '@/utils/pageUtils';
import Sidebar from './Sidebar';

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
  hideHeader = false,
  theme,
  useBlueWaveBackground,
}) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isAuthPage = pathname === "/auth";
  
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);

  const themeClasses = getThemeClasses(theme);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar for navigation */}
      {showNavbar && <Sidebar />}
      
      <div className={`flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen ${themeClasses} ${theme ? `theme-${theme}` : ''}`}>
        {/* Header area */}
        {!hideHeader && (
          <Header />
        )}
        
        {/* Main content area */}
        <div className={`flex-grow min-h-[calc(100vh-80px)] pb-32 ${showNavbar ? 'sm:pl-20 pt-20' : 'pt-0'}`}>
          {children}
        </div>
        
        {/* Audio player */}
        {showPlayer && <Player />}
        
        {/* Global watermark */}
        {showGlobalWatermark && <GlobalWatermark />}
      </div>
    </div>
  );
};

export default Layout;
