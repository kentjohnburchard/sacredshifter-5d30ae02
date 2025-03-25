
import React from "react";
import { Button } from "@/components/ui/button";
import { intentionSuggestions } from "./promptSteps";

interface IntentionSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const IntentionSuggestions: React.FC<IntentionSuggestionsProps> = ({
  onSelectSuggestion
}) => {
  return (
    <div className="space-y-3 mt-4">
      <h4 className="text-gray-600 text-sm font-medium">Suggestions:</h4>
      <div className="flex flex-wrap gap-2">
        {intentionSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            onClick={() => onSelectSuggestion(suggestion.text)}
          >
            {suggestion.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IntentionSuggestions;
