
import React, { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import FixedFooter from '@/components/navigation/FixedFooter';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  pageTitle = "Sacred Shifter", 
  showFooter = true 
}) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  // Set the page title
  document.title = `${pageTitle} | Sacred Shifter`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-20' : ''} pt-20 px-4 lg:px-8 pb-24 transition-all duration-300 relative`}>
          {/* Top Logo Watermark */}
          <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 flex justify-center items-start">
            <img 
              src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
              alt="Sacred Shifter Top Watermark" 
              className="max-w-[70%] max-h-[20%] object-contain opacity-[0.04] mt-4" 
            />
          </div>
          
          {children}
        </main>
      </div>

      {/* Add a spacer to prevent content from being hidden behind the fixed footer */}
      <div className="h-16"></div>
      
      {showFooter && <FixedFooter />}
    </div>
  );
};

export default Layout;
