
import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import GeometricPatterns from './GeometricPatterns';

interface MathematicalBackgroundProps {
  children: React.ReactNode;
}

const MathematicalBackground: React.FC<MathematicalBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Mathematical canvas background */}
      <BackgroundCanvas />
      
      {/* Geometric patterns overlay */}
      <GeometricPatterns patternCount={3} />
      
      {children}
    </div>
  );
};

export default MathematicalBackground;
