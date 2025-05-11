
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChakraTag, getChakraColor } from '@/types/chakras';

interface IntegrationPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  reflection: string;
  onReflectionChange: (text: string) => void;
  journeyData: {
    title: string;
    intent?: string;
  };
}

const IntegrationPhase: React.FC<IntegrationPhaseProps> = ({
  onComplete,
  chakra,
  reflection,
  onReflectionChange,
  journeyData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleComplete = () => {
    // Remove event parameter
    console.log("IntegrationPhase handleComplete called");
    setIsSubmitting(true);
    
    // Small delay for visual feedback
    setTimeout(() => {
      onComplete();
      setIsSubmitting(false);
    }, 800);
  };
  
  const chakraColor = chakra ? getChakraColor(chakra) : '#8B5CF6'; // Default purple
  
  return (
    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-white">Integration</h2>
      
      <div className="mb-8">
        <p className="text-white/90 text-center mb-6">
          Take a moment to reflect on your experience with <span className="text-white font-medium">{journeyData.title}</span>. 
          What insights or feelings arose during this journey?
        </p>
        
        <div className="mb-6">
          <label className="block text-white/80 mb-2">Your Reflection</label>
          <Textarea
            value={reflection}
            onChange={(e) => onReflectionChange(e.target.value)}
            placeholder="Share your experience, insights, and how you feel after this journey..."
            className="w-full h-32 bg-black/30 border border-white/20 text-white rounded-md p-3"
          />
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Your Initial Intention</h3>
          <p className="text-white/80 italic">
            {journeyData.intent || "This journey was approached with an open heart and mind."}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleComplete}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2"
            style={{ backgroundColor: chakraColor, color: 'white' }}
          >
            {isSubmitting ? "Saving..." : "Complete Journey"}
            {!isSubmitting && <ChevronRight size={18} />}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegrationPhase;
