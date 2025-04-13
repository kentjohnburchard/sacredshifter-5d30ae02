
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import SacredFlowerOfLife from '@/components/sacred-geometry/shapes/SacredFlowerOfLife';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: "Welcome to Sacred Shifter",
      description: "Step into a realm of frequency healing, consciousness exploration, and vibrational alignment.",
      buttonText: "Begin Journey"
    },
    {
      title: "Your Sacred Blueprint",
      description: "Discover your unique energetic signature and find the frequencies that resonate with your being.",
      buttonText: "Continue"
    },
    {
      title: "Sacred Geometry & Sound",
      description: "Experience the healing power of ancient geometrical patterns combined with sacred sound frequencies.",
      buttonText: "Enter Sacred Space"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Starfield background */}
      <StarfieldBackground density="high" opacity={0.6} isStatic={false} />
      
      {/* Sacred geometry background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[150vh] h-[150vh] animate-slow-spin">
          <SacredFlowerOfLife />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-lg rounded-xl p-8 border border-purple-300/20"
        >
          <div className="text-center">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-6"
            >
              {welcomeSteps[currentStep].title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-purple-100 mb-8"
            >
              {welcomeSteps[currentStep].description}
            </motion.p>
            
            <div className="flex justify-center mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8"
                >
                  {welcomeSteps[currentStep].buttonText}
                </Button>
              </motion.div>
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-center space-x-2 mt-10">
              {welcomeSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-purple-400' : 'bg-purple-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
