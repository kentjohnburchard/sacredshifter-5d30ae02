
import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./navigation/Footer";
import Watermark from "./Watermark";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Logo Watermark */}
      <Watermark />

      {/* Sidebar Navigation */}
      <div className="md:flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 md:ml-64">
          {/* Page Title */}
          {pageTitle && (
            <div className="w-full pt-8 pb-4 px-4 sm:px-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-light">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  {pageTitle}
                </span>
              </h1>
            </div>
          )}
          
          {/* Main Content */}
          <main className="flex-1 pb-8 px-4 sm:px-6">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile Sidebar (empty div for offset since the sidebar component already has mobile navigation) */}
      <div className="md:hidden">
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default Layout;
