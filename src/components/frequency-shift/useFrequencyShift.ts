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
  const [showTimezoneConfirmation, setShowTimezoneConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const getCurrentPrompt = () => {
    const index = currentStep > promptSteps.length - 1 ? promptSteps.length - 1 : currentStep;
    return promptSteps[index];
  };
  
  const getRecommendationText = () => {
    const currentPrompt = getCurrentPrompt();
    if (!matchedFrequency) return currentPrompt.text;
    
    return currentPrompt.text
      .replace("[FREQUENCY]", matchedFrequency.frequency.toString())
      .replace("[CHAKRA / STATE]", matchedFrequency.chakra || "energy");
  };

  const handleOptionSelect = (option: PromptOption) => {
    setSelectedTags([...selectedTags, option.tag]);
    
    if (option.tag === "intention_path") {
      setShowIntentionInput(true);
      return;
    }
    
    if (currentStep === 0) {
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
      if (option.visualType) {
        setSelectedVisual(option.visualType);
      }
      moveToRecommendationStep();
    } else if (currentStep === 7) {
      handleRecommendationAction(option.tag);
    } else {
      if (option.frequency) {
        const matchedFreq = healingFrequencies.find(f => f.frequency === option.frequency) || 
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
        const randomIndex = Math.floor(Math.random() * healingFrequencies.length);
        setMatchedFrequency(healingFrequencies[randomIndex]);
      } else if (option.tag === "aura_prompt") {
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
    setCurrentStep(6);
  };
  
  const moveToRecommendationStep = () => {
    setShowVisualSelector(false);
    setCurrentStep(7);
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
        setCurrentStep(0);
        setSelectedTags([]);
        setSelectedPath(null);
        setSelectedVisual(null);
        break;
      default:
        handleBeginJourney();
    }
  };
  
  const handleIntentionSubmit = () => {
    setShowIntentionInput(false);
    toast.success("Intention set: " + userIntention);
    moveToVisualSelectionOrRecommendation();
  };
  
  const handleVisualSelect = (visualType: string) => {
    setSelectedVisual(visualType);
  };
  
  const handleVisualContinue = () => {
    moveToRecommendationStep();
  };
  
  const handleBeginJourney = () => {
    if (!matchedFrequency) {
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
        setMatchedFrequency(healingFrequencies.find(f => f.frequency === 528) || healingFrequencies[0]);
      }
    }
    
    navigate("/music-generation", {
      state: {
        selectedFrequency: matchedFrequency,
        generateWithFrequency: true,
        intention: userIntention || undefined,
        visualOverlay: selectedVisual || "none"
      }
    });
  };
  
  const handleSaveToTimeline = async () => {
    console.log("Saving to timeline, currentStep:", currentStep);
    
    if (showTimezoneConfirmation) {
      console.log("Timezone save completion");
      setCurrentStep(5);
      setShowTimezoneConfirmation(false);
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentStep(4);
      setShowJournalForm(false);
      setIsProcessing(false);
    }, 800);
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
