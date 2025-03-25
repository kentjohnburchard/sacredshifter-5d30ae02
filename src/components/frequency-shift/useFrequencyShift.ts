
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import { PromptOption } from "./types";
import { promptSteps } from "./promptSteps";

export const useFrequencyShift = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [matchedFrequency, setMatchedFrequency] = useState<HealingFrequency | null>(null);
  const [userIntention, setUserIntention] = useState("");
  const [showIntentionInput, setShowIntentionInput] = useState(false);
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);
  const [showVisualSelector, setShowVisualSelector] = useState(false);
  const navigate = useNavigate();
  
  // Get the current prompt step
  const getCurrentPrompt = () => {
    const index = currentStep > promptSteps.length - 1 ? promptSteps.length - 1 : currentStep;
    return promptSteps[index];
  };
  
  // Replace placeholders in the recommendation text
  const getRecommendationText = () => {
    const currentPrompt = getCurrentPrompt();
    if (!matchedFrequency) return currentPrompt.text;
    
    return currentPrompt.text
      .replace("[FREQUENCY]", matchedFrequency.frequency.toString())
      .replace("[CHAKRA / STATE]", matchedFrequency.chakra || "energy");
  };

  // Handle main option selection for prompt flow
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
          moveToVisualSelectionOrRecommendation();
      }
    } else if (currentStep === 6) {
      // Visual overlay options
      if (option.visualType) {
        setSelectedVisual(option.visualType);
      }
      moveToRecommendationStep();
    } else if (currentStep === 7) {
      // Final options from recommendation screen
      handleRecommendationAction(option.tag);
    } else {
      // Move to visual selection after any secondary choice
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
      
      moveToVisualSelectionOrRecommendation();
    }
  };
  
  const moveToVisualSelectionOrRecommendation = () => {
    setShowVisualSelector(true);
    setCurrentStep(6); // Move to visual overlay selection step
  };
  
  const moveToRecommendationStep = () => {
    setShowVisualSelector(false);
    setCurrentStep(7); // Move to recommendation step
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
        setSelectedVisual(null);
        break;
      default:
        handleBeginJourney();
    }
  };
  
  // Handle intention submission
  const handleIntentionSubmit = () => {
    setShowIntentionInput(false);
    toast.success("Intention set: " + userIntention);
    moveToVisualSelectionOrRecommendation();
  };
  
  // Handle visual selection
  const handleVisualSelect = (visualType: string) => {
    setSelectedVisual(visualType);
  };
  
  // Handle continue after visual selection
  const handleVisualContinue = () => {
    moveToRecommendationStep();
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
    
    // Navigate to music generation with the selected frequency, intention, and visual overlay
    navigate("/music-generation", {
      state: {
        selectedFrequency: matchedFrequency,
        generateWithFrequency: true,
        intention: userIntention || undefined,
        visualOverlay: selectedVisual || "none"
      }
    });
  };
  
  // Handle saving to timeline
  const handleSaveToTimeline = async () => {
    toast.success("Your frequency journey has been saved to your timeline");
    handleBeginJourney();
  };
  
  const handleStartOver = () => {
    setCurrentStep(0);
    setSelectedTags([]);
    setSelectedPath(null);
    setSelectedVisual(null);
    setUserIntention("");
    setShowIntentionInput(false);
    setShowVisualSelector(false);
  };

  return {
    currentStep,
    selectedPath,
    selectedTags,
    showInfoDialog,
    setShowInfoDialog,
    matchedFrequency,
    userIntention,
    setUserIntention,
    showIntentionInput,
    showVisualSelector,
    selectedVisual,
    handleOptionSelect,
    getRecommendationText,
    handleIntentionSubmit,
    handleVisualSelect,
    handleVisualContinue,
    handleBeginJourney,
    handleSaveToTimeline,
    handleStartOver,
    getCurrentPrompt
  };
};
