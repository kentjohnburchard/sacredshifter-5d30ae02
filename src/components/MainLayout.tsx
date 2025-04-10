
import React, { ReactNode } from 'react';
import Layout from "@/components/Layout";
import { CosmicContainer } from "@/components/sacred-geometry";

interface MainLayoutProps {
  children: ReactNode;
  theme?: 'cosmic' | 'ethereal' | 'temple';
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  theme = 'cosmic' 
}) => (
  <Layout theme={theme}>
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  </Layout>
);

export default MainLayout;
