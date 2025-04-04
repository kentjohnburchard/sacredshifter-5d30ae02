
import React from "react";
import Header from "./navigation/Header";
import Footer from "./navigation/Footer";
import Watermark from "./Watermark";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Logo Watermark */}
      <Watermark />

      {/* Navigation Bar */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-32 pb-8">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
