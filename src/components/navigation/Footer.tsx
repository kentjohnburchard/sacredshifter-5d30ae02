
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
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
              <li><Link to="/journey-templates" className="text-xs text-[#800080]/90 hover:text-[#800080]">Healing Journeys</Link></li>
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
  );
};

export default Footer;
