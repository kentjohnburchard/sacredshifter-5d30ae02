
import React from 'react';
import { motion } from 'framer-motion';
import { calculatePrimeFactors, isPrime } from '@/utils/primeCalculations';
import { PrimeNumberDisplayProps } from '@/types/primeTypes';

const PrimeNumberDisplay: React.FC<PrimeNumberDisplayProps> = ({
  primes = [],
  sessionId,
  journeyTitle,
  expanded = false,
  onToggleExpand
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  if (primes.length === 0) return null;

  return (
    <motion.div
      className={`prime-display ${expanded ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4' : 'absolute top-4 left-4 z-40'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`bg-purple-900/30 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg ${expanded ? 'w-full max-w-2xl' : 'max-w-xs'}`}>
        <div className="px-4 py-3 flex justify-between items-center border-b border-purple-500/20">
          <h3 className="text-purple-100 font-medium">Prime Harmonics</h3>
          
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="text-purple-300 hover:text-purple-100 transition-colors text-sm"
            >
              {expanded ? "Minimize" : "Expand"}
            </button>
          )}
        </div>
        
        <div className={`p-4 ${expanded ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-wrap gap-2'}`}>
          {primes.slice(0, expanded ? undefined : 5).map((prime, index) => {
            const isActuallyPrime = isPrime(prime);
            const factors = isActuallyPrime ? [prime] : calculatePrimeFactors(prime);
            
            return (
              <motion.div 
                key={`${prime}-${index}`}
                variants={itemVariants}
                className={`${expanded 
                  ? 'bg-purple-500/10 p-3 rounded-lg' 
                  : 'bg-purple-500/10 px-2 py-1 rounded'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-mono ${isActuallyPrime ? 'text-pink-300' : 'text-purple-300'} ${expanded ? 'text-xl' : 'text-sm'}`}>
                    {prime}
                  </span>
                  
                  {isActuallyPrime && (
                    <span className="bg-pink-500/20 text-pink-200 text-xs px-1.5 rounded">
                      Prime
                    </span>
                  )}
                </div>
                
                {expanded && !isActuallyPrime && factors.length > 0 && (
                  <div className="mt-2 text-xs text-purple-200">
                    <span>Factors: {factors.join(' × ')}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {expanded && journeyTitle && (
          <div className="px-4 py-2 border-t border-purple-500/20 text-xs text-purple-300">
            <p>Session: {journeyTitle || "Untitled"}</p>
            {sessionId && <p className="opacity-60">ID: {sessionId.substring(0, 8)}</p>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrimeNumberDisplay;
