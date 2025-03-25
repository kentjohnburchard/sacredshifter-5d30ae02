
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Import components
import PromptCard from "./frequency-shift/PromptCard";
import PromptStep from "./frequency-shift/PromptStep";
import IntentionInput from "./frequency-shift/IntentionInput";
import FrequencyMatchDisplay from "./frequency-shift/FrequencyMatchDisplay";
import ActionButtons from "./frequency-shift/ActionButtons";
import InfoDialogContent from "./frequency-shift/InfoDialogContent";
import VisualOverlaySelector from "./frequency-shift/VisualOverlaySelector";
import { promptSteps } from "./frequency-shift/promptSteps";
import { PromptOption } from "./frequency-shift/types";

const FrequencyShiftPrompt: React.FC = () => {
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
  
  // Get the current prompt step
  const currentPrompt = promptSteps[currentStep > promptSteps.length - 1 ? promptSteps.length - 1 : currentStep];
  
  // Replace placeholders in the recommendation text
  const getRecommendationText = () => {
    if (!matchedFrequency) return currentPrompt.text;
    
    return currentPrompt.text
      .replace("[FREQUENCY]", matchedFrequency.frequency.toString())
      .replace("[CHAKRA / STATE]", matchedFrequency.chakra || "energy");
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
  
  return (
    <>
      <PromptCard>
        {showIntentionInput ? (
          <IntentionInput 
            userIntention={userIntention}
            onChange={setUserIntention}
            onSubmit={handleIntentionSubmit}
          />
        ) : showVisualSelector ? (
          <VisualOverlaySelector
            selectedVisual={selectedVisual}
            onSelectVisual={handleVisualSelect}
            onContinue={handleVisualContinue}
          />
        ) : currentStep === 7 && matchedFrequency ? (
          <>
            <FrequencyMatchDisplay frequency={matchedFrequency} />
            <p className="text-gray-600 text-center whitespace-pre-line mb-6">
              {getRecommendationText()}
            </p>
            <ActionButtons 
              onLearnMore={() => setShowInfoDialog(true)} 
              onSaveAndBegin={handleSaveToTimeline}
            />
          </>
        ) : (
          <PromptStep
            step={currentStep}
            title={currentPrompt.title}
            text={currentPrompt.text}
            options={currentPrompt.options}
            onOptionSelect={handleOptionSelect}
            onStartOver={handleStartOver}
            showStartOver={currentStep > 0}
          />
        )}
      </PromptCard>
      
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
          
          <InfoDialogContent 
            matchedFrequency={matchedFrequency}
            onBeginJourney={handleBeginJourney}
            onClose={() => setShowInfoDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FrequencyShiftPrompt;
