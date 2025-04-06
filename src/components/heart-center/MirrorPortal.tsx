import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, Heart, Save, Play, Mic } from 'lucide-react';
import { useLoveQuotes } from '@/hooks/useLoveQuotes';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MirrorMoment {
  message: string;
  return_date: string;
  user_id: string;
  id?: string;
  created_at?: string;
  viewed_at?: string;
}

const MirrorPortal: React.FC = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [affirmationsActive, setAffirmationsActive] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>('peaceful');
  const [recordMode, setRecordMode] = useState(false);
  const [mirrorMessage, setMirrorMessage] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showMirrorDialog, setShowMirrorDialog] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const { getRandomQuoteByMood, getRandomQuoteByTopic } = useLoveQuotes();
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('');
  const [showControls, setShowControls] = useState(true);
  const affirmationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const moods = [
    { id: 'peaceful', label: 'Peaceful' },
    { id: 'hopeful', label: 'Hopeful' },
    { id: 'loving', label: 'Loving' },
    { id: 'grieving', label: 'Grieving' },
    { id: 'anxious', label: 'Anxious' }
  ];

  // Start camera
  const handleStartCamera = () => {
    setCameraActive(true);
  };

  // Stop camera
  const handleStopCamera = () => {
    if (affirmationIntervalRef.current) {
      clearInterval(affirmationIntervalRef.current);
      affirmationIntervalRef.current = null;
    }
    setAffirmationsActive(false);
    setCameraActive(false);
  };

  // Start affirmations
  const startAffirmations = () => {
    setAffirmationsActive(true);
    updateAffirmation();
    
    // Set up interval to change affirmations
    affirmationIntervalRef.current = setInterval(() => {
      updateAffirmation();
    }, 8000);
  };

  // Update the current affirmation
  const updateAffirmation = () => {
    // Get a quote based on mood or heart-related topic
    const useTopicInstead = Math.random() > 0.5;
    const quote = useTopicInstead ? 
      getRandomQuoteByTopic('Self-Love') : 
      getRandomQuoteByMood(currentMood);
    
    if (quote) {
      setCurrentAffirmation(quote.text);
    } else {
      const fallbackAffirmations = [
        "You are worthy of love exactly as you are",
        "Your heart has infinite capacity for compassion",
        "Love flows to you, through you, and from you",
        "You are connected to the universal heartbeat",
        "Every beat of your heart is a miracle of existence"
      ];
      setCurrentAffirmation(fallbackAffirmations[Math.floor(Math.random() * fallbackAffirmations.length)]);
    }
  };

  // Save a mirror moment for future
  const saveMirrorMoment = async () => {
    if (!user) {
      toast.error("Please log in to save mirror moments");
      return;
    }

    if (!mirrorMessage || !returnDate) {
      toast.error("Please fill in both message and return date");
      return;
    }

    try {
      const mirrorMoment: MirrorMoment = {
        user_id: user.id,
        message: mirrorMessage,
        return_date: new Date(returnDate).toISOString()
      };

      // Using any type since the table isn't in generated types
      const { error } = await supabase
        .from('mirror_moments')
        .insert(mirrorMoment) as any;

      if (error) {
        throw error;
      }

      toast.success("Your message to your future self has been saved");
      setMirrorMessage('');
      setReturnDate('');
      setShowMirrorDialog(false);
    } catch (error) {
      console.error("Error saving mirror moment:", error);
      toast.error("Failed to save your mirror moment");
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (affirmationIntervalRef.current) {
        clearInterval(affirmationIntervalRef.current);
      }
    };
  }, []);

  // Toggle controls visibility on click
  const toggleControls = () => {
    if (cameraActive) {
      setShowControls(!showControls);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-purple-900">Mirror Portal 2.0</h2>
        <p className="text-purple-600 mt-1">Reflect, affirm, and witness your radiant heart</p>
      </div>

      <div 
        className="w-full max-w-2xl aspect-video relative rounded-xl overflow-hidden shadow-xl border-2 border-pink-300 cursor-pointer"
        onClick={toggleControls}
      >
        {cameraActive ? (
          <>
            {/* Webcam feed */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
            
            {/* Affirmations overlay */}
            <AnimatePresence>
              {affirmationsActive && currentAffirmation && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.p 
                    className="text-2xl md:text-3xl font-medium text-white text-center p-4 max-w-md bg-black/20 backdrop-blur-sm rounded-xl shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    key={currentAffirmation}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 15 
                    }}
                  >
                    {currentAffirmation}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Controls overlay (can be toggled) */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {!affirmationsActive ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-pink-600 hover:bg-pink-700"
                          onClick={startAffirmations}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Affirmations
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            if (affirmationIntervalRef.current) {
                              clearInterval(affirmationIntervalRef.current);
                              affirmationIntervalRef.current = null;
                            }
                            setAffirmationsActive(false);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Stop Affirmations
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/20 hover:bg-white/30 border-white/50 text-white"
                        onClick={() => setShowMirrorDialog(true)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Mirror Moment
                      </Button>
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleStopCamera}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Mood selector */}
                  {affirmationsActive && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {moods.map((mood) => (
                        <Button
                          key={mood.id}
                          variant="outline"
                          size="sm"
                          className={`bg-white/20 hover:bg-white/30 border-white/50 text-white ${
                            currentMood === mood.id ? 'ring-2 ring-pink-500 ring-offset-1' : ''
                          }`}
                          onClick={() => {
                            setCurrentMood(mood.id);
                            updateAffirmation();
                          }}
                        >
                          {mood.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // Camera inactive state
          <div className="w-full h-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="bg-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-medium text-purple-900">Mirror Portal</h3>
              <p className="text-sm text-purple-700 mb-4">
                Use your camera to see affirmations reflected with your image
              </p>
              <Button
                onClick={handleStartCamera}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Camera className="mr-2 h-4 w-4" />
                Activate Camera
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Features and instructions */}
      {!cameraActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <Card className="p-4 bg-white/70 border-pink-200">
            <div className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mr-3">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-purple-900">Self-Love Reflection</h3>
                <p className="text-sm text-purple-700">
                  See yourself through the lens of love with affirmations that remind you of your inherent worth.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white/70 border-pink-200">
            <div className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mr-3">
                <Save className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-purple-900">Future Self Messages</h3>
                <p className="text-sm text-purple-700">
                  Record a message for your future self and set a date to receive this sacred transmission.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Mirror Moment Dialog */}
      <Dialog open={showMirrorDialog} onOpenChange={setShowMirrorDialog}>
        <DialogContent className="bg-white/90 backdrop-blur-md border-pink-300">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-900">Message to Your Future Self</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-purple-800 block mb-1">Your Message</label>
              <Input
                placeholder="What do you want to tell your future self?"
                value={mirrorMessage}
                onChange={(e) => setMirrorMessage(e.target.value)}
                className="border-pink-200"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-purple-800 block mb-1">Return Date</label>
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border-pink-200"
              />
              <p className="text-xs text-purple-600 mt-1">
                When should this message return to you?
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="border-pink-300" onClick={() => setShowMirrorDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600"
              onClick={saveMirrorMoment}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MirrorPortal;
