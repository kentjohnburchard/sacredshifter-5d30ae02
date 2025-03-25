
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Info } from "lucide-react";

interface ActionButtonsProps {
  onLearnMore: () => void;
  onSaveAndBegin: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onLearnMore, onSaveAndBegin }) => {
  return (
    <div className="flex justify-center gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onLearnMore}
        className="flex items-center gap-2 text-purple-700 border-purple-200 hover:border-purple-300"
      >
        <Info className="h-4 w-4" />
        Learn More
      </Button>
      <Button
        onClick={onSaveAndBegin}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
      >
        <Heart className="h-4 w-4" />
        Save & Begin
      </Button>
    </div>
  );
};

export default ActionButtons;
