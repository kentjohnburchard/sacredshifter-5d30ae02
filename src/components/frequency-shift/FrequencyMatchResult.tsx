
import React from 'react';
import { HealingFrequency } from "@/data/frequencies";
import FrequencyMatchDisplay from "./FrequencyMatchDisplay";
import ActionButtons from "./ActionButtons";
import { getTemplateByFrequency } from "@/data/journeyTemplates";

interface FrequencyMatchResultProps {
  matchedFrequency: HealingFrequency;
  getRecommendationText: () => string;
  showInfoDialog: () => void;
  handleSaveToTimeline: () => void;
}

const FrequencyMatchResult: React.FC<FrequencyMatchResultProps> = ({
  matchedFrequency,
  getRecommendationText,
  showInfoDialog,
  handleSaveToTimeline
}) => {
  // Get journey template for the matched frequency
  const journeyTemplate = getTemplateByFrequency(matchedFrequency.frequency);
  
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
};

export default FrequencyMatchResult;
