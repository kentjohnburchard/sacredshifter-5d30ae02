
import React from "react";
import Header from "./Header"; // Using the main Header instead of navigation/Header
import Footer from "./navigation/Footer";
import Watermark from "./Watermark";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string; // Optional page title prop
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Logo Watermark */}
      <Watermark />

      {/* Navigation Bar */}
      <Header />
      
      {/* Page Title */}
      {pageTitle && (
        <div className="w-full pt-32 pb-4 px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-light">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              {pageTitle}
            </span>
          </h1>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 pb-8">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
