
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Home } from "lucide-react";
import { sessionCloseOptions, sessionCloseText } from "./promptSteps";
import JournalEntryForm from "./JournalEntryForm";

interface SessionCloseOptionsProps {
  onSaveToTimeline: () => void;
  onResetIntention: () => void;
  onReturnHome: () => void;
  frequency?: number;
  chakra?: string;
  visualType?: string;
  intention?: string;
}

const SessionCloseOptions: React.FC<SessionCloseOptionsProps> = ({
  onSaveToTimeline,
  onResetIntention,
  onReturnHome,
  frequency,
  chakra,
  visualType,
  intention
}) => {
  const [showJournalForm, setShowJournalForm] = useState(false);

  const getIcon = (tag: string) => {
    switch (tag) {
      case "save_session":
        return <Save className="mr-2 h-4 w-4" />;
      case "reset_intention":
        return <RefreshCw className="mr-2 h-4 w-4" />;
      case "return_home":
        return <Home className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleOptionClick = (tag: string) => {
    switch (tag) {
      case "save_session":
        setShowJournalForm(true);
        break;
      case "reset_intention":
        onResetIntention();
        break;
      case "return_home":
        onReturnHome();
        break;
      default:
        break;
    }
  };

  const handleJournalSaved = () => {
    setShowJournalForm(false);
    onSaveToTimeline();
  };

  if (showJournalForm) {
    return (
      <JournalEntryForm
        frequency={frequency}
        chakra={chakra}
        visualType={visualType}
        intention={intention}
        onSaved={handleJournalSaved}
        onCancel={() => setShowJournalForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
          Journey Complete
        </h3>
        <p className="text-gray-600 whitespace-pre-line">
          {sessionCloseText}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sessionCloseOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full py-6 flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
            onClick={() => handleOptionClick(option.tag)}
          >
            {getIcon(option.tag)}
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SessionCloseOptions;
