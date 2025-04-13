
import React from "react";
import { Link } from "react-router-dom";
import { TrademarkedName } from "@/components/ip-protection";
import { Map, Home, Heart, Sparkles, Brain, User } from "lucide-react";
import { useFooterVisibility } from "@/hooks/useFooterVisibility";

const FixedFooter: React.FC = () => {
  const { isVisible } = useFooterVisibility();

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#9966FF]/10 to-[#bf99ff]/5 border-t border-purple-100 py-3 sm:py-4 px-2 sm:px-4 shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
            <Link to="/" className="text-xs flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <Home className="h-3 w-3" />
              <span>Home</span>
            </Link>
            <Link to="/heart-center" className="text-xs flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <Heart className="h-3 w-3" />
              <span>Heart</span>
            </Link>
            <Link to="/sacred-blueprint" className="text-xs flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <Sparkles className="h-3 w-3" />
              <span>Blueprint</span>
            </Link>
            <Link to="/shift-perception" className="text-xs flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <Brain className="h-3 w-3" />
              <span>Perception</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <Link to="/profile" className="flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <User className="h-3 w-3" />
              <span>Profile</span>
            </Link>
            <Link to="/site-map" className="flex items-center gap-1 text-[#800080]/90 hover:text-[#800080]">
              <Map className="h-3 w-3" />
              <span>Site Map</span>
            </Link>
            <span className="text-[#800080]/70 text-[10px] sm:text-xs">© {new Date().getFullYear()} <TrademarkedName>Sacred Shifter</TrademarkedName></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedFooter;
