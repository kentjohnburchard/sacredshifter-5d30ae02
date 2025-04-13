
import React, { useEffect } from "react";
import { JourneyTemplate } from "@/data/journeyTemplates";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export interface JourneySettingsValues {
  lowSensitivityMode: boolean;
  useHeadphones: boolean;
  pinkNoise: boolean;
  sleepTimer: number;
  saveToTimeline: boolean;
}

interface JourneyPreStartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: JourneyTemplate;
  onStart: (intention: string, settings: JourneySettingsValues) => void;
  defaultSettings?: JourneySettingsValues;
}

const JourneyPreStartModal: React.FC<JourneyPreStartModalProps> = ({
  open,
  onOpenChange,
  template,
  onStart,
  defaultSettings = {
    lowSensitivityMode: false,
    useHeadphones: true,
    pinkNoise: false,
    sleepTimer: 0,
    saveToTimeline: true
  }
}) => {
  // Set a default intention
  const defaultIntention = `Open to experiencing ${template.title}`;
  
  useEffect(() => {
    // If modal is open, trigger the onStart immediately
    if (open) {
      // Start the journey immediately without showing a modal
      onStart(defaultIntention, defaultSettings);
      
      // Notify user that the journey has started
      toast.success(`${template.title} journey started`, {
        icon: <Sparkles className="text-purple-500" />,
        duration: 3000,
        description: "Fractal visualizer activated. Tune in to the sacred prime sequence patterns."
      });
      
      // Close the modal since we don't need it anymore
      onOpenChange(false);
    }
  }, [open, template.title, defaultIntention, defaultSettings, onStart, onOpenChange]);

  // We're not rendering any UI for this modal anymore
  return null;
};

export default JourneyPreStartModal;
