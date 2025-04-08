
import React, { ReactNode } from 'react';
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

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 pt-20 px-4 lg:px-8 pb-8 ml-20 transition-all duration-300">
            {children}
          </main>
        </div>
      )}

      {isAuthPage && (
        <main className="flex-1">
          {children}
        </main>
      )}

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
