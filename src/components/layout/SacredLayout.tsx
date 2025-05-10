
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import AppTheme from './AppTheme';
import GlobalStyles from './GlobalStyles';
import SidebarNav from '@/components/navigation/SidebarNav';
import Player from '@/components/Player';
import GlobalWatermark from '@/components/GlobalWatermark';
import { motion } from 'framer-motion';
import { CHAKRA_COLORS } from '@/types/chakras';
import ThemeEnhancer from '@/components/ThemeEnhancer';

interface SacredLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  showSidebar?: boolean;
  showPlayer?: boolean;
  showWatermark?: boolean;
  chakraColor?: string;
  themeIntensity?: 'low' | 'medium' | 'high';
  className?: string;
}

/**
 * SacredLayout - Unified layout component applying the Sacred Circle aesthetic to all pages
 */
const SacredLayout: React.FC<SacredLayoutProps> = ({
  children,
  pageTitle = "Sacred Shifter",
  showSidebar = true,
  showPlayer = true,
  showWatermark = true,
  chakraColor,
  themeIntensity = 'medium',
  className = '',
}) => {
  const { pathname } = useLocation();
  const { liftTheVeil } = useTheme();
  
  // Set document title
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);
  
  return (
    <>
      <GlobalStyles />
      <ThemeEnhancer />
      
      <AppTheme 
        chakraColor={chakraColor} 
        intensity={themeIntensity}
      >
        <div className={`flex min-h-screen w-full ${className}`}>
          {showSidebar && <SidebarNav />}
          
          <div className={`flex-1 flex flex-col min-h-screen relative ${showSidebar ? 'md:ml-20 lg:ml-64' : ''}`}>
            {/* Content area with proper padding to avoid sidebar overlap */}
            <motion.div 
              className={`flex-grow min-h-[calc(100vh-80px)] pb-32 relative overflow-x-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main content with responsive padding */}
              <div className="w-full mx-auto relative z-10 px-4 sm:px-6 md:px-8 py-6">
                {children}
              </div>
            </motion.div>
            
            {showPlayer && <Player />}
            
            {showWatermark && <GlobalWatermark />}
          </div>
        </div>
      </AppTheme>
    </>
  );
};

export default SacredLayout;
