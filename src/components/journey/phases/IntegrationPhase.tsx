
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Send, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface IntegrationPhaseProps {
  onComplete: () => void;
  chakra?: ChakraTag;
  reflection: string;
  onReflectionChange: (text: string) => void;
  journeyData: {
    title: string;
    intent?: string;
    frequency?: number;
    id?: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const chakraColor = getChakraColor(chakra) || '#FFFFFF';
  const { user } = useAuth();

  const handleSaveReflection = async () => {
    if (!user?.id || !reflection.trim()) {
      toast.error("Please enter a reflection first");
      return;
    }

    setIsSaving(true);
    
    try {
      // Save just the reflection without completing the journey
      const { error } = await supabase
        .from('session_reflections')
        .insert({
          user_id: user.id,
          session_id: crypto.randomUUID(), // Generate a temporary session ID
          content: reflection
        });
      
      if (error) throw error;
      
      toast.success("Reflection saved");
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Unable to save your reflection");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    if (!reflection.trim()) {
      toast.warning("Please share your reflection before completing the journey");
      return;
    }

    setIsSubmitting(true);
    
    // The actual saving happens in the parent component
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 500);
  };

  const handleDownload = () => {
    // Create text content for the download
    const content = `# ${journeyData.title} - Journey Summary
Date: ${new Date().toLocaleDateString()}

## Intent
${journeyData.intent || 'Sacred journey of transformation'}

## Reflection
${reflection || 'No reflection recorded'}

## Details
${chakra ? `Chakra: ${chakra}` : ''}
${journeyData.frequency ? `Frequency: ${journeyData.frequency}Hz` : ''}
`;

    // Create download link
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${journeyData.title.toLowerCase().replace(/\s+/g, '-')}-journey.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Journey summary downloaded");
  };
  
  // Get spiral parameters for integration phase
  const getSpiralParams = () => {
    const baseParams = {
      coeffA: 0.8,
      coeffB: 1.0,
      freqA: 2.0,
      freqB: 2.5,
      color: '255,255,255',
      opacity: 60,
      strokeWeight: 0.8,
      maxCycles: 4,
      speed: 0.1
    };
    
    if (chakra) {
      // Adjust color based on chakra
      switch (chakra) {
        case 'Root':
          baseParams.color = '255,0,0';
          break;
        case 'Sacral':
          baseParams.color = '255,127,0';
          break;
        case 'Solar Plexus':
          baseParams.color = '255,255,0';
          break;
        case 'Heart':
          baseParams.color = '0,255,0';
          break;
        case 'Throat':
          baseParams.color = '0,255,255';
          break;
        case 'Third Eye':
          baseParams.color = '0,0,255';
          break;
        case 'Crown':
          baseParams.color = '139,0,255';
          break;
        default:
          baseParams.color = '255,255,255';
      }
    }
    
    return baseParams;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-6">
      {/* Background spiral */}
      <div className="absolute inset-0 z-0 opacity-50">
        <SpiralVisualizer 
          params={getSpiralParams()}
          containerId="integration-spiral"
        />
      </div>
      
      <div className="relative z-10 max-w-lg mx-auto w-full bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-2 text-white">Integration & Reflection</h2>
          
          <p className="text-white/70 mb-6">
            Take a moment to reflect on your experience and insights from this journey.
          </p>
          
          {/* Reflection input */}
          <div 
            className="mb-6"
            style={{ boxShadow: `0 0 15px ${chakraColor}20` }}
          >
            <Textarea
              value={reflection}
              onChange={(e) => onReflectionChange(e.target.value)}
              placeholder="What insights or awareness emerged during this journey? How do you feel now?"
              className="min-h-[150px] bg-black/30 border-white/20 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="border-white/20 text-white hover:bg-white/10"
                disabled={!reflection.trim()}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveReflection}
                className="border-white/20 text-white hover:bg-white/10"
                disabled={isSaving || !reflection.trim()}
              >
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reflection.trim()}
              style={{ backgroundColor: chakraColor }}
              className="text-black hover:opacity-90"
            >
              <Send className="mr-2 h-4 w-4" /> 
              {isSubmitting ? "Saving..." : "Complete Journey"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegrationPhase;
