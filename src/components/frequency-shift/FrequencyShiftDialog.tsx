
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InfoDialogContent from "./InfoDialogContent";
import { HealingFrequency } from "@/data/frequencies";

interface FrequencyShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchedFrequency: HealingFrequency | null;
  onBeginJourney: () => void;
}

const FrequencyShiftDialog: React.FC<FrequencyShiftDialogProps> = ({
  open,
  onOpenChange,
  matchedFrequency,
  onBeginJourney
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          onBeginJourney={onBeginJourney}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FrequencyShiftDialog;
