import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculatePrimeFactors } from '@/utils/primeCalculations';
import { PrimeHistoryEntry } from '@/types/primeTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, History, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const PrimeNumberDisplay: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [number, setNumber] = useState<number | null>(null);
  const [factors, setFactors] = useState<number[]>([]);
  const [isPrime, setIsPrime] = useState<boolean | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [primeHistory, setPrimeHistory] = useLocalStorage<PrimeHistoryEntry[]>("prime-history", []);
  const { liftTheVeil } = useTheme();

  useEffect(() => {
    if (number !== null) {
      setIsCalculating(true);
      
      // Simulate calculation time for better UX
      const timer = setTimeout(() => {
        const result = calculatePrimeFactors(number);
        setFactors(result);
        setIsPrime(result.length === 1 && result[0] === number);
        setIsCalculating(false);
        
        // Add to history
        const newEntry: PrimeHistoryEntry = {
          number,
          isPrime: result.length === 1 && result[0] === number,
          factors: result,
          timestamp: new Date().toISOString()
        };
        
        // Update history with direct value instead of function
        const updatedHistory = [...primeHistory, newEntry];
        setPrimeHistory(updatedHistory);
        
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [number]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedValue = parseInt(inputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setNumber(parsedValue);
    }
  };

  const handleClearHistory = () => {
    setPrimeHistory([]);
  };

  const handleRandomNumber = () => {
    // Generate a random number between 1 and 10000
    const randomNum = Math.floor(Math.random() * 10000) + 1;
    setInputValue(randomNum.toString());
    setNumber(randomNum);
  };

  return (
    <div className="space-y-6">
      <Card className={`${liftTheVeil ? 'border-pink-300 shadow-pink-500/10' : 'border-purple-300 shadow-purple-500/10'} shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prime Number Explorer</span>
            <Sparkles className={`h-5 w-5 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter a number"
                className="flex-1"
                min="1"
                required
              />
              <Button 
                type="submit" 
                className={`${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                Check
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRandomNumber}
                className={`${liftTheVeil ? 'text-pink-600 border-pink-300' : 'text-purple-600 border-purple-300'}`}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {isCalculating && (
            <div className="mt-4 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className={`h-8 w-8 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
              </motion.div>
            </div>
          )}

          {!isCalculating && number !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">Result:</span>
                {isPrime ? (
                  <Badge className={`${liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'}`}>Prime</Badge>
                ) : (
                  <Badge variant="outline">Composite</Badge>
                )}
              </div>
              
              <div>
                <span className="font-medium">Prime Factors:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {factors.map((factor, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`${liftTheVeil ? 'border-pink-300 text-pink-700' : 'border-purple-300 text-purple-700'}`}
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {primeHistory.length > 0 && (
        <Card className="border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              <span>History</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearHistory}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {primeHistory.slice().reverse().map((entry, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setInputValue(entry.number.toString());
                    setNumber(entry.number);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{entry.number}</span>
                    {entry.isPrime ? (
                      <Badge size="sm" className={`${liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'}`}>Prime</Badge>
                    ) : (
                      <Badge size="sm" variant="outline">Composite</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrimeNumberDisplay;
