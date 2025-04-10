
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

  // Set the page title
  document.title = `${pageTitle} | Sacred Shifter`;

  const renderContent = () => (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-20' : ''} pt-20 px-4 lg:px-8 pb-24 transition-all duration-300 relative`}>
          {/* Top Logo Watermark */}
          <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-start">
            <img 
              src="/lovable-uploads/b9b4b625-472c-484e-a49a-41aaf4f604a5.png" 
              alt="Sacred Shifter Top Watermark" 
              className="max-w-[70%] max-h-[20%] object-contain opacity-[0.15] mt-12" 
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

  // Always apply the cosmic theme with AnimatedBackground for consistent visuals
  return (
    <AnimatedBackground theme={theme} intensity="high">
      {renderContent()}
    </AnimatedBackground>
  );
};

export default Layout;
