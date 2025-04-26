import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import GeometricPatterns from './GeometricPatterns';
import SacredGridBackground from '@/components/visualization/SacredGridBackground';
import { useTheme } from '@/context/ThemeContext';

interface MathematicalBackgroundProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

const MathematicalBackground: React.FC<MathematicalBackgroundProps> = ({ 
  children,
  intensity = 'high' 
}) => {
  const { liftTheVeil } = useTheme();
  
  // Define equations based on intensity
  const equations = [
    'E = mc²',
    'eiπ + 1 = 0',
    'F = G(m₁m₂)/r²',
    'φ = (1 + √5)/2',
    'Σ 1/n² = π²/6',
  ];
  
  // Add more equations for higher intensity
  if (intensity === 'medium' || intensity === 'high') {
    equations.push(
      '∫ e^x dx = e^x + C',
      '∇×B = μ₀J + μ₀ε₀∂E/∂t'
    );
  }
  
  if (intensity === 'high') {
    equations.push(
      'ψ(r,t) = Ae^{i(k·r-ωt)}',
      'ds² = gᵢⱼdxⁱdxʲ',
      'H|ψ⟩ = E|ψ⟩',
      'δS = 0',
      'R_μν - ½Rg_μν = 8πG T_μν',
      '∇⋅E = ρ/ε₀'
    );
  }
  
  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log(`MathematicalBackground rendered with intensity: ${intensity}`);
    console.log(`Using ${equations.length} equations and ${intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3} geometric patterns`);
    console.log(`Current consciousness mode: ${liftTheVeil ? 'veil-lifted' : 'standard'}`);
  }, [intensity, equations, liftTheVeil]);
  
  return (
    <div className={`relative min-h-screen overflow-hidden bg-black ${liftTheVeil ? 'cosmic-background' : ''}`}>
      {/* Mathematical canvas background */}
      <BackgroundCanvas equations={equations} />
      
      {/* Sacred Grid background */}
      <SacredGridBackground 
        intensity={liftTheVeil ? 2.5 : 1.8}
        color={liftTheVeil ? '#FF70E9' : '#9b87f5'}
        pulseSpeed={liftTheVeil ? 1.8 : 1.5}
      />
      
      {/* Geometric patterns overlay with increased opacity */}
      <GeometricPatterns 
        triangleCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
        circleCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
        squareCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
      />
      
      {/* Enhanced gradient overlay for better contrast */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        liftTheVeil 
          ? 'from-pink-900/30 via-transparent to-fuchsia-900/30' 
          : 'from-black/30 via-transparent to-black/30'
      } pointer-events-none`}></div>
      
      {/* Added cosmic effects when veil is lifted */}
      {liftTheVeil && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-50 mix-blend-screen"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 105, 180, 0.4) 0%, transparent 50%)',
            }}
          ></div>
          <div className="absolute inset-0 opacity-50 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
            }}
          ></div>
        </div>
      )}
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MathematicalBackground;
