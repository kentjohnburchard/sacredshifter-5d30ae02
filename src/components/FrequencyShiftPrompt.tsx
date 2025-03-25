
import React from "react";
import PromptCard from "./frequency-shift/PromptCard";
import StageHandler from "./frequency-shift/StageHandler";
import FrequencyShiftDialog from "./frequency-shift/FrequencyShiftDialog";
import { useFrequencyShift } from "./frequency-shift/useFrequencyShift";

const FrequencyShiftPrompt: React.FC = () => {
  const {
    currentStep,
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
  } = useFrequencyShift();
  
  const currentPrompt = getCurrentPrompt();
  
  return (
    <>
      <PromptCard>
        <StageHandler
          currentStep={currentStep}
          currentPrompt={currentPrompt}
          showIntentionInput={showIntentionInput}
          showVisualSelector={showVisualSelector}
          userIntention={userIntention}
          setUserIntention={setUserIntention}
          handleIntentionSubmit={handleIntentionSubmit}
          selectedVisual={selectedVisual}
          handleVisualSelect={handleVisualSelect}
          handleVisualContinue={handleVisualContinue}
          matchedFrequency={matchedFrequency}
          getRecommendationText={getRecommendationText}
          showInfoDialog={() => setShowInfoDialog(true)}
          handleSaveToTimeline={handleSaveToTimeline}
          onOptionSelect={handleOptionSelect}
          handleStartOver={handleStartOver}
        />
      </PromptCard>
      
      <FrequencyShiftDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        matchedFrequency={matchedFrequency}
        onBeginJourney={handleBeginJourney}
      />
    </>
  );
};

export default FrequencyShiftPrompt;
