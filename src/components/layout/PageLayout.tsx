
import React, { useEffect } from 'react';
import Layout from '../Layout';
import { useTheme } from '@/context/ThemeContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showPlayer?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title = 'Sacred Shifter',
  showSidebar = true,
  showPlayer = true,
  className = '',
}) => {
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    // Apply Sacred Circle theme classes
    document.body.classList.add('sacred-app');
    const consciousnessClass = liftTheVeil ? 'veil-mode' : 'standard-mode';
    document.body.classList.add(consciousnessClass);
    
    return () => {
      // Cleanup classes when component unmounts
      document.body.classList.remove('sacred-app');
      document.body.classList.remove('veil-mode');
      document.body.classList.remove('standard-mode');
    }
  }, [liftTheVeil]);
  
  return (
    <Layout
      pageTitle={title}
      showNavbar={showSidebar}
      showPlayer={showPlayer}
      className={`${liftTheVeil ? 'veil-mode' : 'standard-mode'} ${className}`}
    >
      {children}
    </Layout>
  );
};
