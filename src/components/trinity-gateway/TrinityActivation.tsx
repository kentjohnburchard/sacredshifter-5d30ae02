
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TrinityActivationProps {
  intention: string;
  selectedElements: string[];
  onRestart: () => void;
}

const TrinityActivation: React.FC<TrinityActivationProps> = ({
  intention,
  selectedElements,
  onRestart
}) => {
  const { user } = useAuth();
  const [showKentDialogue, setShowKentDialogue] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [badgeSaved, setBadgeSaved] = useState(false);
  
  const kentDialogueVariants = [
    "You didn't just listen to music. You unlocked code older than time. This is Trinity Gateway™ — The space between matter and memory. The breath between thought and awakening. You're not healing. You're remembering. And damn, you look good doing it.",
    "You just walked through a numerological doorway. Tesla saw it. You're living it.",
    "Now go shift the shit outta your timeline."
  ];
  
  const teslaQuotes = [
    "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
    "The present is theirs; the future, for which I really worked, is mine.",
    "My brain is only a receiver. In the Universe there is a core from which we obtain knowledge, strength, inspiration."
  ];
  
  // Randomly select quotes
  const [kentDialogue, setKentDialogue] = useState(
    kentDialogueVariants[Math.floor(Math.random() * kentDialogueVariants.length)]
  );
  
  const [teslaQuote, setTeslaQuote] = useState(
    teslaQuotes[Math.floor(Math.random() * teslaQuotes.length)]
  );

  // Save journey completion to timeline
  const saveToTimeline = async () => {
    if (!user) {
      toast.error("You must be logged in to save your journey");
      return;
    }
    
    try {
      await supabase.from('timeline_snapshots').insert({
        user_id: user.id,
        title: "Trinity Gateway™ Completion",
        notes: `Completed the 3-6-9 Trinity Gateway™ journey${intention ? ` with intention: ${intention}` : ''}`,
        frequency: 369,
        tag: "trinity-gateway",
        chakra: "all"
      });
      
      setBadgeSaved(true);
      toast.success("Trinity Gateway™ badge saved to your timeline!");
    } catch (error) {
      console.error("Error saving to timeline:", error);
      toast.error("Failed to save badge to timeline");
    }
  };

  useEffect(() => {
    // Show Kent dialogue after 2 seconds
    const timer1 = setTimeout(() => {
      setShowKentDialogue(true);
    }, 2000);
    
    // Show secret code after 5 seconds
    const timer2 = setTimeout(() => {
      setShowSecretCode(true);
    }, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-violet-900/40 border-none shadow-lg p-6 backdrop-blur-sm rounded-lg overflow-hidden relative">
        {/* Background animated elements */}
        <motion.div
          className="absolute inset-0 z-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 50%)",
              "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 50%)",
              "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(0,0,0,0) 50%)",
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        <CardContent className="relative z-10 p-4 text-center">
          <motion.div 
            className="mb-8" 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.5, type: "spring" }}
          >
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-500 rounded-full opacity-70 animate-pulse" />
              <div className="absolute inset-2 bg-black rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-indigo-400 to-violet-400">
                  369
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400">
              Trinity Gateway™ Activated
            </h2>
            
            <Badge className="bg-indigo-600 mb-6">TRINITY CODE UNLOCKED</Badge>
            
            {showKentDialogue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <Card className="bg-black/50 border border-purple-500/30 p-4 mb-6">
                  <p className="italic text-gray-200 text-lg">
                    "{kentDialogue}"
                  </p>
                  <p className="text-right text-sm text-gray-400 mt-2">— Kent</p>
                </Card>
                
                <Card className="bg-black/50 border border-indigo-500/30 p-4">
                  <p className="italic text-gray-200">
                    "{teslaQuote}"
                  </p>
                  <p className="text-right text-sm text-gray-400 mt-2">— Nikola Tesla</p>
                </Card>
              </motion.div>
            )}
            
            {showSecretCode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {selectedElements.length > 0 && (
                  <div className="mb-6 p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Your 3-6-9 Journey</h3>
                    
                    {intention && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400">3-Word Intention:</p>
                        <p className="text-indigo-300 font-medium">{intention}</p>
                      </div>
                    )}
                    
                    {selectedElements.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400">6 Selected Elements:</p>
                        <div className="flex flex-wrap gap-2 justify-center mt-1">
                          {selectedElements.map((element, index) => (
                            <Badge key={index} variant="outline" className="border-indigo-500/50">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user && !badgeSaved && (
                    <Button 
                      onClick={saveToTimeline} 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                      Save 3-6-9 Badge to Timeline
                    </Button>
                  )}
                  
                  <Button
                    onClick={onRestart}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                  >
                    Begin Another Journey
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrinityActivation;
