
import React, { ReactNode, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FixedFooter from '@/components/navigation/FixedFooter';
import { useLocation } from 'react-router-dom';
import GlobalWatermark from './GlobalWatermark';
import { AnimatedBackground } from '@/components/sacred-geometry';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import ConsciousnessToggle from './ConsciousnessToggle';
import CosmicFooter from './sacred-geometry/CosmicFooter';
import { TooltipProvider } from '@/components/ui/tooltip';
import SacredAudioPlayer from './audio/SacredAudioPlayer';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  showFooter?: boolean;
  useBlueWaveBackground?: boolean;
  theme?: 'cosmic' | 'ethereal' | 'temple';
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  pageTitle = "Sacred Shifter", 
  showFooter = true,
  useBlueWaveBackground = false,
  theme = 'cosmic'
}) => {
  const location = useLocation();
  const { liftTheVeil } = useTheme();
  const isAuthPage = location.pathname === '/auth';

  // Update document title
  useEffect(() => {
    document.title = `${pageTitle} | Sacred Shifter`;
  }, [pageTitle]);

  // Define theme-based border color with HIGH contrast
  const borderColorClass = liftTheVeil 
    ? 'border-pink-500 dark:border-pink-400' // Bright pink border when veil is lifted
    : 'border-purple-600 dark:border-purple-500'; // Rich purple border otherwise

  const renderContent = () => (
    <div className={`flex flex-col min-h-screen border-[12px] ${borderColorClass} transition-colors duration-300 overflow-x-hidden scroll-smooth`}>
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-0 sm:ml-20' : ''} pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 transition-all duration-300 relative max-w-7xl mx-auto w-full`}>
          <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-start">
            <img 
              src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
              alt="Sacred Shifter Top Watermark" 
              className="max-w-[70%] max-h-[20%] object-contain opacity-[0.35] mt-12" 
            />
          </div>
          
          {children}
        </main>
      </div>

      <div className="h-16"></div>
      
      {/* Footer components with adjusted z-indices */}
      {showFooter && <FixedFooter />}
      <GlobalWatermark />
      
      {/* Add ConsciousnessToggle (Easter Egg) to every page */}
      <ConsciousnessToggle />
      
      {/* Ensure CosmicFooter is positioned correctly */}
      {showFooter && <CosmicFooter showFrequencyBar={false} className="z-30" />}
      
      {/* Sacred Audio Player - SINGLE INSTANCE for the entire app */}
      <SacredAudioPlayer />
    </div>
  );

  if (useBlueWaveBackground) {
    return (
      <div className={`flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-[12px] ${borderColorClass} transition-colors duration-300 overflow-x-hidden scroll-smooth`}>
        <div className="fixed inset-0 pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDY1LDEyNSwyNTUsMC4zKSIgc3Ryb2tlLXdpZHRoPSI0IiBkPSJNMCwyNSBDNTAsMCAxNTAsMCAxODAsMjUgQzIxMCw1MCAzMDAsMzAgMzQwLDUwIEMzODAsNzAgNDIwLDI1IDUwMCw1MCBMNTAwLDIwMCBMMCwyMDAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InBhdHRlcm5UcmFuc2Zvcm0iIHR5cGU9InRyYW5zbGF0ZSIgZnJvbT0iMCAwIiB0bz0iMjAwIDAiIGJlZ2luPSIwcyIgZHVyPSIyMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9yZWN0Pjwvc3ZnPg==')] opacity-90"></div>
        {renderContent()}
      </div>
    );
  }

  return (
    <AnimatedBackground theme={theme} intensity="high" staticBackground={false}>
      {renderContent()}
    </AnimatedBackground>
  );
};

export default Layout;
