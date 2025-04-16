
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Hexagon, Check } from "lucide-react";
import { toast } from "sonner";
import FrequencyPlayer from "@/components/FrequencyPlayer";

interface TrinityPhase2Props {
  onComplete: () => void;
  onSetIntention: (intention: string) => void;
  onSelectElements: (elements: string[]) => void;
  skipPhase: () => void;
}

const TrinityPhase2: React.FC<TrinityPhase2Props> = ({ 
  onComplete, 
  onSetIntention, 
  onSelectElements,
  skipPhase 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [teslaQuoteShown, setTeslaQuoteShown] = useState(false);
  const [intention, setIntention] = useState("");
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  
  const PHASE_DURATION = 180; // 3 minutes in seconds
  
  const elements = [
    { id: "e1", name: "Water Element" },
    { id: "e2", name: "Heart Chakra" },
    { id: "e3", name: "Love Mantra" },
    { id: "e4", name: "Green Healing" },
    { id: "e5", name: "Deep Breath" },
    { id: "e6", name: "Self-Love" },
    { id: "e7", name: "Gratitude" },
    { id: "e8", name: "Connection" },
    { id: "e9", name: "Harmony" },
  ];
  
  // Toggle audio playback
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info("Beginning Phase 2: Embody (639Hz)");
    } else {
      toast.info("Frequency paused");
    }
  }, [isPlaying]);
  
  // Enable advanced mode
  const handleEnableAdvancedMode = () => {
    setShowAdvancedMode(true);
    toast.info("Trinity Manifestation Journey activated");
  };
  
  // Toggle element selection
  const toggleElement = (id: string) => {
    if (selectedElements.includes(id)) {
      setSelectedElements(selectedElements.filter(e => e !== id));
    } else {
      if (selectedElements.length < 6) {
        setSelectedElements([...selectedElements, id]);
      } else {
        toast.warning("Please select only 6 elements");
      }
    }
  };
  
  // Save intention and selected elements
  const handleSaveSelections = () => {
    if (intention.trim().split(' ').length !== 3) {
      toast.error("Please enter exactly 3 words for your intention");
      return;
    }
    
    if (selectedElements.length !== 6) {
      toast.error("Please select exactly 6 elements");
      return;
    }
    
    onSetIntention(intention);
    onSelectElements(selectedElements.map(id => 
      elements.find(e => e.id === id)?.name || ""
    ));
    
    toast.success("Your Trinity Manifestation selections have been saved");
  };
  
  // Track progress and show Tesla quote at specific time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => {
          const newSeconds = prev + 1;
          setProgress((newSeconds / PHASE_DURATION) * 100);
          
          // Check for Tesla quote Easter egg at 6:06 (66 seconds into this phase)
          if (newSeconds === 66 && !teslaQuoteShown) {
            toast.info("\"The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries of its existence.\" — Tesla");
            setTeslaQuoteShown(true);
          }
          
          // Auto-advance when phase is complete
          if (newSeconds >= PHASE_DURATION) {
            setIsPlaying(false);
            setTimeout(() => onComplete(), 1000);
            toast.success("Phase 2 complete: Heart chakra activated");
            return PHASE_DURATION;
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, onComplete, teslaQuoteShown]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-indigo-950/30 border border-indigo-600/30 p-6 backdrop-blur-sm rounded-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                rotate: isPlaying ? [0, 360] : 0,
                scale: isPlaying ? [1, 1.1, 1] : 1
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <Hexagon className="text-indigo-400" size={64} />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Phase 2: Embody</h2>
          <p className="text-gray-300 mb-4">
            639Hz Heart Chakra frequency harmonizes relationships and activates love.
            The hexagon geometry aligns you with balance and connection.
          </p>
          
          <div className="flex justify-center mb-6">
            <FrequencyPlayer
              frequencyId="639hz"
              isPlaying={isPlaying}
              onPlayToggle={togglePlayback}
              frequency={639}
            />
          </div>
          
          <div className="space-y-4 mb-6">
            <Progress value={progress} className="h-2 bg-indigo-900/30" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(secondsElapsed)}</span>
              <span>{formatTime(PHASE_DURATION)}</span>
            </div>
          </div>
        </div>
        
        {!showAdvancedMode ? (
          <div className="text-center mb-4">
            <Button
              onClick={handleEnableAdvancedMode}
              variant="outline"
              className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/30 mb-4"
            >
              Enable Trinity Manifestation Journey (Advanced Mode)
            </Button>
            
            <p className="text-gray-400 text-sm mb-6">
              Unlock additional customization for a personalized 3-6-9 experience
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Step 1: Set Your 3-Word Intention</h3>
              <Input 
                type="text"
                placeholder="Love Abundance Peace"
                value={intention}
                onChange={e => setIntention(e.target.value)}
                className="bg-black/20 border-indigo-500/30 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Enter exactly 3 words separated by spaces</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 2: Choose 6 Elements</h3>
              <div className="grid grid-cols-3 gap-2">
                {elements.map(element => (
                  <Button
                    key={element.id}
                    variant={selectedElements.includes(element.id) ? "default" : "outline"}
                    className={selectedElements.includes(element.id) 
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/30"}
                    onClick={() => toggleElement(element.id)}
                  >
                    {selectedElements.includes(element.id) && (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs">{element.name}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Select exactly 6 elements</p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleSaveSelections}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                Save Manifestation Settings
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-gray-400 italic mb-6">
            "The heart has its own intelligence and consciousness that we can align with and listen to." — Nikola Tesla
          </p>
          
          <Button 
            onClick={skipPhase}
            variant="outline"
            className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/30"
          >
            Skip to Phase 3
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TrinityPhase2;
