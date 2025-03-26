
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Logo Watermark */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-5 flex items-center justify-center">
        <img 
          src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
          alt="Sacred Shifter Watermark" 
          className="max-w-[50%] max-h-[50%] object-contain" 
        />
      </div>

      {/* Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
                alt="Sacred Shifter Logo" 
                className="h-64 w-auto"
              />
            </Link>
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/journeys" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/journeys") 
                    ? "text-purple-700" 
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                Journeys
              </Link>
              <Link 
                to="/energy-check" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/energy-check") 
                    ? "text-purple-700" 
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                Energy Check
              </Link>
              <Link 
                to="/alignment" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/alignment") 
                    ? "text-purple-700" 
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                Alignment
              </Link>
              <Link 
                to="/intentions" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/intentions") 
                    ? "text-purple-700" 
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                Intentions
              </Link>
              <Link 
                to="/music-generation" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/music-generation") 
                    ? "text-purple-700" 
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                Sound Creation
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-gray-600 hover:text-purple-500 focus:outline-none">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/journeys" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/journeys") 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                      }`}
                    >
                      Journeys
                    </Link>
                    <Link 
                      to="/energy-check" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/energy-check") 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                      }`}
                    >
                      Energy Check
                    </Link>
                    <Link 
                      to="/alignment" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/alignment") 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                      }`}
                    >
                      Alignment
                    </Link>
                    <Link 
                      to="/intentions" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/intentions") 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                      }`}
                    >
                      Intentions
                    </Link>
                    <Link 
                      to="/music-generation" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/music-generation") 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                      }`}
                    >
                      Sound Creation
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Sacred Shifter
              </h3>
              <p className="text-sm text-gray-600">
                Elevate your consciousness through sacred sound frequencies and intentions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/journeys" className="text-xs text-gray-600 hover:text-purple-500">Sound Journeys</Link></li>
                <li><Link to="/energy-check" className="text-xs text-gray-600 hover:text-purple-500">Energy Check</Link></li>
                <li><Link to="/alignment" className="text-xs text-gray-600 hover:text-purple-500">Chakra Alignment</Link></li>
                <li><Link to="/intentions" className="text-xs text-gray-600 hover:text-purple-500">Set Intentions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-600 hover:text-purple-500">Instagram</a></li>
                <li>
                  <a 
                    href="https://www.youtube.com/@sacredshifter" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-gray-600 hover:text-purple-500"
                  >
                    YouTube
                  </a>
                </li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-purple-500">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
