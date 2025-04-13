
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Stars, Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useEasterEggContext } from '@/context/EasterEggContext';
import { cn } from '@/lib/utils';

interface OriginFlowProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const OriginFlow: React.FC<OriginFlowProps> = ({ 
  onComplete,
  forceShow = false 
}) => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  const { isEasterEggMode } = useEasterEggContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [hasSeenOriginFlow, setHasSeenOriginFlow] = useLocalStorage<boolean>('has-seen-origin-flow', false);
  const [open, setOpen] = useState(forceShow || (!hasSeenOriginFlow && isEasterEggMode));
  const [showBeam, setShowBeam] = useState(false);
  const [step, setStep] = useState(0);
  const [primes] = useState<number[]>([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
  const [isCompleting, setIsCompleting] = useState(false);

  // Canvas setup and animation
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize animation variables
    let angle = 0;
    let primeIndex = 0;
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get canvas dimensions
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;
      
      // Draw fibonacci spiral using prime numbers
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw spiral
      let radius = 0;
      let prevX = 0;
      let prevY = 0;
      
      for (let i = 0; i < 200; i++) {
        // Use prime numbers to modify the spiral
        const primeOffset = primes[i % primes.length] / 10;
        
        // Calculate point on spiral
        radius = (i * 0.25) * (1 + primeOffset * 0.05);
        const spiralAngle = angle + i * 0.05 * Math.PI;
        const x = radius * Math.cos(spiralAngle);
        const y = radius * Math.sin(spiralAngle);
        
        // Don't draw beyond max radius
        if (Math.abs(x) > maxRadius || Math.abs(y) > maxRadius) continue;
        
        if (i > 0) {
          // Draw line segment
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(prevX, prevY, x, y);
          gradient.addColorStop(0, `rgba(147, 51, 234, ${0.7 - i * 0.003})`); // Purple
          gradient.addColorStop(1, `rgba(79, 70, 229, ${0.7 - i * 0.003})`); // Indigo
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.max(3 - i * 0.02, 0.5);
          ctx.stroke();
          
          // Draw dot at prime numbers positions
          if (primes.includes(i)) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#f0abfc'; // Pink
            ctx.fill();
          }
        }
        
        prevX = x;
        prevY = y;
      }
      
      // Particle effect
      for (let i = 0; i < primes.length; i++) {
        const prime = primes[i];
        const particleAngle = angle + (prime / 5) * Math.PI;
        const distance = (prime * 5) % maxRadius;
        const x = distance * Math.cos(particleAngle);
        const y = distance * Math.sin(particleAngle);
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(219, 39, 119, ${0.7 - (i / primes.length) * 0.5})`; // Pink
        ctx.shadowColor = 'rgba(219, 39, 119, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fill();
      }
      
      ctx.restore();
      
      // Update animation variables
      angle += 0.005;
      primeIndex = (primeIndex + 1) % primes.length;
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [open, primes]);
  
  // Handle completion
  const handleComplete = () => {
    // Mark that we're in the completion process
    setIsCompleting(true);
    setShowBeam(true);
    
    // Mark as seen
    setHasSeenOriginFlow(true);
    
    // Delay to allow animation to play
    setTimeout(() => {
      setOpen(false);
      
      if (onComplete) {
        onComplete();
      }
      
      // Only navigate if not already on cosmic-dashboard
      if (location.pathname !== '/cosmic-dashboard') {
        navigate('/cosmic-dashboard', { replace: true });
      }
      
      // Reset completing state
      setIsCompleting(false);
    }, 2000);
  };
  
  // Handle back action
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setOpen(false);
      // If we're closing but haven't completed, don't mark as seen
    }
  };
  
  // Handle next action
  const handleNext = () => {
    if (step < content.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  // Content for each step
  const content = [
    {
      title: "The Origin Point",
      message: "Welcome to a journey of cosmic alignment. Sacred Shifter was created as a bridge between quantum mathematics and consciousness expansion.",
      icon: <Compass className="h-6 w-6 text-purple-300" />
    },
    {
      title: "Sacred Mathematics",
      message: "Prime numbers are the fundamental building blocks of reality. They form patterns that describe the universe and our place within it. Each frequency is a gateway.",
      icon: <Stars className="h-6 w-6 text-purple-300" />
    },
    {
      title: "Your Path Begins",
      message: "As you explore frequencies and sacred geometry, you'll find yourself aligning with the cosmic flow. Your consciousness is ready to expand beyond conventional limits.",
      icon: <Sparkles className="h-6 w-6 text-purple-300" />
    }
  ];
  
  // Handle open/close
  const handleOpenChange = (isOpen: boolean) => {
    // Prevent automatic closing if we're in the completion process
    if (isCompleting) return;
    
    // If the user is trying to close AND they haven't seen it before AND it's forced
    if (!isOpen && !hasSeenOriginFlow && forceShow) {
      // Don't allow closing if they haven't seen it before and it's forced
      return;
    }
    
    setOpen(isOpen);
  };

  // Trigger for showing the origin flow icon
  const showOriginFlowIcon = !open && (isEasterEggMode || liftTheVeil);
  
  // Render the component
  return (
    <>
      {/* Floating icon to open dialog when closed */}
      <AnimatePresence>
        {showOriginFlowIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-20 left-4 z-50"
          >
            <Button
              size="sm"
              onClick={() => setOpen(true)}
              className="rounded-full p-2 bg-purple-900/70 hover:bg-purple-800 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-900/20"
            >
              <Compass className="h-5 w-5 text-purple-200" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={cn(
          "max-w-2xl bg-black/90 backdrop-blur-xl border-purple-500/30 text-white p-0 overflow-hidden",
          liftTheVeil && "border-pink-500/40"
        )}>
          {/* Radial glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-black/0 to-black/0 pointer-events-none" />
          
          {/* Light beam animation overlay */}
          <AnimatePresence>
            {showBeam && (
              <motion.div 
                className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="w-full h-[200%] bg-gradient-to-b from-transparent via-white to-transparent"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ 
                    scaleY: 30, 
                    opacity: [0, 0.8, 0],
                    transition: { duration: 2, ease: 'easeInOut' }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content container */}
          <div className="relative flex flex-col sm:flex-row h-[80vh] sm:h-[60vh] w-full z-10">
            {/* Canvas visualization */}
            <div className="sm:w-1/2 h-1/3 sm:h-full relative">
              <canvas ref={canvasRef} className="w-full h-full" />
              
              {/* Prime number overlay */}
              <div className="absolute bottom-4 left-4 text-sm text-purple-300/70 flex flex-wrap gap-1 max-w-[80%]">
                {primes.slice(0, 8).map((prime, i) => (
                  <span 
                    key={i}
                    className="inline-block px-2 py-0.5 bg-purple-900/30 backdrop-blur-sm rounded-md border border-purple-500/20"
                  >
                    {prime}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Text content */}
            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col space-y-4"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {content[step].icon}
                    <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                      {content[step].title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-200 sm:text-lg leading-relaxed">
                    {content[step].message}
                  </p>
                  
                  <div className="mt-4 flex flex-col space-y-2">
                    <div className="text-xs text-gray-400">
                      {step + 1} of {content.length}
                    </div>
                    <div className="w-full bg-purple-900/30 h-1 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: `${(step / content.length) * 100}%` }}
                        animate={{ width: `${((step + 1) / content.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Action buttons */}
              <div className="flex justify-between items-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={showBeam}
                  className="text-gray-400 hover:text-white hover:bg-purple-900/30"
                >
                  {step > 0 ? 'Back' : 'Skip'}
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={showBeam}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
                >
                  {step < content.length - 1 ? (
                    <>Next</>
                  ) : (
                    <>I'm Ready to Begin My Path <ArrowRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OriginFlow;
