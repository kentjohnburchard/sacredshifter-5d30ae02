
import React from "react";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Music, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface CosmicFooterProps {
  showFrequencyBar?: boolean;
  currentFrequency?: number;
  currentChakra?: string;
  className?: string;
}

const CosmicFooter: React.FC<CosmicFooterProps> = ({
  showFrequencyBar = false,
  currentFrequency,
  currentChakra,
  className = "",
}) => {
  const getChakraColor = (chakra?: string): string => {
    switch (chakra?.toLowerCase()) {
      case 'root': return 'bg-red-500';
      case 'sacral': return 'bg-orange-500';
      case 'solar plexus': return 'bg-yellow-500';
      case 'heart': return 'bg-green-500';
      case 'throat': return 'bg-blue-500';
      case 'third eye': return 'bg-indigo-500';
      case 'crown': return 'bg-purple-500';
      default: return 'bg-purple-500';
    }
  };
  
  const footerLinks = [
    { name: "Sound Journeys", icon: <Music className="h-3 w-3 sm:h-4 sm:w-4" />, path: "/journey-templates" },
    { name: "Hermetic Wisdom", icon: <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />, path: "/hermetic-wisdom" },
    { name: "Heart Center", icon: <Heart className="h-3 w-3 sm:h-4 sm:w-4" />, path: "/heart-center" },
    { name: "Sacred Blueprint", icon: <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />, path: "/sacred-blueprint" },
    { name: "Astrology", icon: <Star className="h-3 w-3 sm:h-4 sm:w-4" />, path: "/astrology" },
  ];
  
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-0 w-full bg-black/70 backdrop-blur-lg border-t border-purple-900/50 text-white py-1 sm:py-2 px-2 sm:px-4 z-30 ${className}`}
    >
      {showFrequencyBar && currentFrequency && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="relative h-1 w-full mb-2 sm:mb-3"
        >
          <div className="absolute inset-0 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getChakraColor(currentChakra)}`}
              style={{ width: `${Math.min(100, (currentFrequency / 963) * 100)}%` }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <div className="absolute -top-5 sm:-top-6 left-0 right-0 text-center text-[10px] sm:text-xs">
            <span className="bg-black/70 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
              {currentFrequency}Hz {currentChakra ? `· ${currentChakra} Chakra` : ''}
            </span>
          </div>
        </motion.div>
      )}
      
      <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 sm:gap-x-6">
        {footerLinks.map((link) => (
          <Link 
            key={link.name}
            to={link.path}
            className="group relative flex flex-col items-center justify-center text-[10px] sm:text-xs"
          >
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 group-hover:from-purple-700 group-hover:to-indigo-700"
            >
              {link.icon}
              <motion.span 
                className="absolute -top-6 sm:-top-8 bg-black/80 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {link.name}
              </motion.span>
            </motion.div>
            <span className="mt-0.5 sm:mt-1 opacity-80 group-hover:opacity-100">{link.name}</span>
          </Link>
        ))}
      </div>
    </motion.footer>
  );
};

export default CosmicFooter;
