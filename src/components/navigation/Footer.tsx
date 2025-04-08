
import React from "react";
import { Link } from "react-router-dom";
import { TrademarkedName } from "@/components/ip-protection";
import { activePages } from "@/config/navigation";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 bg-gradient-to-r from-[#9966FF]/10 to-[#bf99ff]/5">
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
              {activePages.home && (
                <li><Link to="/" className="text-xs text-[#800080]/90 hover:text-[#800080]">Home</Link></li>
              )}
              {activePages.sacredBlueprint && (
                <li><Link to="/sacred-blueprint" className="text-xs text-[#800080]/90 hover:text-[#800080]">Sacred Blueprint™</Link></li>
              )}
              {activePages.frequencyLibrary && (
                <li><Link to="/frequency-library" className="text-xs text-[#800080]/90 hover:text-[#800080]">Frequency Library</Link></li>
              )}
              {activePages.heartCenter && (
                <li><Link to="/heart-center" className="text-xs text-[#800080]/90 hover:text-[#800080]">Heart Center</Link></li>
              )}
              {activePages.trinityGateway && (
                <li><Link to="/trinity-gateway" className="text-xs text-[#800080]/90 hover:text-[#800080]">Trinity Gateway™</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#800080]">Resources</h3>
            <ul className="space-y-2">
              {activePages.aboutFounder && (
                <li><Link to="/about-founder" className="text-xs text-[#800080]/90 hover:text-[#800080]">About the Founder</Link></li>
              )}
              {activePages.contact && (
                <li><Link to="/contact" className="text-xs text-[#800080]/90 hover:text-[#800080]">Contact</Link></li>
              )}
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
              <li><Link to="/sacred-ip" className="text-xs text-[#800080]/90 hover:text-[#800080]">Our Sacred IP</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#800080]">Account</h3>
            <ul className="space-y-2">
              {activePages.profile && (
                <li><Link to="/profile" className="text-xs text-[#800080]/90 hover:text-[#800080]">My Profile</Link></li>
              )}
              {activePages.subscription && (
                <li><Link to="/subscription" className="text-xs text-[#800080]/90 hover:text-[#800080]">Subscription</Link></li>
              )}
              <li><Link to="/auth" className="text-xs text-[#800080]/90 hover:text-[#800080]">Sign In</Link></li>
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
  );
};

export default Footer;
