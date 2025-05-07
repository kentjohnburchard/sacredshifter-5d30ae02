
import React from 'react';
import Layout from '../Layout';

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
  return (
    <Layout
      pageTitle={title}
      showNavbar={showSidebar}
      showPlayer={showPlayer}
      className={className}
    >
      {children}
    </Layout>
  );
};
