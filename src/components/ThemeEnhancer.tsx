
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientBackground from '@/components/circle/AmbientBackground';
import { ChakraTag } from '@/types/chakras';
import { getAmbientChakraForRoute, getBackgroundIntensity } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const ThemeEnhancer: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const { pathname } = useLocation();
  
  // Apply global CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply global theme changes
    if (liftTheVeil) {
      root.classList.add('veil-lifted');
      root.classList.remove('standard-mode');
      root.classList.add('veil-mode');
      
      // Update CSS variables for veil-lifted mode
      root.style.setProperty('--primary-glow', 'rgba(236, 72, 153, 0.6)');
      root.style.setProperty('--accent-color', '#ec4899');
      root.style.setProperty('--accent-secondary', '#f472b6');
      root.style.setProperty('--sacred-glass-bg', 'rgba(20, 15, 35, 0.7)');
      root.style.setProperty('--sacred-glass-border', 'rgba(236, 72, 153, 0.15)');
      
      // Add sacred-app class to body
      document.body.classList.add('sacred-app');
      
      // Force navigation elements to update their styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.add('veil-lifted-nav');
      });
      
      // Apply sacred styles to common UI components
      applyThemeToComponents('veil');
    } else {
      root.classList.remove('veil-lifted');
      root.classList.remove('veil-mode');
      root.classList.add('standard-mode');
      
      // Update CSS variables for standard mode
      root.style.setProperty('--primary-glow', 'rgba(168, 85, 247, 0.5)');
      root.style.setProperty('--accent-color', '#a855f7');
      root.style.setProperty('--accent-secondary', '#9333ea');
      root.style.setProperty('--sacred-glass-bg', 'rgba(15, 14, 31, 0.6)');
      root.style.setProperty('--sacred-glass-border', 'rgba(155, 135, 245, 0.15)');
      
      // Add sacred-app class to body
      document.body.classList.add('sacred-app');
      
      // Reset navigation styling
      document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('veil-lifted-nav');
      });
      
      // Apply sacred styles to common UI components
      applyThemeToComponents('standard');
    }
    
  }, [liftTheVeil]);
  
  // Helper function to apply theme to common UI components
  const applyThemeToComponents = (mode: 'standard' | 'veil') => {
    // Apply to cards
    document.querySelectorAll('.card').forEach(el => {
      el.classList.add('sacred-card');
    });
    
    // Apply to inputs
    document.querySelectorAll('input').forEach(el => {
      if (!el.classList.contains('sacred-input')) {
        el.classList.add('sacred-input');
      }
    });
    
    // Apply to buttons that aren't already styled
    document.querySelectorAll('button').forEach(el => {
      if (!el.classList.contains('sacred-button') && 
          !el.classList.contains('btn-icon') && 
          !el.classList.contains('btn-ghost')) {
        el.classList.add('sacred-button');
      }
    });
  };

  // Determine active chakra based on the route and veil state
  // Make sure to use the proper casing for chakra values according to the ChakraTag type
  const activeChakra: ChakraTag = liftTheVeil ? 'Heart' : getAmbientChakraForRoute(pathname);
  const intensity = getBackgroundIntensity(pathname);
  
  return (
    <>
      {/* AmbientBackground for neon glow circles on every page */}
      <AmbientBackground 
        activeChakra={activeChakra} 
        intensity={intensity} 
        pulsing={true} 
      />
    
      <AnimatePresence>
        {/* Background grid pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none z-0"
          key="grid-pattern"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `linear-gradient(0deg, transparent 24%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 25%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 26%, transparent 27%, transparent 74%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 75%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 25%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 26%, transparent 27%, transparent 74%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 75%, ${liftTheVeil ? 'rgba(236, 72, 153, .5)' : 'rgba(155, 135, 245, .3)'} 76%, transparent 77%, transparent)`,
                backgroundSize: '50px 50px',
                filter: 'blur(1px)',
              }}
            />
          </div>
        </motion.div>
        
        {/* Radial glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none z-0"
          key="radial-glow"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] rounded-full" 
            style={{
              background: `radial-gradient(circle, ${liftTheVeil ? 'rgba(236, 72, 153, 0.15)' : 'rgba(155, 135, 245, 0.15)'} 0%, ${liftTheVeil ? 'rgba(168, 85, 247, 0.1)' : 'rgba(98, 147, 232, 0.1)'} 40%, transparent 70%)`,
              animation: 'pulse 8s infinite alternate',
              filter: 'blur(80px)',
            }}
          />
        </motion.div>
        
        {/* Special veil-lifted effects */}
        {liftTheVeil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 pointer-events-none z-0"
            key="veil-lifted-effects"
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
        
        {/* Add stars to background */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 60px 110px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 80px 150px, #ffffff, rgba(0,0,0,0))`,
            backgroundSize: '200px 200px',
            animation: 'stars-move 100s linear infinite',
          }}
        />
        
        {/* CSS animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes stars-move {
            0% { background-position: 0 0; }
            100% { background-position: 200px 200px; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          `
        }} />
      </AnimatePresence>
    </>
  );
};

export default ThemeEnhancer;
