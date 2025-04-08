
import React from "react";
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
  React.useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-purple-50 to-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        <main className="flex-1 p-6">
          {pageTitle && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            </div>
          )}
          {children}
        </main>
        
        {/* Sacred Message - Cosmic Quote */}
        <div className="w-full text-center mb-4">
          <p className="text-sm text-gray-600 italic">
            {currentQuote}
          </p>
        </div>
        
        {/* Legal Footer */}
        {!hideLegalFooter && (
          <div className="border-t border-purple-100 py-2">
            <LegalFooter variant="standard" />
          </div>
        )}
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Watermarks */}
      <Watermark />
      <GlobalWatermark />
    </div>
  );
};

export default Layout;
