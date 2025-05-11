
import React, { useEffect } from 'react';
import Layout from '../Layout';
import { useTheme } from '@/context/ThemeContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showPlayer?: boolean;
  showChatBubble?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title = 'Sacred Shifter',
  showSidebar = true,
  showPlayer = true,
  showChatBubble = true,
  className = '',
}) => {
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    // Apply Sacred Circle theme classes
    document.body.classList.add('sacred-app');
    const consciousnessClass = liftTheVeil ? 'veil-mode' : 'standard-mode';
    document.body.classList.add(consciousnessClass);
    
    // Apply theme to root element for CSS variable accessibility
    const root = document.documentElement;
    if (liftTheVeil) {
      root.classList.add('veil-mode');
      root.classList.remove('standard-mode');
    } else {
      root.classList.add('standard-mode');
      root.classList.remove('veil-mode');
    }
    
    return () => {
      // Cleanup classes when component unmounts
      document.body.classList.remove('sacred-app');
      document.body.classList.remove('veil-mode');
      document.body.classList.remove('standard-mode');
      
      // Cleanup root element classes
      root.classList.remove('veil-mode');
      root.classList.remove('standard-mode');
    }
  }, [liftTheVeil]);
  
  return (
    <Layout
      pageTitle={title}
      showNavbar={showSidebar}
      showPlayer={showPlayer}
      showChatBubble={showChatBubble}
      className={`${liftTheVeil ? 'veil-mode' : 'standard-mode'} ${className}`}
    >
      {children}
    </Layout>
  );
};
