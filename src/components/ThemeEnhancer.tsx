
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeEnhancer: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  // Apply global CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply global theme changes
    if (liftTheVeil) {
      root.classList.add('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(236, 72, 153, 0.6)');
      root.style.setProperty('--accent-color', '#ec4899');
      root.style.setProperty('--accent-secondary', '#f472b6');
      
      // Force navigation elements to update their styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.add('veil-lifted-nav');
      });
    } else {
      root.classList.remove('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(168, 85, 247, 0.5)');
      root.style.setProperty('--accent-color', '#a855f7');
      root.style.setProperty('--accent-secondary', '#9333ea');
      
      // Reset navigation styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('veil-lifted-nav');
      });
    }
    
  }, [liftTheVeil]);

  return (
    <AnimatePresence>
      {liftTheVeil && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-35"
              style={{
                backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(236, 72, 153, .5) 25%, rgba(236, 72, 153, .5) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, .5) 75%, rgba(236, 72, 153, .5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(236, 72, 153, .5) 25%, rgba(236, 72, 153, .5) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, .5) 75%, rgba(236, 72, 153, .5) 76%, transparent 77%, transparent)`,
                backgroundSize: '50px 50px',
                filter: 'blur(1px)',
              }}
            />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] rounded-full" 
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)',
                animation: 'pulse 8s infinite alternate',
                filter: 'blur(80px)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeEnhancer;
