
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Volume2, Headphones, HeadphoneOff, Timer, Info } from 'lucide-react';

interface JourneySettingsProps {
  lowSensitivityMode: boolean;
  setLowSensitivityMode: (value: boolean) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  sleepTimer: number;
  setSleepTimer: (value: number) => void;
  saveToTimeline: boolean;
  setSaveToTimeline: (value: boolean) => void;
}

const JourneySettings: React.FC<JourneySettingsProps> = ({
  lowSensitivityMode,
  setLowSensitivityMode,
  useHeadphones,
  setUseHeadphones,
  sleepTimer,
  setSleepTimer,
  saveToTimeline,
  setSaveToTimeline
}) => {
  // Format the timers for display
  const formatTimer = (minutes: number) => {
    if (minutes === 0) return "No timer";
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-purple-700">Journey Settings</h3>
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Low Sensitivity Mode</span>
          </div>
          <Switch 
            checked={lowSensitivityMode}
            onCheckedChange={setLowSensitivityMode}
          />
          <span className="text-xs text-gray-500 ml-2 w-20">
            {lowSensitivityMode ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {useHeadphones ? (
              <Headphones className="h-4 w-4 text-purple-600" />
            ) : (
              <HeadphoneOff className="h-4 w-4 text-purple-600" />
            )}
            <span className="text-sm font-medium">Use Headphones</span>
          </div>
          <Switch 
            checked={useHeadphones}
            onCheckedChange={setUseHeadphones}
          />
          <span className="text-xs text-gray-500 ml-2 w-20">
            {useHeadphones ? 'Headphones' : 'Speakers'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Sleep Timer: {formatTimer(sleepTimer)}</span>
          </div>
          <Slider
            min={0}
            max={60}
            step={5}
            value={[sleepTimer]}
            onValueChange={(value) => setSleepTimer(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Off</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Save to Timeline</span>
          </div>
          <Switch 
            checked={saveToTimeline}
            onCheckedChange={setSaveToTimeline}
          />
          <span className="text-xs text-gray-500 ml-2 w-20">
            {saveToTimeline ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JourneySettings;
