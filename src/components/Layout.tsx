
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
  const { currentQuote, refreshQuote, currentTheme, currentElement } = useTheme();
  
  // Refresh quote on mount
  React.useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  // Create dynamic style based on the current theme
  const dynamicBackgroundStyle = {
    background: currentTheme || "linear-gradient(to right, #4facfe, #00f2fe)",
  };

  // Additional class based on element
  const getElementClass = () => {
    switch(currentElement) {
      case "fire": return "from-red-50 to-white";
      case "water": return "from-blue-50 to-white";
      case "earth": return "from-green-50 to-white";
      case "air": return "from-purple-50 to-white";
      default: return "from-purple-50 to-white";
    }
  };

  return (
    <div className={`min-h-screen flex bg-gradient-to-b ${getElementClass()}`}>
      {/* Theme Influence - Apply as a subtle overlay */}
      <div 
        className="fixed inset-0 opacity-10 -z-10" 
        style={dynamicBackgroundStyle}
      />
      
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
