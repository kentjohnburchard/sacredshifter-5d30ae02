
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import { Heart, Info, CircleIcon, Sparkles, Clock, Music } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define the prompt option type
type PromptOption = {
  text: string;
  tag: string;
  frequency?: number;
  chakra?: string;
};

// Define the prompt step type
type PromptStep = {
  title: string;
  text: string;
  options: PromptOption[];
};

const FrequencyShiftPrompt: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [matchedFrequency, setMatchedFrequency] = useState<HealingFrequency | null>(null);
  const [userIntention, setUserIntention] = useState("");
  const [showIntentionInput, setShowIntentionInput] = useState(false);
  const navigate = useNavigate();
  
  // Define all prompt steps
  const promptSteps: PromptStep[] = [
    {
      title: "Begin Your Frequency Shift",
      text: "Welcome, radiant soul. You didn't land here by accident. Something in you is ready to shift, align, and remember what it feels like to vibrate in your truth.\n\nBefore we go deeper, take a breath with me. Inhale presence… exhale the noise.\n\nNow tell me—what's calling you today?",
      options: [
        { text: "I want to feel better", tag: "mood_shift" },
        { text: "I want to explore my energy", tag: "chakra_journey" },
        { text: "I want to shift something deep", tag: "shadow_work" },
        { text: "I just want to listen and vibe", tag: "music_mode" },
        { text: "I don't know, I just felt drawn here", tag: "curiosity" }
      ]
    },
    // Feel Better Path
    {
      title: "Feel Better – Identify Discomfort",
      text: "We all have those days. You're not broken—you're simply out of tune. Let's gently recalibrate your energy and bring you back to your center.\n\nWhich part of you feels most out of sync right now?",
      options: [
        { text: "My body feels tense", tag: "root", frequency: 396, chakra: "Root" },
        { text: "I'm stuck in my head", tag: "crown", frequency: 963, chakra: "Crown" },
        { text: "My heart feels heavy", tag: "heart", frequency: 639, chakra: "Heart" },
        { text: "I just feel off", tag: "solar", frequency: 528, chakra: "Solar Plexus" }
      ]
    },
    // Explore Energy Path
    {
      title: "Explore Energy – Choose a Path",
      text: "Love that curiosity. Your energy is your compass, your mirror, your masterpiece. Let's explore it like sacred architecture.\n\nWhere would you like to begin?",
      options: [
        { text: "Chakra alignment", tag: "full_chakra" },
        { text: "Aura scan", tag: "intuitive_path" },
        { text: "Elemental energy", tag: "elemental_mode" },
        { text: "Surprise me", tag: "quantum_roll" }
      ]
    },
    // Shift Something Deep Path
    {
      title: "Shift Deeply – Choose What to Release",
      text: "You're ready to shift. That's powerful. The willingness to meet yourself is the beginning of transformation.\n\nIs there an emotion, memory, or belief you'd like to move through?",
      options: [
        { text: "Fear or anxiety", tag: "fear", frequency: 396, chakra: "Root" },
        { text: "Shame or guilt", tag: "shame", frequency: 417, chakra: "Sacral" },
        { text: "Old patterns", tag: "patterns", frequency: 741, chakra: "Throat" },
        { text: "Grief or loss", tag: "grief", frequency: 639, chakra: "Heart" },
        { text: "I'm not sure, I just feel it", tag: "general", frequency: 528, chakra: "Solar Plexus" }
      ]
    },
    // Just Listen and Vibe Path
    {
      title: "Just Vibe – Choose Your Sound",
      text: "Sometimes the soul just wants to bathe in sound. No goals, no fixing—just vibes.\n\nPick your vibe and I'll bring the frequency.",
      options: [
        { text: "Chill & grounded", tag: "chill", frequency: 396, chakra: "Root" },
        { text: "Uplifting & sparkly", tag: "uplifting", frequency: 528, chakra: "Solar Plexus" },
        { text: "Heart-opening", tag: "heart", frequency: 639, chakra: "Heart" },
        { text: "Cosmic float", tag: "cosmic", frequency: 963, chakra: "Crown" }
      ]
    },
    // Intuitive Journey Path
    {
      title: "Intuitive Journey – Guided Flow",
      text: "That's more than enough. Intuition brought you here—and that's the purest guidance of all.\n\nLet's do a soft scan and offer you a session based on your energetic field.",
      options: [
        { text: "Take me to my sound", tag: "random_recommendation" },
        { text: "Let me set an intention first", tag: "intention_path" },
        { text: "What does my energy say?", tag: "aura_prompt" }
      ]
    },
    // Session Recommendation - New Step
    {
      title: "Your Frequency Match",
      text: "✨ You're aligned with [FREQUENCY] Hz ✨\n\nThis frequency supports your [CHAKRA / STATE]. Let it guide you inward, upward, and beyond.\n\nAre you ready to begin your sound journey?",
      options: [
        { text: "Yes, begin session", tag: "begin_session" },
        { text: "I want to learn more", tag: "learn_more" },
        { text: "Choose a different vibe", tag: "go_back" }
      ]
    }
  ];
  
  // Handle option selection
  const handleOptionSelect = (option: PromptOption) => {
    setSelectedTags([...selectedTags, option.tag]);
    
    // Handle intention path
    if (option.tag === "intention_path") {
      setShowIntentionInput(true);
      return;
    }
    
    // Determine next step based on current step and selection
    if (currentStep === 0) {
      // Main path selection
      switch (option.tag) {
        case "mood_shift":
          setSelectedPath("mood_shift");
          setCurrentStep(1);
          break;
        case "chakra_journey":
          setSelectedPath("chakra_journey");
          setCurrentStep(2);
          break;
        case "shadow_work":
          setSelectedPath("shadow_work");
          setCurrentStep(3);
          break;
        case "music_mode":
          setSelectedPath("music_mode");
          setCurrentStep(4);
          break;
        case "curiosity":
          setSelectedPath("curiosity");
          setCurrentStep(5);
          break;
        default:
          moveToRecommendationStep();
      }
    } else if (currentStep === 6) {
      // Final options from recommendation screen
      handleRecommendationAction(option.tag);
    } else {
      // Move to recommendation step after any secondary choice
      if (option.frequency) {
        // Find the corresponding full frequency object
        const matchedFreq = healingFrequencies.find(f => f.frequency === option.frequency) || 
          // If not found, create a simplified one
          {
            id: option.tag,
            name: option.text,
            frequency: option.frequency,
            description: `${option.frequency}Hz is aligned with ${option.chakra || "healing"} energy`,
            benefits: [`Helps with ${option.text.toLowerCase()}`],
            color: "from-purple-400 to-blue-600",
            chakra: option.chakra
          };
        
        setMatchedFrequency(matchedFreq as HealingFrequency);
      } else if (option.tag === "random_recommendation") {
        // Random selection for "Take me to my sound"
        const randomIndex = Math.floor(Math.random() * healingFrequencies.length);
        setMatchedFrequency(healingFrequencies[randomIndex]);
      } else if (option.tag === "aura_prompt") {
        // For "What does my energy say?" - pick a resonant frequency
        const resonantFrequencies = [396, 528, 639, 741, 963];
        const randomIndex = Math.floor(Math.random() * resonantFrequencies.length);
        const frequency = resonantFrequencies[randomIndex];
        const matchedFreq = healingFrequencies.find(f => f.frequency === frequency);
        if (matchedFreq) setMatchedFrequency(matchedFreq);
      }
      
      moveToRecommendationStep();
    }
  };
  
  const moveToRecommendationStep = () => {
    setCurrentStep(6); // Move to recommendation step
  };
  
  const handleRecommendationAction = (action: string) => {
    switch (action) {
      case "begin_session":
        handleBeginJourney();
        break;
      case "learn_more":
        setShowInfoDialog(true);
        break;
      case "go_back":
        setCurrentStep(0); // Back to start
        setSelectedTags([]);
        setSelectedPath(null);
        break;
      default:
        handleBeginJourney();
    }
  };
  
  // Handle beginning the sound journey
  const handleBeginJourney = () => {
    if (!matchedFrequency) {
      // If no specific frequency matched, choose one based on tags
      const selectedOption = promptSteps
        .flatMap(step => step.options)
        .find(option => selectedTags.includes(option.tag) && option.frequency);
        
      if (selectedOption && selectedOption.frequency) {
        const foundFrequency = healingFrequencies.find(f => f.frequency === selectedOption.frequency);
        if (foundFrequency) {
          setMatchedFrequency(foundFrequency);
        } else {
          setMatchedFrequency({
            id: selectedOption.tag,
            name: selectedOption.text,
            frequency: selectedOption.frequency,
            description: `${selectedOption.frequency}Hz is aligned with ${selectedOption.chakra || "healing"} energy`,
            benefits: [`Helps with ${selectedOption.text.toLowerCase()}`],
            color: "from-purple-400 to-blue-600",
            chakra: selectedOption.chakra
          });
        }
      } else {
        // Default to 528Hz (Love Frequency) if no specific match
        setMatchedFrequency(healingFrequencies.find(f => f.frequency === 528) || healingFrequencies[0]);
      }
    }
    
    // Navigate to music generation with the selected frequency and intention if any
    navigate("/music-generation", {
      state: {
        selectedFrequency: matchedFrequency,
        generateWithFrequency: true,
        intention: userIntention || undefined
      }
    });
  };
  
  // Handle saving to timeline
  const handleSaveToTimeline = async () => {
    toast.success("Your frequency journey has been saved to your timeline");
    handleBeginJourney();
  };
  
  // Handle intention submission
  const handleIntentionSubmit = () => {
    setShowIntentionInput(false);
    toast.success("Intention set: " + userIntention);
    moveToRecommendationStep();
  };
  
  // Get the current prompt step
  const currentPrompt = promptSteps[currentStep];
  
  // Replace placeholders in the recommendation text
  const getRecommendationText = () => {
    if (!matchedFrequency) return currentPrompt.text;
    
    return currentPrompt.text
      .replace("[FREQUENCY]", matchedFrequency.frequency.toString())
      .replace("[CHAKRA / STATE]", matchedFrequency.chakra || "energy");
  };
  
  return (
    <>
      <Card className="border border-gray-200 shadow-md overflow-hidden rounded-lg">
        <CardContent className="p-6 sm:p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                {currentPrompt.title}
              </h3>
              
              {currentStep === 6 && matchedFrequency ? (
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    {matchedFrequency.frequency} Hz
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    {matchedFrequency.name}
                  </div>
                  <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 font-medium mb-4">
                    {matchedFrequency.chakra || "Healing"} Energy
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 whitespace-pre-line">
                  {currentStep === 6 ? getRecommendationText() : currentPrompt.text}
                </p>
              )}
            </div>
            
            {showIntentionInput ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-700">Set an intention for your frequency session:</p>
                </div>
                <Input
                  type="text"
                  placeholder="I am open to receiving healing energy..."
                  value={userIntention}
                  onChange={(e) => setUserIntention(e.target.value)}
                  className="text-center border-purple-200 focus:border-purple-500"
                />
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleIntentionSubmit}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  >
                    Set Intention
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPrompt.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => handleOptionSelect(option)}
                      className="w-full py-6 px-4 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md"
                      variant="outline"
                    >
                      {option.text}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {currentStep > 0 && (
              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(0)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Start Over
                </Button>
              </div>
            )}
            
            {currentStep === 6 && (
              <div className="flex justify-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowInfoDialog(true)}
                  className="flex items-center gap-2 text-purple-700 border-purple-200 hover:border-purple-300"
                >
                  <Info className="h-4 w-4" />
                  Learn More
                </Button>
                <Button
                  onClick={handleSaveToTimeline}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                >
                  <Heart className="h-4 w-4" />
                  Save & Begin
                </Button>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Frequency Information Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="bg-gradient-to-b from-slate-50 to-purple-50 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Frequency Healing Guide
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Each frequency carries a unique energy signature that resonates with different aspects of your being
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="guide" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="guide">Frequency Guide</TabsTrigger>
              <TabsTrigger value="selected">Your Frequency</TabsTrigger>
              <TabsTrigger value="usage">How to Listen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-4">
              <p className="text-gray-700">
                Each frequency in this app is selected for its resonance with the body, mind, and subtle energy systems.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">396 Hz</div>
                  <div>
                    <h4 className="font-medium">Liberation Tone</h4>
                    <p className="text-sm text-gray-600">Releases fear, grounds the body (Root Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">417 Hz</div>
                  <div>
                    <h4 className="font-medium">Transformation Tone</h4>
                    <p className="text-sm text-gray-600">Clears negativity, unlocks flow (Sacral Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm">528 Hz</div>
                  <div>
                    <h4 className="font-medium">Love Frequency</h4>
                    <p className="text-sm text-gray-600">Transformation, DNA repair, love (Solar Plexus Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-sm">639 Hz</div>
                  <div>
                    <h4 className="font-medium">Connection Frequency</h4>
                    <p className="text-sm text-gray-600">Heart healing, relationship energy (Heart Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">741 Hz</div>
                  <div>
                    <h4 className="font-medium">Expression Frequency</h4>
                    <p className="text-sm text-gray-600">Detox, inner truth (Throat Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">852 Hz</div>
                  <div>
                    <h4 className="font-medium">Spiritual Doorway</h4>
                    <p className="text-sm text-gray-600">Awakens intuition (Third Eye Chakra)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">963 Hz</div>
                  <div>
                    <h4 className="font-medium">Divine Frequency</h4>
                    <p className="text-sm text-gray-600">Divine connection, unity (Crown Chakra)</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mt-4">
                You'll be guided to the best frequency for your state, but you're always welcome to explore freely.
              </p>
            </TabsContent>
            
            <TabsContent value="selected" className="space-y-4">
              {matchedFrequency ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      {matchedFrequency.frequency} Hz
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">{matchedFrequency.name}</h3>
                    {matchedFrequency.chakra && (
                      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 font-medium mt-2">
                        {matchedFrequency.chakra} Chakra
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700">{matchedFrequency.description}</p>
                  </div>
                  
                  {matchedFrequency.benefits && matchedFrequency.benefits.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium mb-2 text-gray-800">Benefits</h4>
                      <ul className="space-y-1">
                        {matchedFrequency.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-gray-700">
                            <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-1" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Complete the journey to see your recommended frequency.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-500" />
                  Recommended Listening Duration
                </h4>
                <p className="text-gray-700">
                  For optimal benefits, we recommend listening to frequency tones for 5-15 minutes daily. For deep healing sessions, 20-30 minutes can be more effective.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                  <Music className="h-4 w-4 mr-2 text-purple-500" />
                  Creating the Perfect Environment
                </h4>
                <p className="text-gray-700">
                  Find a quiet space where you won't be disturbed. Use headphones for the best experience, as they allow the frequencies to resonate fully with your energy field.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-purple-500" />
                  Setting Intentions
                </h4>
                <p className="text-gray-700">
                  Before each session, take a moment to set an intention. This creates a resonant field between your consciousness and the frequency, amplifying its effects.
                </p>
              </div>
              
              <div className="text-center mt-4">
                <Button 
                  onClick={() => {
                    setShowInfoDialog(false);
                    handleBeginJourney();
                  }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  Begin My Journey
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FrequencyShiftPrompt;
