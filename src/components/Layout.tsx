
import React, { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import FixedFooter from '@/components/navigation/FixedFooter';
import { useLocation } from 'react-router-dom';
import GlobalWatermark from './GlobalWatermark';
import { AnimatedBackground } from '@/components/sacred-geometry';

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
  const isAuthPage = location.pathname === '/auth';
  const isJourneyPage = location.pathname.includes('/journey/');
  const useCosmicTheme = !useBlueWaveBackground;

  // Set the page title
  document.title = `${pageTitle} | Sacred Shifter`;

  const renderContent = () => (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-20' : ''} pt-20 px-4 lg:px-8 pb-24 transition-all duration-300 relative`}>
          {/* Top Logo Watermark - increased opacity */}
          <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-start">
            <img 
              src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
              alt="Sacred Shifter Top Watermark" 
              className="max-w-[70%] max-h-[20%] object-contain opacity-[0.22] mt-12" 
            />
          </div>
          
          {children}
        </main>
      </div>

      {/* Add a spacer to prevent content from being hidden behind the fixed footer */}
      <div className="h-16"></div>
      
      {showFooter && <FixedFooter />}
      
      {/* Bottom watermark */}
      <GlobalWatermark />
    </div>
  );

  if (useBlueWaveBackground) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="fixed inset-0 pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJ3YXZlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDY1LDEyNSwyNTUsMC4xNSkiIHN0cm9rZS13aWR0aD0iMyIgZD0iTTAsMjUgQzUwLDAgMTUwLDAgMTgwLDI1IEMyMTAsNTAgMzAwLDMwIDM0MCw1MCBDMzgwLDcwIDQyMCwyNSA1MDAsNTAgTDUwMCwyMDAgTDAsMjAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3dhdmUpIj48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJwYXR0ZXJuVHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIGZyb209IjAgMCIgdG89IjIwMCAwIiBiZWdpbj0iMHMiIGR1cj0iMjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvcmVjdD48L3N2Zz4=')] opacity-80"></div>
        {renderContent()}
      </div>
    );
  }

  return (
    <AnimatedBackground theme={theme} intensity="medium">
      {renderContent()}
    </AnimatedBackground>
  );
};

export default Layout;
