
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import PrimeSigilActivator from '@/components/sacred-geometry/PrimeSigilActivator';
import AboutSacredShifter from '@/components/AboutSacredShifter';

interface ThemeEnhancerProps {
  showAbout?: boolean;
  onToggleAbout?: () => void;
}

const ThemeEnhancer: React.FC<ThemeEnhancerProps> = ({ 
  showAbout = false,
  onToggleAbout = () => {}
}) => {
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
    } else {
      root.classList.remove('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(147, 51, 234, 0.15)');
      root.style.setProperty('--fractal-intensity', '1');
    }
    
  }, [liftTheVeil]);

  return (
    <>
      {/* Sacred Glyph Activator positioned at the top right */}
      <div className="fixed top-4 right-4 z-40">
        <div onClick={onToggleAbout} className="cursor-pointer">
          <PrimeSigilActivator size="md" withTooltip={true} />
        </div>
      </div>
      
      {/* About Sacred Shifter Modal - conditionally rendered */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <button 
                className="absolute right-4 top-4 text-white/60 hover:text-white z-10"
                onClick={onToggleAbout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <AboutSacredShifter />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
