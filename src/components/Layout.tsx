
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Footer from "./navigation/Footer";
import Watermark from "./Watermark";
import GlobalWatermark from "./GlobalWatermark";
import { useTheme } from "@/context/ThemeContext";
import { LegalFooter } from "./ip-protection";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  hideLegalFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, hideLegalFooter = false }) => {
  const { currentQuote, refreshQuote } = useTheme();
  
  // Refresh quote on mount
  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white relative">
      {/* Subtle starfield background */}
      <div className="starfield"></div>
      
      {/* Logo Watermark */}
      <Watermark />

      {/* Sidebar Navigation */}
      <div className="md:flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 md:ml-64">
          {/* Adjusted top padding to align content with sidebar */}
          <div className="pt-16">
            {/* Page Title - Standardized styling and aligned with sidebar */}
            {pageTitle && (
              <div className="w-full py-6 px-4 sm:px-6 text-center">
                <h1 className="page-title">
                  {pageTitle}
                </h1>
              </div>
            )}
            
            {/* Main Content */}
            <main className="flex-1 pb-8 px-4 sm:px-6">
              {children}
            </main>
            
            {/* Sacred Message - Cosmic Quote */}
            <div className="w-full text-center mb-4">
              <p className="sacred-footer-message">
                {currentQuote}
              </p>
            </div>
            
            {/* Legal Footer - Added IP protection */}
            {!hideLegalFooter && (
              <div className="border-t border-purple-100 py-2">
                <LegalFooter variant="standard" />
              </div>
            )}
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (empty div for offset since the sidebar component already has mobile navigation) */}
      <div className="md:hidden">
        <div className="h-16"></div> {/* Adjusted height for the header on mobile */}
      </div>
      
      {/* Global Watermark */}
      <GlobalWatermark />
    </div>
  );
};

export default Layout;
