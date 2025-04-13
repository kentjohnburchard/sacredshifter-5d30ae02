
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { Clock, Save, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface PrimeHistoryEntry {
  id: string;
  timestamp: string;
  primes: number[];
  journeyTitle?: string;
}

interface PrimeNumberDisplayProps {
  primes: number[];
  sessionId?: string;
  journeyTitle?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const PrimeNumberDisplay: React.FC<PrimeNumberDisplayProps> = ({ 
  primes, 
  sessionId,
  journeyTitle,
  expanded = false,
  onToggleExpand 
}) => {
  const [visible, setVisible] = useState(true);
  const [primeHistory, setPrimeHistory] = useLocalStorage<PrimeHistoryEntry[]>('sacred-prime-history', []);
  
  const saveToHistory = () => {
    const newEntry: PrimeHistoryEntry = {
      id: sessionId || `prime-${Date.now()}`,
      timestamp: new Date().toISOString(),
      primes: [...primes],
      journeyTitle
    };
    
    // Add to history without duplicates
    setPrimeHistory((prev) => {
      // Ensure prev is an array
      const currentHistory = Array.isArray(prev) ? prev : [];
      
      // Check if we already have this exact sequence saved recently
      const isDuplicate = currentHistory.some(entry => 
        JSON.stringify(entry.primes) === JSON.stringify(primes) && 
        Date.now() - new Date(entry.timestamp).getTime() < 60000 // Within last minute
      );
      
      if (isDuplicate) {
        toast.info("This prime sequence is already saved in your recent history");
        return currentHistory;
      }
      
      // Keep history at a reasonable size
      const maxHistory = 50;
      const updatedHistory = [newEntry, ...currentHistory];
      if (updatedHistory.length > maxHistory) {
        return updatedHistory.slice(0, maxHistory);
      }
      return updatedHistory;
    });
    
    toast.success("Prime number sequence saved to your history");
  };

  if (!visible || primes.length === 0) return (
    <Button 
      variant="outline" 
      size="sm" 
      className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 bg-black/30 backdrop-blur-sm"
      onClick={() => setVisible(true)}
    >
      <Eye className="w-4 h-4 mr-2" />
      Show Primes
    </Button>
  );

  const positionClass = expanded 
    ? "fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/80" 
    : "fixed bottom-4 right-4 z-50";
    
  const contentClass = expanded
    ? "p-6 bg-black/70 backdrop-blur-lg rounded-lg border border-purple-500/50 shadow-lg max-w-md w-full"
    : "p-3 bg-black/40 backdrop-blur-md rounded-lg border border-purple-500/30 shadow-lg max-w-xs";

  return (
    <motion.div 
      className={positionClass}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={contentClass}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium flex items-center text-white">
            <Clock className="w-3 h-3 mr-1" /> 
            Active Prime Sequence
          </h3>
          <div className="flex gap-1">
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={onToggleExpand}
                title={expanded ? "Minimize" : "Maximize"}
              >
                {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={saveToHistory}
              title="Save to history"
            >
              <Save className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={() => setVisible(false)}
              title="Hide display"
            >
              <EyeOff className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {primes.map((prime, index) => (
            <motion.div
              key={`${prime}-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Badge 
                variant="outline" 
                className="bg-purple-900/50 border-purple-400/30 text-purple-100"
              >
                {prime}
              </Badge>
            </motion.div>
          ))}
        </div>
        {journeyTitle && (
          <p className="text-xs text-gray-300 mt-1 truncate">
            Journey: {journeyTitle}
          </p>
        )}
      </div>
      
      {expanded && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={onToggleExpand}
            className="bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50"
          >
            Return to Player
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PrimeNumberDisplay;
