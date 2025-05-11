
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
  intensity = 'medium' 
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
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${liftTheVeil ? 'cosmic-background veil-mode' : 'standard-mode'}`}>
      {/* Fixed position background elements */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Mathematical canvas background */}
        <BackgroundCanvas equations={equations} />
        
        {/* Sacred Grid background with increased visibility */}
        <div className="absolute inset-0 opacity-80">
          <SacredGridBackground 
            intensity={liftTheVeil ? 0.9 : 0.8}
            color={liftTheVeil ? '#FF70E9' : '#9b87f5'}
            pulseSpeed={liftTheVeil ? 0.8 : 0.6}
          />
        </div>
        
        {/* Geometric patterns overlay */}
        <div className="absolute inset-0 opacity-40">
          <GeometricPatterns 
            triangleCount={intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3}
            circleCount={intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3}
            squareCount={intensity === 'high' ? 7 : intensity === 'medium' ? 5 : 3}
          />
        </div>
        
        {/* Semi-transparent gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          liftTheVeil 
            ? 'from-pink-900/20 via-transparent to-fuchsia-900/20' 
            : 'from-black/20 via-transparent to-black/20'
        } pointer-events-none`}></div>
        
        {/* Added cosmic effects when veil is lifted */}
        {liftTheVeil && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-30 mix-blend-screen"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 105, 180, 0.3) 0%, transparent 50%)',
              }}
            ></div>
            <div className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
              }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Content container with elevated z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MathematicalBackground;
