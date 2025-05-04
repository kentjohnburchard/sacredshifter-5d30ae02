
import React from "react";
import { Link } from "react-router-dom";
import { TrademarkedName } from "@/components/ip-protection";
import { Map, Heart, Music, BookOpen, User, Settings, Mail, Home, Sparkles, Brain, BookOpen as BookOpenIcon } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#9966FF]/10 to-[#bf99ff]/5 border-t border-purple-100 py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7510c9] to-[#4d00ff]">
              <TrademarkedName>Sacred Shifter</TrademarkedName>
            </h3>
            <p className="text-sm text-[#800080]/90">
              Elevate your consciousness through sacred sound frequencies and intentions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#800080]">Main Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/sacred-blueprint" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Sacred Blueprint</span>
                </Link>
              </li>
              <li>
                <Link to="/shift-perception" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  <span>Shift Perception</span>
                </Link>
              </li>
              <li>
                <Link to="/heart-center" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>Heart Center</span>
                </Link>
              </li>
              <li>
                <Link to="/sacred-spectrum" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <BookOpenIcon className="h-3 w-3" />
                  <span>Sacred Spectrum</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#800080]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-founder" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>About the Founder</span>
                </Link>
              </li>
              <li>
                <Link to="/site-map" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Map className="h-3 w-3" />
                  <span>Site Map</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-[#800080]/90 hover:text-[#800080] flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>Contact</span>
                </Link>
              </li>
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
              <li>
                <Link to="/sacred-ip" className="text-xs text-[#800080]/90 hover:text-[#800080]">
                  Our Sacred IP
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#800080]">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-xs text-[#800080]/90 hover:text-[#800080]">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-xs text-[#800080]/90 hover:text-[#800080]">
                  Subscription
                </Link>
              </li>
              <li>
                <Link to="/personal-vibe" className="text-xs text-[#800080]/90 hover:text-[#800080]">
                  My Vibe Settings
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-xs text-[#800080]/90 hover:text-[#800080]">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-[#9966FF]/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-[#800080]/70">
            © {new Date().getFullYear()} Sacred Shifter. All rights reserved.
          </p>
          <Link 
            to="/site-map"
            className="mt-2 sm:mt-0 text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800"
          >
            <Map className="h-3 w-3" />
            <span>View Complete Site Map</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
