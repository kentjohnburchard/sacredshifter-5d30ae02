
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
  }, [intensity, equations]);
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Mathematical canvas background */}
      <BackgroundCanvas equations={equations} />
      
      {/* Added Sacred Grid background with higher intensity for more visible geometric patterns */}
      <SacredGridBackground 
        intensity={liftTheVeil ? 2.0 : 1.5}
        color={liftTheVeil ? '#FF70E9' : '#9b87f5'}
        pulseSpeed={1.5}
      />
      
      {/* Geometric patterns overlay with increased opacity */}
      <GeometricPatterns patternCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5} />
      
      {/* Enhanced gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MathematicalBackground;
