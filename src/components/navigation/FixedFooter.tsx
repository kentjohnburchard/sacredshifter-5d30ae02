
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, BookOpen, Star, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const FixedFooter: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  const navItems = [
    { label: 'Sound Journeys', icon: <Music className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/journey-templates' },
    { label: 'Hermetic Wisdom', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/hermetic-wisdom' },
    { label: 'Heart Center', icon: <Heart className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/heart-center' },
    { label: 'Manifestation', icon: <Wand2 className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/intentions' },
    { label: 'Astrology', icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />, path: '/astrology' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-purple-500/20"
    >
      <div className="flex justify-center items-center py-2">
        <div className="flex justify-around w-full max-w-xl">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center text-center p-1"
            >
              <div className={`p-1.5 rounded-full ${liftTheVeil ? 'bg-pink-900/40' : 'bg-purple-900/40'} transition-colors`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 text-gray-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Frequency indicator */}
      <div className="text-center pb-1 text-xs text-purple-300">
        528Hz · Heart Chakra
      </div>
    </motion.footer>
  );
};

export default FixedFooter;
