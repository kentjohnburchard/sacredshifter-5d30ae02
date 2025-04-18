
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface PrimeNumberAffirmationsProps {
  enabled?: boolean;
}

// Prime number to affirmation mapping
const PRIME_AFFIRMATIONS: Record<number, string> = {
  // Common prime numbers and their affirmations
  2: "I am balanced and harmonious",
  3: "I manifest my desires with ease and grace",
  5: "I transform and evolve with each breath",
  7: "I am divinely protected and guided",
  11: "I am awakening to my highest potential",
  13: "I transcend limitations and embrace change",
  17: "I align with the infinite intelligence of the universe",
  19: "I channel healing energy through my being",
  23: "I resonate with divine harmony and sacred patterns",
  29: "I exist in perfect harmony with cosmic cycles",
  31: "I activate my dormant DNA to its highest potential",
  37: "I vibrate at the frequency of divine love",
  41: "I am coded with the sacred geometry of creation",
  43: "I am attuned to universal frequencies of abundance",
  47: "I access ancient wisdom through quantum consciousness",
  53: "I transmute dense energies into light",
  59: "I embody the golden ratio of divine proportion",
  61: "I am synchronized with galactic waves of evolution",
  67: "I am a conduit for cosmic frequencies of healing",
  71: "I am perfectly aligned with my soul mission",
  73: "I dissolve all barriers between dimensions",
  79: "I am activating my multidimensional awareness",
  83: "I am a vessel for sacred light codes",
  89: "I exist beyond the limits of space and time",
  97: "I am an infinite being having a temporary human experience",
  
  // Generic fallbacks for any other prime numbers
  101: "I am vibrating at higher frequencies of consciousness",
  127: "My DNA is awakening to its divine blueprint",
  163: "I am activating my full spiritual potential",
  211: "I am aligning with cosmic intelligence",
  257: "I am resonating with universal harmony",
  307: "I am a conduit for divine frequencies",
  401: "I am attuned to the sacred mathematics of creation",
  503: "I am embodying the sacred geometry of my soul",
  601: "I am transcending limiting beliefs",
  701: "I am vibrating at the frequency of pure love",
  809: "I am a divine expression of cosmic consciousness",
  907: "I am in perfect harmony with all that is",
};

// Find the closest prime number affirmation
const getClosestPrimeAffirmation = (prime: number): string => {
  // If we have an exact match, use it
  if (PRIME_AFFIRMATIONS[prime]) {
    return PRIME_AFFIRMATIONS[prime];
  }
  
  // Otherwise find the closest prime in our list
  const primes = Object.keys(PRIME_AFFIRMATIONS).map(Number);
  let closest = primes[0];
  let minDiff = Math.abs(prime - closest);
  
  for (const knownPrime of primes) {
    const diff = Math.abs(prime - knownPrime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = knownPrime;
    }
  }
  
  return PRIME_AFFIRMATIONS[closest];
};

const PrimeNumberAffirmations: React.FC<PrimeNumberAffirmationsProps> = ({ enabled = true }) => {
  const { activePrimeNumbers, registerPrimeCallback } = useGlobalAudioPlayer();
  const [activeAffirmations, setActiveAffirmations] = useState<Array<{prime: number, affirmation: string, id: string}>>([]);
  
  // Listen for new prime numbers and display affirmations
  useEffect(() => {
    if (!enabled) return;
    
    const handlePrimeDetected = (prime: number) => {
      const affirmation = getClosestPrimeAffirmation(prime);
      const id = `prime-${prime}-${Date.now()}`;
      
      setActiveAffirmations(prev => {
        // Add new affirmation to the beginning
        const updated = [{ prime, affirmation, id }, ...prev];
        // Keep only the last 3 affirmations
        return updated.slice(0, 3);
      });
      
      // Remove affirmation after 6 seconds
      setTimeout(() => {
        setActiveAffirmations(prev => prev.filter(item => item.id !== id));
      }, 6000);
    };
    
    // Register our callback
    const unregisterFn = registerPrimeCallback(handlePrimeDetected);
    
    return () => {
      if (unregisterFn) {
        unregisterFn();
      }
    };
  }, [enabled, registerPrimeCallback]);
  
  if (!enabled) return null;
  
  return (
    <div className="absolute inset-x-0 bottom-32 flex flex-col items-center z-30 pointer-events-none">
      <AnimatePresence>
        {activeAffirmations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mb-3 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-center max-w-md"
            style={{ marginTop: index > 0 ? '-10px' : '0' }}
          >
            <div className="text-xs text-purple-300 font-semibold mb-1">
              Prime Frequency: {item.prime}Hz
            </div>
            <div className="text-lg font-medium text-white">
              "{item.affirmation}"
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PrimeNumberAffirmations;
