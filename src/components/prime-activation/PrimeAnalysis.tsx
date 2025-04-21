
import React from 'react';
import { Star } from 'lucide-react';

interface PrimeAnalysisProps {
  profile: {
    leftPalmReading: {
      soulBlueprint: string;
      dominantLines: string[];
      primeNumbers: number[];
      energeticFrequencies: number[];
      chakraAlignment: string;
    };
    rightPalmReading: {
      currentPath: string;
      dominantLines: string[];
      primeNumbers: number[];
      energeticFrequencies: number[];
      chakraAlignment: string;
    };
    transition: {
      status: string;
      from: string;
      recommendedFrequency: number;
      affirmation: string;
    };
  };
}

const PrimeAnalysis: React.FC<PrimeAnalysisProps> = ({ profile }) => {
  const { leftPalmReading, rightPalmReading, transition } = profile;
  
  const getPrimeDescription = (prime: number) => {
    const descriptions: Record<number, string> = {
      2: "Balance & Duality",
      3: "Creation & Expression",
      5: "Change & Adaptation",
      7: "Mysticism & Inner Wisdom",
      11: "Spiritual Enlightenment",
      13: "Transformation & Rebirth",
      17: "Intuition & The Seer",
      19: "Personal Will & Leadership",
      23: "Truth-seeking & Perception",
      29: "Self-Discovery",
      31: "Creative Expansion"
    };
    
    return descriptions[prime] || "Divine Alignment";
  };
  
  const getFrequencyColor = (freq: number) => {
    // Map frequencies to chakra colors
    if (freq < 256) return "bg-red-500"; // Root - Red
    if (freq < 288) return "bg-orange-500"; // Sacral - Orange
    if (freq < 320) return "bg-yellow-500"; // Solar Plexus - Yellow
    if (freq < 341) return "bg-green-500"; // Heart - Green
    if (freq < 384) return "bg-blue-500"; // Throat - Blue
    if (freq < 426) return "bg-indigo-500"; // Third Eye - Indigo
    return "bg-violet-500"; // Crown - Purple
  };
  
  const getChakraIcon = (chakra: string) => {
    if (chakra.includes("Root")) return "🔴";
    if (chakra.includes("Sacral")) return "🟠";
    if (chakra.includes("Solar")) return "🟡";
    if (chakra.includes("Heart")) return "💚";
    if (chakra.includes("Throat")) return "🔵";
    if (chakra.includes("Third Eye")) return "🟣";
    if (chakra.includes("Crown")) return "✨";
    return "🔮";
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-playfair text-center mb-6 text-amber-200">Prime Number Alignment</h2>
      
      <div className="mb-8 p-4 rounded-lg bg-black/30 backdrop-blur">
        <div className="flex items-center justify-center mb-4">
          <Star className="h-6 w-6 text-amber-300 mr-2" />
          <h3 className="text-xl text-purple-200">Your Vibrational Transition</h3>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-lg font-medium">{transition.status}: {transition.from}</p>
          <p className="mt-2 text-amber-200 font-playfair italic">{transition.affirmation}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 rounded-lg text-center">
          <p className="text-sm mb-2">Recommended Activation Frequency</p>
          <div className="inline-block px-4 py-2 rounded-full bg-amber-600/30 text-amber-200 font-bold text-xl">
            {transition.recommendedFrequency} Hz
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Palm Analysis */}
        <div className="bg-blue-900/20 backdrop-blur rounded-lg p-5 border border-blue-500/30">
          <h3 className="text-lg font-medium text-blue-300 mb-3">Soul Blueprint</h3>
          <p className="text-xl mb-4 font-playfair">{leftPalmReading.soulBlueprint}</p>
          
          <div className="mb-4">
            <h4 className="text-sm text-blue-200 mb-2">Dominant Lines</h4>
            <div className="flex flex-wrap gap-2">
              {leftPalmReading.dominantLines.map(line => (
                <span key={line} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200">
                  {line} Line
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm text-blue-200 mb-2">Chakra Alignment</h4>
            <div className="px-3 py-1 inline-block rounded-full bg-indigo-500/30 text-white">
              {getChakraIcon(leftPalmReading.chakraAlignment)} {leftPalmReading.chakraAlignment}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-blue-200 mb-2">Prime Numbers & Meanings</h4>
            <ul className="space-y-2">
              {leftPalmReading.primeNumbers.map(prime => (
                <li key={prime} className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/40 text-white">
                    {prime}
                  </span>
                  <span className="text-sm">{getPrimeDescription(prime)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Right Palm Analysis */}
        <div className="bg-purple-900/20 backdrop-blur rounded-lg p-5 border border-purple-500/30">
          <h3 className="text-lg font-medium text-purple-300 mb-3">Current Path</h3>
          <p className="text-xl mb-4 font-playfair">{rightPalmReading.currentPath}</p>
          
          <div className="mb-4">
            <h4 className="text-sm text-purple-200 mb-2">Dominant Lines</h4>
            <div className="flex flex-wrap gap-2">
              {rightPalmReading.dominantLines.map(line => (
                <span key={line} className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-200">
                  {line} Line
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm text-purple-200 mb-2">Chakra Alignment</h4>
            <div className="px-3 py-1 inline-block rounded-full bg-yellow-500/30 text-white">
              {getChakraIcon(rightPalmReading.chakraAlignment)} {rightPalmReading.chakraAlignment}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-purple-200 mb-2">Prime Numbers & Meanings</h4>
            <ul className="space-y-2">
              {rightPalmReading.primeNumbers.map(prime => (
                <li key={prime} className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/40 text-white">
                    {prime}
                  </span>
                  <span className="text-sm">{getPrimeDescription(prime)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-purple-200 mb-3">Prime Number Spiral Visualization</p>
        <div className="w-full h-48 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="w-40 h-40 relative">
            {/* Simplified prime spiral visualization */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute inset-6 rounded-full border-2 border-pink-500/30 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            
            {/* Prime number points */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 animate-ping"></div>
            
            {profile.leftPalmReading.primeNumbers.concat(profile.rightPalmReading.primeNumbers).map((prime, index) => {
              const angle = (index * Math.PI * 0.5) % (Math.PI * 2);
              const distance = 50 + (prime % 10) * 5;
              const x = Math.cos(angle) * distance + 50;
              const y = Math.sin(angle) * distance + 50;
              
              return (
                <div 
                  key={prime + index}
                  className="absolute w-2 h-2 rounded-full bg-amber-400"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeAnalysis;
