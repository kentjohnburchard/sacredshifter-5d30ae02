
import React, { ReactNode, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/navigation/Footer';
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
  
  // Add debugging
  useEffect(() => {
    console.log('Layout rendered, showFooter:', showFooter);
    console.log('Current path:', location.pathname);
  }, [showFooter, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 ${!isAuthPage ? 'ml-20' : ''} pt-20 px-4 lg:px-8 pb-32 transition-all duration-300 w-full`}>
          {children}
        </main>
      </div>

      {showFooter && (
        <div className="w-full left-0 right-0 bottom-0 z-10">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
