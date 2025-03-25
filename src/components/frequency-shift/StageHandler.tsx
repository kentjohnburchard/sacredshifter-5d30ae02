
import React from "react";
import { HealingFrequency } from "@/data/frequencies";
import { PromptOption } from "./types";
import PromptStep from "./PromptStep";
import IntentionInput from "./IntentionInput";
import VisualOverlaySelector from "./VisualOverlaySelector";
import FrequencyMatchDisplay from "./FrequencyMatchDisplay";
import ActionButtons from "./ActionButtons";
import { getTemplateByFrequency } from "@/data/journeyTemplates";

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
  // Get journey template for the matched frequency if available
  const journeyTemplate = matchedFrequency ? getTemplateByFrequency(matchedFrequency.frequency) : null;
  
  if (showIntentionInput) {
    return (
      <IntentionInput 
        userIntention={userIntention}
        onChange={setUserIntention}
        onSubmit={handleIntentionSubmit}
      />
    );
  }
  
  if (showVisualSelector) {
    return (
      <VisualOverlaySelector
        selectedVisual={selectedVisual}
        onSelectVisual={handleVisualSelect}
        onContinue={handleVisualContinue}
      />
    );
  }
  
  if (currentStep === 7 && matchedFrequency) {
    return (
      <>
        <FrequencyMatchDisplay frequency={matchedFrequency} />
        
        {journeyTemplate && (
          <div className="mt-2 mb-4 px-4 py-3 bg-purple-50 border border-purple-100 rounded-lg">
            <p className="text-purple-800 font-medium text-center">
              {journeyTemplate.emoji} {journeyTemplate.name}
            </p>
            <p className="text-purple-600 text-sm text-center mt-1">
              "{journeyTemplate.affirmation}"
            </p>
          </div>
        )}
        
        <p className="text-gray-600 text-center whitespace-pre-line mb-6">
          {getRecommendationText()}
        </p>
        <ActionButtons 
          onLearnMore={showInfoDialog} 
          onSaveAndBegin={handleSaveToTimeline}
        />
      </>
    );
  }
  
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
