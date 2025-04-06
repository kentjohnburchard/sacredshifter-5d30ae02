
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Footer from "./navigation/Footer";
import Watermark from "./Watermark";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const { kentMode, setKentMode, currentQuote, refreshQuote } = useTheme();
  
  // Refresh quote on mount
  useEffect(() => {
    refreshQuote();
  }, []);
  
  // Toggle Kent Mode
  const toggleKentMode = () => {
    setKentMode(!kentMode);
    toast.success(kentMode ? "Returning to standard consciousness" : "Kent Mode activated! Cosmic sass unlocked.", {
      icon: <Sparkles className={`${kentMode ? "text-purple-400" : "text-brand-aurapink"}`} />,
      position: "bottom-center"
    });
  };

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
          {/* Add top padding to account for header height */}
          <div className="pt-36">
            {/* Page Title - Standardized styling and centered on all devices */}
            {pageTitle && (
              <div className="w-full pb-6 px-4 sm:px-6 text-center">
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
                {kentMode ? <span className="kent-mode">{currentQuote}</span> : currentQuote}
              </p>
            </div>
            
            {/* Kent Mode Toggle */}
            <div className="fixed bottom-4 right-4 z-20">
              <button 
                onClick={toggleKentMode}
                className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full p-2 shadow-md hover:shadow-cosmic transition-all duration-300"
                title={kentMode ? "Disable Kent Mode" : "Enable Kent Mode"}
              >
                <Sparkles 
                  className={`h-4 w-4 ${kentMode ? 'text-brand-aurapink animate-pulse-subtle' : 'text-purple-400'}`} 
                />
              </button>
            </div>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (empty div for offset since the sidebar component already has mobile navigation) */}
      <div className="md:hidden">
        <div className="h-36"></div> {/* Adjusted height for the header on mobile */}
      </div>
    </div>
  );
};

export default Layout;
