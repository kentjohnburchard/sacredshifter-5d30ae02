
import React, { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import FixedFooter from '@/components/navigation/FixedFooter';
import { useLocation } from 'react-router-dom';
import GlobalWatermark from './GlobalWatermark';

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
  theme = 'cosmic'
}) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  // Set the page title
  document.title = `${pageTitle} | Sacred Shifter`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple static background instead of animated one */}
      <div className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-br ${
        theme === 'cosmic' ? 'from-black via-[#0a0118] to-black' : 
        theme === 'ethereal' ? 'from-black via-[#0a1818] to-black' : 
        'from-black via-[#181000] to-black'
      }`}></div>
      
      <div className="flex flex-1 relative z-10">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-20' : ''} pt-20 px-4 lg:px-8 pb-24 transition-all duration-300 relative z-10`}>
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
};

export default Layout;
