
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PrimeSigilActivator from '@/components/sacred-geometry/PrimeSigilActivator';

const ThemeEnhancer: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  // Apply global CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    console.log("ThemeEnhancer effect updating UI, liftTheVeil:", liftTheVeil);
    
    // Apply different logo hue/filter when veil is lifted
    const logo = document.querySelector('.app-logo') as HTMLElement;
    if (logo) {
      if (liftTheVeil) {
        logo.style.filter = 'hue-rotate(40deg) brightness(1.05)';
      } else {
        logo.style.filter = '';
      }
    }
    
    // Apply global theme changes
    if (liftTheVeil) {
      root.classList.add('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(255, 105, 180, 0.6)');
      root.style.setProperty('--fractal-intensity', '1.8');
      
      // Force navigation elements to update their styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.add('veil-lifted-nav');
      });
      
      // Add visual feedback when veil is lifted
      console.log('Veil lifted - consciousness expanded');
    } else {
      root.classList.remove('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(147, 51, 234, 0.5)');
      root.style.setProperty('--fractal-intensity', '1.2');
      
      // Reset navigation styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('veil-lifted-nav');
      });
      
      console.log('Standard consciousness mode');
    }
    
  }, [liftTheVeil]);

  return (
    <>
      {/* Sacred Glyph Activator positioned at the top right */}
      <div className="fixed top-4 right-4 z-40">
        <PrimeSigilActivator size="md" />
      </div>
      
      <AnimatePresence>
        {liftTheVeil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 pointer-events-none z-0"
          >
            {/* Enhanced visual elements for lifted veil mode */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                {/* Enhanced energy lines with higher opacity */}
                <div className="absolute top-0 left-0 w-full h-full opacity-35"
                  style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 105, 180, .7) 25%, rgba(255, 105, 180, .7) 26%, transparent 27%, transparent 74%, rgba(255, 105, 180, .7) 75%, rgba(255, 105, 180, .7) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 105, 180, .7) 25%, rgba(255, 105, 180, .7) 26%, transparent 27%, transparent 74%, rgba(255, 105, 180, .7) 75%, rgba(255, 105, 180, .7) 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                  }}
                />
                
                {/* Enhanced radial glow with higher opacity */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] rounded-full bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-transparent" 
                  style={{
                    animation: 'pulse 8s infinite alternate',
                    filter: 'blur(80px)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeEnhancer;
