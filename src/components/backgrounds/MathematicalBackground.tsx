
import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';
import GeometricPatterns from './GeometricPatterns';

interface MathematicalBackgroundProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

const MathematicalBackground: React.FC<MathematicalBackgroundProps> = ({ 
  children,
  intensity = 'medium' 
}) => {
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
      'H|ψ⟩ = E|ψ⟩'
    );
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Mathematical canvas background */}
      <BackgroundCanvas equations={equations} />
      
      {/* Geometric patterns overlay */}
      <GeometricPatterns patternCount={intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3} />
      
      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none"></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MathematicalBackground;
