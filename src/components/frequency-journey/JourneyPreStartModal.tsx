
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import JourneySettings, { JourneySettingsValues } from "./JourneySettings";
import { JourneyTemplate } from "@/data/journeyTemplates";

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
  const [intention, setIntention] = useState("");
  const [settings, setSettings] = useState<JourneySettingsValues>(defaultSettings);
  const [currentStep, setCurrentStep] = useState<'intention' | 'guided' | 'settings'>('intention');
  
  const handleStart = () => {
    onStart(intention, settings);
    onOpenChange(false);
    // Reset state for next time
    setCurrentStep('intention');
  };
  
  const handleSettingChange = (newSettings: Partial<JourneySettingsValues>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{template.title} Journey</DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {currentStep === 'intention' && (
            <motion.div
              key="intention"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-center">Set Your Intention</h3>
              <p className="text-sm text-gray-600">
                What would you like to experience or achieve during this journey?
              </p>
              <Textarea
                placeholder="I am open to..."
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={() => setCurrentStep('guided')}
                className="w-full"
                disabled={!intention.trim()}
              >
                Continue
              </Button>
            </motion.div>
          )}
          
          {currentStep === 'guided' && (
            <motion.div
              key="guided"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-center">Guided Prompt</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {template.guidedPrompt || `Sit comfortably or lie down. 
Let your awareness drop into your breath. 
Imagine your intention as a frequency. 
Each breath aligns you with this frequency.
You are tuning yourself to a new vibration.`}
                </p>
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('intention')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep('settings')}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
          
          {currentStep === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <JourneySettings 
                settings={settings}
                onChange={handleSettingChange}
              />
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('guided')}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleStart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Begin Journey
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default JourneyPreStartModal;
