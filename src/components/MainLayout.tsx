
import React, { ReactNode } from 'react';
import Layout from "@/components/Layout";

interface MainLayoutProps {
  children: ReactNode;
  theme?: 'cosmic' | 'ethereal' | 'temple';
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  theme = 'cosmic' 
}) => {
  return (
    <Layout theme={theme}>
      <div className="container mx-auto px-4 py-6">
        <div className="min-h-[70vh]">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default MainLayout;
