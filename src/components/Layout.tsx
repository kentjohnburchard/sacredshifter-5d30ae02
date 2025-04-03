
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
          className="max-w-[25%] max-h-[25%] object-contain" 
        />
      </div>

      {/* Navigation Bar */}
      <header className="w-full bg-[#bf99ff]/5 backdrop-blur-sm border-b border-[#9966FF]/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
                alt="Sacred Shifter Logo" 
                className="h-32 w-auto"
              />
            </Link>
            
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/journeys" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/journeys") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Journeys
              </Link>
              <Link 
                to="/energy-check" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/energy-check") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Energy Check
              </Link>
              <Link 
                to="/alignment" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/alignment") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Alignment
              </Link>
              <Link 
                to="/intentions" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/intentions") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Intentions
              </Link>
              <Link 
                to="/music-generation" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/music-generation") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Sound Creation
              </Link>
              <Link 
                to="/hermetic-wisdom" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/hermetic-wisdom") 
                    ? "text-[#7510c9]" 
                    : "text-[#7510c9]/70 hover:text-[#7510c9]"
                }`}
              >
                Hermetic Wisdom
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-[#7510c9]/70 hover:text-[#7510c9] focus:outline-none">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/journeys" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/journeys") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Journeys
                    </Link>
                    <Link 
                      to="/energy-check" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/energy-check") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Energy Check
                    </Link>
                    <Link 
                      to="/alignment" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/alignment") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Alignment
                    </Link>
                    <Link 
                      to="/intentions" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/intentions") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Intentions
                    </Link>
                    <Link 
                      to="/music-generation" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/music-generation") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Sound Creation
                    </Link>
                    <Link 
                      to="/hermetic-wisdom" 
                      className={`text-lg font-medium transition-colors px-4 py-2 rounded-md ${
                        isActive("/hermetic-wisdom") 
                          ? "bg-[#9966FF]/10 text-[#7510c9]" 
                          : "text-[#7510c9]/70 hover:bg-[#9966FF]/5 hover:text-[#7510c9]"
                      }`}
                    >
                      Hermetic Wisdom
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
      <footer className="w-full py-6 px-4 bg-gradient-to-r from-[#9966FF]/10 to-[#bf99ff]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7510c9] to-[#4d00ff]">
                Sacred Shifter
              </h3>
              <p className="text-sm text-[#800080]/90">
                Elevate your consciousness through sacred sound frequencies and intentions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#800080]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/journeys" className="text-xs text-[#800080]/90 hover:text-[#800080]">Sound Journeys</Link></li>
                <li><Link to="/energy-check" className="text-xs text-[#800080]/90 hover:text-[#800080]">Energy Check</Link></li>
                <li><Link to="/alignment" className="text-xs text-[#800080]/90 hover:text-[#800080]">Chakra Alignment</Link></li>
                <li><Link to="/intentions" className="text-xs text-[#800080]/90 hover:text-[#800080]">Set Intentions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#800080]">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-[#800080]/90 hover:text-[#800080]">Instagram</a></li>
                <li>
                  <a 
                    href="https://www.youtube.com/@sacredshifter" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-[#800080]/90 hover:text-[#800080]"
                  >
                    YouTube
                  </a>
                </li>
                <li><a href="#" className="text-xs text-[#800080]/90 hover:text-[#800080]">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-[#9966FF]/10 text-center">
            <p className="text-xs text-[#800080]/70">
              © {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
