
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import IntentionSuggestions from "./IntentionSuggestions";
import { breathingPrompt } from "./promptSteps";

interface IntentionInputProps {
  userIntention: string;
  onChange: (intention: string) => void;
  onSubmit: () => void;
}

const IntentionInput: React.FC<IntentionInputProps> = ({
  userIntention,
  onChange,
  onSubmit
}) => {
  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Intention Setting
        </h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">
          Let's anchor your energy with intention.<br/>
          What are you calling in today?
        </p>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-4">
          <p className="text-gray-600 italic whitespace-pre-line">
            {breathingPrompt}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <Textarea
          value={userIntention}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your intention here..."
          className="min-h-[100px] bg-white border-purple-200 focus:border-purple-400"
        />
        
        <IntentionSuggestions onSelectSuggestion={handleSelectSuggestion} />
        
        <Button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          disabled={!userIntention.trim()}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Set My Intention
        </Button>
      </div>
    </motion.div>
  );
};

export default IntentionInput;
