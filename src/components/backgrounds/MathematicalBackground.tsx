
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
  
  return (
    <div className={`relative min-h-screen overflow-hidden bg-black ${liftTheVeil ? 'cosmic-background' : ''}`}>
      {/* Mathematical canvas background */}
      <BackgroundCanvas equations={equations} />
      
      {/* Sacred Grid background - enhancing visibility */}
      <div className="absolute inset-0 opacity-70"> {/* Increased opacity */}
        <SacredGridBackground 
          intensity={liftTheVeil ? 0.9 : 0.8}
          color={liftTheVeil ? '#FF70E9' : '#9b87f5'}
          pulseSpeed={liftTheVeil ? 0.8 : 0.6}
        />
      </div>
      
      {/* Geometric patterns overlay with increased opacity */}
      <div className="absolute inset-0 opacity-60"> {/* Increased opacity */}
        <GeometricPatterns 
          triangleCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
          circleCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
          squareCount={intensity === 'high' ? 9 : intensity === 'medium' ? 7 : 5}
        />
      </div>
      
      {/* Enhanced gradient overlay for better contrast */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        liftTheVeil 
          ? 'from-pink-900/35 via-transparent to-fuchsia-900/35' 
          : 'from-black/35 via-transparent to-black/35'
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
