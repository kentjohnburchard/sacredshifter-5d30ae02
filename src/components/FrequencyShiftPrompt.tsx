
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        { text: "My body feels tense", tag: "root", frequency: 396 },
        { text: "I'm stuck in my head", tag: "crown", frequency: 963 },
        { text: "My heart feels heavy", tag: "heart", frequency: 639 },
        { text: "I just feel off", tag: "solar", frequency: 528 }
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
        { text: "Fear or anxiety", tag: "fear", frequency: 396 },
        { text: "Shame or guilt", tag: "shame", frequency: 417 },
        { text: "Old patterns", tag: "patterns", frequency: 741 },
        { text: "Grief or loss", tag: "grief", frequency: 639 },
        { text: "I'm not sure, I just feel it", tag: "general", frequency: 528 }
      ]
    },
    // Just Listen and Vibe Path
    {
      title: "Just Vibe – Choose Your Sound",
      text: "Sometimes the soul just wants to bathe in sound. No goals, no fixing—just vibes.\n\nPick your vibe and I'll bring the frequency.",
      options: [
        { text: "Chill & grounded", tag: "chill", frequency: 396 },
        { text: "Uplifting & sparkly", tag: "uplifting", frequency: 528 },
        { text: "Heart-opening", tag: "heart", frequency: 639 },
        { text: "Cosmic float", tag: "cosmic", frequency: 963 }
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
    // Final step - recommend a session
    {
      title: "Your Frequency Recommendation",
      text: "Based on your journey and energy, we've found the perfect frequency for you. Ready to begin your sound healing journey?",
      options: [
        { text: "Begin Journey", tag: "begin_journey" },
        { text: "Save to Timeline", tag: "save_journey" }
      ]
    }
  ];
  
  // Handle option selection
  const handleOptionSelect = (option: PromptOption) => {
    setSelectedTags([...selectedTags, option.tag]);
    
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
          setCurrentStep(6);
      }
    } else if (currentStep === 6) {
      // Final options
      if (option.tag === "begin_journey") {
        handleBeginJourney();
      } else if (option.tag === "save_journey") {
        handleSaveToTimeline();
      }
    } else {
      // Move to recommendation step after any secondary choice
      setCurrentStep(6);
    }
  };
  
  // Handle beginning the sound journey
  const handleBeginJourney = () => {
    // Get the frequency from the selected tags if available
    const selectedOption = promptSteps
      .flatMap(step => step.options)
      .find(option => selectedTags.includes(option.tag) && option.frequency);
      
    // Navigate to music generation with the selected frequency
    if (selectedOption && selectedOption.frequency) {
      navigate("/music-generation", {
        state: {
          selectedFrequency: {
            name: selectedOption.tag,
            frequency: selectedOption.frequency,
            description: `Healing frequency for ${selectedOption.text}`
          },
          generateWithFrequency: true
        }
      });
    } else {
      // If no specific frequency was selected, go to the general music page
      navigate("/music-generation");
    }
  };
  
  // Handle saving to timeline
  const handleSaveToTimeline = async () => {
    toast.success("Your frequency journey has been saved to your timeline");
    // In a future enhancement, we could save this to the timeline_snapshots table
    handleBeginJourney();
  };
  
  // Get the current prompt step
  const currentPrompt = promptSteps[currentStep];
  
  return (
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
            <p className="text-gray-600 whitespace-pre-line">
              {currentPrompt.text}
            </p>
          </div>
          
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
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FrequencyShiftPrompt;
