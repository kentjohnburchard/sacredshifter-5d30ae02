
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const CosmicFooter: React.FC = () => {
  const footerLinks = [
    {
      title: "Sacred Practices",
      links: [
        { name: "Meditation", path: "/meditation" },
        { name: "Frequency Library", path: "/frequency-library" },
        { name: "Sacred Geometry", path: "/sacred-geometry" },
        { name: "Daily Rituals", path: "/practices" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Sacred Circle", path: "/circle" },
        { name: "Light Bearers", path: "/bearers" },
        { name: "Events", path: "/events" },
        { name: "Resources", path: "/resources" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "About", path: "/about" },
        { name: "FAQ", path: "/faq" },
        { name: "Support", path: "/support" },
        { name: "Contact", path: "/contact" }
      ]
    }
  ];

  return (
    <footer className="py-12 relative overflow-hidden">
      {/* Cosmic Background - Gentle Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Developer note: Animation is intentionally gentle with slow transitions 
            to ensure accessibility for users with sensory sensitivities */}
        <div className="absolute w-full h-full bg-black opacity-80 z-10"></div>
        <div className="stars-container absolute w-full h-full">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const animationDelay = Math.random() * 10;
            
            return (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full motion-reduce"
                style={{
                  width: size,
                  height: size,
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  delay: animationDelay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Sacred Shifter</h3>
            <p className="text-gray-400 text-sm">
              Elevate your consciousness through sacred geometry, frequency alignment,
              and harmonic resonance. Join our conscious community today.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-purple-300 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Sacred Shifter. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-400">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-400">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-400">
              Cookies
            </Link>
          </div>
          <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-500">
            Made with <Heart className="mx-1 h-3 w-3 text-pink-500" /> for conscious souls
          </div>
        </div>
      </div>
      
      {/* Accessibility Support */}
      <style jsx="false">{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default CosmicFooter;
