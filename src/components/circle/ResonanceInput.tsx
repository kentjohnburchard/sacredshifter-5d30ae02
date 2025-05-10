
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/context/ThemeContext';
import { FrequencyLibraryItem } from '@/types/frequencies';

interface ResonanceInputProps {
  onSubmit: (message: {
    content: string;
    emotionalTone: string;
    frequency?: number;
  }) => void;
  frequencies?: FrequencyLibraryItem[];
}

const ResonanceInput: React.FC<ResonanceInputProps> = ({
  onSubmit,
  frequencies = []
}) => {
  const [message, setMessage] = useState('');
  const [emotionalTone, setEmotionalTone] = useState('Peaceful');
  const [frequencyValue, setFrequencyValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { liftTheVeil } = useTheme();
  
  const emotionalTones = ['Peaceful', 'Uplifted', 'Grounded', 'Activated'];
  
  const getChakraFromTone = (tone: string): ChakraTag => {
    switch(tone) {
      case 'Peaceful': return 'Crown';
      case 'Uplifted': return 'Third Eye';
      case 'Grounded': return 'Root';
      case 'Activated': return 'Heart';
      default: return 'Crown';
    }
  };
  
  const chakra = getChakraFromTone(emotionalTone);
  const chakraColor = CHAKRA_COLORS[chakra];
  
  // Focus the text area when the component mounts
  React.useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);
  
  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit({
        content: message,
        emotionalTone,
        frequency: frequencyValue ? parseFloat(frequencyValue) : undefined
      });
      setMessage('');
      setFrequencyValue('');
    }
  };
  
  return (
    <motion.div 
      className="bg-black/30 border rounded-lg p-4 backdrop-blur-md"
      style={{
        borderColor: chakraColor + '40'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-3">
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label htmlFor="tone-select" className="block text-sm font-medium mb-1 text-white/70">
              Emotional Tone
            </label>
            <Select value={emotionalTone} onValueChange={setEmotionalTone}>
              <SelectTrigger 
                id="tone-select" 
                className="w-full border-0 bg-black/30"
                style={{ borderLeft: `3px solid ${chakraColor}` }}
              >
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {emotionalTones.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ 
                          backgroundColor: CHAKRA_COLORS[getChakraFromTone(tone)],
                          boxShadow: `0 0 5px ${CHAKRA_COLORS[getChakraFromTone(tone)]}` 
                        }}
                      />
                      {tone}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <label htmlFor="frequency-select" className="block text-sm font-medium mb-1 text-white/70">
              Frequency (Optional)
            </label>
            <Select value={frequencyValue} onValueChange={setFrequencyValue}>
              <SelectTrigger id="frequency-select" className="w-full border-0 bg-black/30">
                <SelectValue placeholder="Add frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {[432, 528, 639, 741, 852, 963].map((freq) => (
                  <SelectItem key={freq} value={String(freq)}>
                    {freq}Hz
                  </SelectItem>
                ))}
                {frequencies.slice(0, 5).map((freq) => (
                  <SelectItem key={freq.id} value={String(freq.frequency)}>
                    {freq.frequency}Hz - {freq.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    
      <div className="relative">
        <Textarea
          ref={textAreaRef}
          placeholder="Share wisdom, ask questions, or connect with the circle..."
          className="min-h-[100px] bg-black/20 border-0 focus-visible:ring-1 resize-none"
          style={{
            borderLeft: `3px solid ${chakraColor}`,
            boxShadow: isTyping ? `0 0 20px ${chakraColor}30` : 'none'
          }}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsTyping(true);
            // Reset typing animation after delay
            setTimeout(() => setIsTyping(false), 1000);
          }}
        />
        
        {isTyping && (
          <motion.div 
            className="absolute bottom-2 right-2 h-2 w-2 rounded-full"
            style={{ backgroundColor: chakraColor }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      
      <div className="flex justify-end mt-3">
        <Button 
          onClick={handleSubmit}
          disabled={!message.trim()}
          className={`px-6 ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          Send Message
        </Button>
      </div>
    </motion.div>
  );
};

export default ResonanceInput;
