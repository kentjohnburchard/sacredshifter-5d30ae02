
import React, { ReactNode, useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";

interface MainLayoutProps {
  children: ReactNode;
  theme?: 'cosmic' | 'ethereal' | 'temple';
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  theme = 'cosmic' 
}) => {
  const [isReady, setIsReady] = useState(false);
  
  // Defer rendering heavy components to prevent initial render slowdowns
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 100); // Small delay for initial rendering
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <Layout theme={theme}>
      <div className="container mx-auto px-4 py-6">
        {isReady ? (
          <CosmicContainer>
            {children}
          </CosmicContainer>
        ) : (
          // Simple loading state while heavy components initialize
          <div className="min-h-[70vh]">
            {children}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MainLayout;
