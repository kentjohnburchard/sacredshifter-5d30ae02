
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';

interface AppThemeProps {
  children: React.ReactNode;
  chakraColor?: string;
  showVisualizer?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * AppTheme - Core theming component that applies the Sacred Circle aesthetic site-wide
 * This component provides consistent background styling, animations and theme context
 */
const AppTheme: React.FC<AppThemeProps> = ({
  children,
  chakraColor,
  showVisualizer = true,
  intensity = 'medium',
}) => {
  const { liftTheVeil } = useTheme();
  
  // Calculate opacity based on intensity
  const visualizerOpacity = {
    low: 0.2,
    medium: 0.3,
    high: 0.4
  }[intensity];
  
  // Calculate glow intensity based on theme
  const glowIntensity = liftTheVeil ? '60' : '40';
  const glowColor = liftTheVeil ? 'rgba(255, 105, 180, 0.' : 'rgba(138, 43, 226, 0.';
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed position background elements */}
      <div className="fixed inset-0 w-full h-full z-0">
        {showVisualizer && (
          <JourneyAwareSpiralVisualizer 
            showControls={false} 
            containerId="backgroundSpiral"
            className={`opacity-${Math.round(visualizerOpacity * 100)}`}
          />
        )}
        
        {/* Overlay with increased opacity for better text readability */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none" />
        
        {/* Chakra-colored overlay gradient based on chakraColor prop */}
        {chakraColor && (
          <div 
            className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
            style={{
              background: `radial-gradient(circle at center, ${chakraColor}30 0%, transparent 70%)`,
              boxShadow: `inset 0 0 100px ${chakraColor}${glowIntensity}`,
            }}
          />
        )}
        
        {/* Additional cosmic grid effect */}
        <div 
          className="fixed inset-0 bg-grid-pattern opacity-10 z-0 pointer-events-none"
          style={{ backgroundSize: '30px 30px' }}
        />
        
        {/* Dynamic glowing orbs */}
        {intensity !== 'low' && (
          <>
            <motion.div
              className="fixed rounded-full w-64 h-64 blur-3xl opacity-20 z-0 pointer-events-none"
              style={{ background: liftTheVeil ? 'rgba(255, 105, 180, 0.3)' : 'rgba(138, 43, 226, 0.3)' }}
              initial={{ x: '10vw', y: '20vh' }}
              animate={{ 
                x: ['10vw', '15vw', '10vw'],
                y: ['20vh', '25vh', '20vh'],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="fixed rounded-full w-96 h-96 blur-3xl opacity-10 z-0 pointer-events-none"
              style={{ background: liftTheVeil ? 'rgba(255, 105, 180, 0.2)' : 'rgba(138, 43, 226, 0.2)' }}
              initial={{ x: '80vw', y: '70vh' }}
              animate={{ 
                x: ['80vw', '75vw', '80vw'],
                y: ['70vh', '75vh', '70vh'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>
      
      {/* Content container with elevated z-index */}
      <div className={`relative z-10 min-h-screen ${liftTheVeil ? 'veil-mode' : 'standard-mode'}`}>
        {children}
      </div>
    </div>
  );
};

export default AppTheme;
