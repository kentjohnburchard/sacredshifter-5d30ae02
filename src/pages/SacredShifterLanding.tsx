
import React from 'react';
import { StarfieldBackground } from '@/components/sacred-geometry';

const EnhancedStarfield: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-black">
        <StarfieldBackground 
          density="medium" 
          opacity={0.3} 
          isStatic={false}
          starCount={200} 
          speed={0.5} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/60"></div>
    </div>
  );
};

// This is the main component that will be used in App.tsx
const SacredShifterLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <EnhancedStarfield />
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">Sacred Shifter</h1>
        
        {/* Content will be added here */}
        <div className="mt-10 text-center">
          <p className="text-xl">Begin your resonance journey</p>
        </div>
      </div>
    </div>
  );
};

export default SacredShifterLanding;
