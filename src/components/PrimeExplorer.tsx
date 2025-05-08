
import React, { useState, useRef, useEffect } from 'react';
import { isPrime } from '@/utils/primeCalculations';
// Remove calculatePrimeFactors import

interface PrimeExplorerProps {
  onPrimesChange: (primes: number[]) => void;
  audioContext: AudioContext | null;
  audioSourceNode: MediaElementAudioSourceNode | null;
  setVisualMode: (mode: string) => void;
}

const PrimeExplorer: React.FC<PrimeExplorerProps> = ({ 
  onPrimesChange, 
  audioContext, 
  audioSourceNode,
  setVisualMode
}) => {
  const [activePrimes, setActivePrimes] = useState<number[]>([]);
  const filterNodesRef = useRef<Map<number, BiquadFilterNode>>(new Map());
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // First 50 prime numbers
  const primes = Array.from({ length: 150 }, (_, i) => i + 2).filter(isPrime).slice(0, 50);
  
  // Setup gain node if audio context is available
  useEffect(() => {
    if (!audioContext || !audioSourceNode) return;
    
    // Create a gain node to chain all filters together
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;
    
    // Reconnect the source node to our gain node
    audioSourceNode.disconnect();
    audioSourceNode.connect(gainNode);
    
    return () => {
      if (audioSourceNode && gainNode) {
        audioSourceNode.disconnect();
        audioSourceNode.connect(audioContext.destination);
      }
    };
  }, [audioContext, audioSourceNode]);
  
  // Toggle prime filter
  const togglePrime = (prime: number) => {
    if (activePrimes.includes(prime)) {
      // Remove this prime
      setActivePrimes(prev => prev.filter(p => p !== prime));
      removeFilterForPrime(prime);
    } else {
      // Add this prime
      setActivePrimes(prev => [...prev, prime]);
      addFilterForPrime(prime);
    }
  };
  
  // Add a BiquadFilter for a prime
  const addFilterForPrime = (prime: number) => {
    if (!audioContext || !gainNodeRef.current) return;
    
    // Create a peaking filter at prime * 100 Hz
    const frequency = prime * 100;
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'peaking';
    filterNode.frequency.value = frequency;
    filterNode.Q.value = 10; // Narrow band
    filterNode.gain.value = 15; // Boost the frequency
    
    // Connect the filter
    filterNode.connect(audioContext.destination);
    gainNodeRef.current.connect(filterNode);
    
    // Store the filter node
    filterNodesRef.current.set(prime, filterNode);
  };
  
  // Remove a BiquadFilter for a prime
  const removeFilterForPrime = (prime: number) => {
    const filterNode = filterNodesRef.current.get(prime);
    if (filterNode) {
      filterNode.disconnect();
      filterNodesRef.current.delete(prime);
    }
  };
  
  // Update the parent component when active primes change
  useEffect(() => {
    onPrimesChange(activePrimes);
    
    // Switch to PrimeSymphonyScene if any primes are active
    if (activePrimes.length > 0) {
      setVisualMode('prime');
    }
  }, [activePrimes, onPrimesChange, setVisualMode]);
  
  return (
    <div className="prime-explorer bg-black/70 backdrop-blur-md p-4 rounded-lg">
      <h3 className="text-lg text-white mb-3 font-semibold">Prime-Harmonic Explorer</h3>
      
      <div className="prime-buttons grid grid-cols-5 gap-2">
        {primes.map(prime => (
          <button
            key={prime}
            onClick={() => togglePrime(prime)}
            className={`
              py-1 px-1 text-xs rounded transition-colors
              ${activePrimes.includes(prime)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
            `}
          >
            Prime {prime} → {prime * 100} Hz
          </button>
        ))}
      </div>
      
      {activePrimes.length > 0 && (
        <div className="mt-4 bg-gray-900 p-2 rounded text-white text-sm">
          <p>Active harmonics: {activePrimes.join(', ')}</p>
          <p className="text-xs text-gray-400 mt-1">
            {/* Removed calculatePrimeFactors usage completely */}
            Factors of active primes: []
          </p>
        </div>
      )}
    </div>
  );
};

export default PrimeExplorer;
