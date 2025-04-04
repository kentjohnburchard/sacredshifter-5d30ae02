
import React from "react";
import Header from "./Header"; // Using the main Header instead of navigation/Header
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
      <main className="flex-1 pt-64 pb-8">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
