
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
      root.style.setProperty('--soul-glow', 'rgba(255, 105, 180, 0.25)');
    } else {
      root.classList.remove('veil-lifted');
      root.style.setProperty('--primary-glow', 'rgba(147, 51, 234, 0.15)');
      root.style.setProperty('--fractal-intensity', '1');
      root.style.setProperty('--soul-glow', 'rgba(147, 51, 234, 0.25)');
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
            {/* Enhanced visual elements for lifted veil mode */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full">
                {/* Upgraded subtle energy lines with animated pulse */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(242, 180, 255, .3) 25%, rgba(242, 180, 255, .3) 26%, transparent 27%, transparent 74%, rgba(242, 180, 255, .3) 75%, rgba(242, 180, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(242, 180, 255, .3) 25%, rgba(242, 180, 255, .3) 26%, transparent 27%, transparent 74%, rgba(242, 180, 255, .3) 75%, rgba(242, 180, 255, .3) 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                    animation: 'energyPulse 8s infinite alternate',
                  }}
                />
                
                {/* Enhanced radial glow with more dimensional depth */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent" 
                  style={{
                    animation: 'dimensionalPulse 12s infinite alternate',
                    filter: 'blur(80px)',
                  }}
                />
                
                {/* Light rays */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50vh]" 
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(255,105,180,0.1) 25%, transparent 80%)',
                      animation: 'lightRayRotate 20s infinite linear',
                      transform: 'rotate(0deg) scale(2)',
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New: Sacred ambient energy field (always present but subtle) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-blue-900/5 opacity-40"></div>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.1 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(147, 51, 234, 0.15), transparent 70%)',
            }}
          />
        </motion.div>
      </div>
    </>
  );
};

export default ThemeEnhancer;
