
import React from "react";
import { HealingFrequency } from "@/data/frequencies";
import { PromptOption } from "./types";
import PromptStep from "./PromptStep";
import IntentionInput from "./IntentionInput";
import VisualOverlaySelector from "./VisualOverlaySelector";
import FrequencyMatchResult from "./FrequencyMatchResult";

interface StageHandlerProps {
  currentStep: number;
  currentPrompt: any;
  showIntentionInput: boolean;
  showVisualSelector: boolean;
  userIntention: string;
  setUserIntention: (intention: string) => void;
  handleIntentionSubmit: () => void;
  selectedVisual: string | null;
  handleVisualSelect: (visualType: string) => void;
  handleVisualContinue: () => void;
  matchedFrequency: HealingFrequency | null;
  getRecommendationText: () => string;
  showInfoDialog: () => void;
  handleSaveToTimeline: () => void;
  onOptionSelect: (option: PromptOption) => void;
  handleStartOver: () => void;
}

const StageHandler: React.FC<StageHandlerProps> = ({
  currentStep,
  currentPrompt,
  showIntentionInput,
  showVisualSelector,
  userIntention,
  setUserIntention,
  handleIntentionSubmit,
  selectedVisual,
  handleVisualSelect,
  handleVisualContinue,
  matchedFrequency,
  getRecommendationText,
  showInfoDialog,
  handleSaveToTimeline,
  onOptionSelect,
  handleStartOver,
}) => {
  // Show intention input stage
  if (showIntentionInput) {
    return (
      <IntentionInput 
        userIntention={userIntention}
        onChange={setUserIntention}
        onSubmit={handleIntentionSubmit}
      />
    );
  }
  
  // Show visual selector stage
  if (showVisualSelector) {
    return (
      <VisualOverlaySelector
        selectedVisual={selectedVisual}
        onSelectVisual={handleVisualSelect}
        onContinue={handleVisualContinue}
      />
    );
  }
  
  // Show frequency match result
  if (currentStep === 7 && matchedFrequency) {
    return (
      <FrequencyMatchResult
        matchedFrequency={matchedFrequency}
        getRecommendationText={getRecommendationText}
        showInfoDialog={showInfoDialog}
        handleSaveToTimeline={handleSaveToTimeline}
      />
    );
  }
  
  // Default: show prompt step
  return (
    <PromptStep
      step={currentStep}
      title={currentPrompt.title}
      text={currentPrompt.text}
      options={currentPrompt.options}
      onOptionSelect={onOptionSelect}
      onStartOver={handleStartOver}
      showStartOver={currentStep > 0}
    />
  );
};

export default StageHandler;
