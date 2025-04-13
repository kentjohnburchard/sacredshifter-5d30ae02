
import React, { useState, useEffect } from "react";
import { JourneyTemplate } from "@/data/journeyTemplates";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
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
  
  // Auto-start the journey when component mounts and is open
  useEffect(() => {
    if (open) {
      // Small delay to ensure proper rendering/mounting
      const timer = setTimeout(() => {
        onStart(defaultIntention, defaultSettings);
        // Notify user that the journey has started
        toast.success(`${template.title} journey started`, {
          icon: <Sparkles className="text-purple-500" />,
          duration: 3000
        });
        // Close the "modal" (which will now actually just be a controller)
        onOpenChange(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [open, onStart, template.title, defaultSettings, onOpenChange]);

  // Return an empty fragment as we're no longer showing a modal
  return null;
};

export default JourneyPreStartModal;
