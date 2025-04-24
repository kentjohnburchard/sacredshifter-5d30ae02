
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PrimeSigilActivator from '@/components/sacred-geometry/PrimeSigilActivator';

const ThemeEnhancer: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  // Apply global CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
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
      root.style.setProperty('--primary-glow', 'rgba(255, 105, 180, 0.15)');
      root.style.setProperty('--fractal-intensity', '1.2');
      
      // Add visual feedback when veil is lifted
      console.log('Veil lifted - consciousness expanded');
    } else {
      root.classList.remove('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(147, 51, 234, 0.15)');
      root.style.setProperty('--fractal-intensity', '1');
      
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
            {/* Additional visual elements for lifted veil mode */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                {/* Subtle energy lines */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(242, 180, 255, .3) 25%, rgba(242, 180, 255, .3) 26%, transparent 27%, transparent 74%, rgba(242, 180, 255, .3) 75%, rgba(242, 180, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(242, 180, 255, .3) 25%, rgba(242, 180, 255, .3) 26%, transparent 27%, transparent 74%, rgba(242, 180, 255, .3) 75%, rgba(242, 180, 255, .3) 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                  }}
                />
                
                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] rounded-full bg-gradient-to-br from-pink-500/5 via-purple-500/2 to-transparent" 
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
