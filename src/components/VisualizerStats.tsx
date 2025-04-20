
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface VisualizerStatsProps {
  analyzer: AnalyserNode | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activePrimes?: number[];
}

const VisualizerStats: React.FC<VisualizerStatsProps> = ({
  analyzer,
  collapsed = false,
  onToggleCollapse,
  activePrimes = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [peakFrequency, setPeakFrequency] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const dataArray = useRef<Uint8Array | null>(null);
  
  // Initialize the data array if analyzer is available
  useEffect(() => {
    if (analyzer && !dataArray.current) {
      dataArray.current = new Uint8Array(analyzer.frequencyBinCount);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyzer]);
  
  // Draw frequency visualization
  useEffect(() => {
    if (!analyzer || !canvasRef.current || !dataArray.current || collapsed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const drawVisualization = () => {
      analyzer.getByteFrequencyData(dataArray.current!);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate bar width
      const barWidth = canvas.width / dataArray.current!.length;
      
      // Track peak energy and total energy
      let peakValue = 0;
      let peakIndex = 0;
      let totalEnergyValue = 0;
      
      // Draw frequency bars
      for (let i = 0; i < dataArray.current!.length; i++) {
        const value = dataArray.current![i];
        totalEnergyValue += value;
        
        // Track peak
        if (value > peakValue) {
          peakValue = value;
          peakIndex = i;
        }
        
        // Calculate bar height
        const barHeight = (value / 256) * canvas.height;
        
        // Determine bar color
        let barColor = `hsl(${240 - (i / dataArray.current!.length) * 240}, 80%, 50%)`;
        
        // Highlight prime frequency bins
        const frequencyPerBin = 22050 / dataArray.current!.length; // Assuming 44.1kHz sample rate
        const binFrequency = i * frequencyPerBin;
        const closestHundred = Math.round(binFrequency / 100) * 100;
        
        // Check if this bin corresponds to an active prime
        const isPrimeFrequency = activePrimes.some(prime => 
          Math.abs(prime * 100 - binFrequency) < frequencyPerBin / 2
        );
        
        if (isPrimeFrequency) {
          barColor = '#ff5500'; // Highlight active prime frequencies
        } else if (isPrime(Math.round(binFrequency / 100))) {
          barColor = 'rgba(255, 255, 0, 0.7)'; // Highlight all prime frequencies
        }
        
        // Draw the bar
        ctx.fillStyle = barColor;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
      
      // Calculate coherence score (peak energy ratio)
      const coherence = totalEnergyValue > 0 ? (peakValue / (totalEnergyValue / dataArray.current!.length)) : 0;
      setCoherenceScore(coherence);
      
      // Calculate approximate frequency of peak
      const peakFreq = peakIndex * (22050 / dataArray.current!.length);
      setPeakFrequency(Math.round(peakFreq));
      
      // Total energy
      setTotalEnergy(totalEnergyValue);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(drawVisualization);
    };
    
    // Start visualization
    drawVisualization();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyzer, collapsed, activePrimes]);
  
  return (
    <div className={`visualizer-stats fixed bottom-4 right-4 bg-black/70 backdrop-blur-md rounded-lg shadow-xl transition-all duration-300 z-40 
    ${collapsed ? 'w-14 h-14' : 'w-80 max-h-96'}`}>
      <button
        onClick={onToggleCollapse}
        className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
      >
        {collapsed ? '+' : '−'}
      </button>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 pt-8"
          >
            <h3 className="text-lg text-white mb-3 font-semibold">Frequency Analysis</h3>
            
            <div className="mb-3">
              <canvas 
                ref={canvasRef}
                width={340}
                height={120}
                className="w-full h-[120px] rounded bg-gray-900"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-xs text-gray-400">Coherence Score</div>
                <div className="text-lg text-white font-mono">
                  {coherenceScore.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-xs text-gray-400">Peak Frequency</div>
                <div className="text-lg text-white font-mono">
                  {peakFrequency} Hz
                </div>
              </div>
              
              <div className="bg-gray-900 p-2 rounded">
                <div className="text-xs text-gray-400">Energy Level</div>
                <div className="text-lg text-white font-mono">
                  {Math.round(totalEnergy / 100)}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mb-2">Legend:</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 mr-1 opacity-70"></div>
                <span className="text-white">Prime Frequency</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 mr-1"></div>
                <span className="text-white">Active Prime</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                <span className="text-white">Regular Band</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {collapsed && (
        <div className="h-full flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-purple-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default VisualizerStats;
