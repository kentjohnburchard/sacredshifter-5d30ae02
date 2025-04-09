
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem
} from "@/components/ui/select";
import { 
  Headphones, 
  Volume2, 
  WaveformIcon, 
  Timer
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface JourneySettingsValues {
  lowSensitivityMode: boolean;
  useHeadphones: boolean;
  pinkNoise: boolean;
  sleepTimer: number; // 0 means off, otherwise minutes
  saveToTimeline: boolean;
}

interface JourneySettingsProps {
  settings: JourneySettingsValues;
  onChange: (settings: Partial<JourneySettingsValues>) => void;
  disabled?: boolean;
}

const JourneySettings: React.FC<JourneySettingsProps> = ({ 
  settings, 
  onChange, 
  disabled = false 
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100 p-4 space-y-4">
        <h3 className="text-purple-800 font-medium mb-2">Journey Settings</h3>
        
        <div className="space-y-3">
          {/* Low Sensitivity Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-purple-600" />
              <Label htmlFor="low-sensitivity" className="text-sm text-gray-700">
                Low Sensitivity Mode
              </Label>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-medium cursor-help">?</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Limits high-pitched overtones. Applies a filter to reduce sharp sounds.
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Switch
              id="low-sensitivity"
              checked={settings.lowSensitivityMode}
              onCheckedChange={(checked) => onChange({ lowSensitivityMode: checked })}
              disabled={disabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          {/* Use Headphones Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-purple-600" />
              <Label htmlFor="use-headphones" className="text-sm text-gray-700">
                Enable Binaural Mode
              </Label>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-medium cursor-help">?</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Intended for optimal experience with headphones.
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Switch
              id="use-headphones"
              checked={settings.useHeadphones}
              onCheckedChange={(checked) => onChange({ useHeadphones: checked })}
              disabled={disabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          {/* Pink Noise Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WaveformIcon className="h-4 w-4 text-purple-600" />
              <Label htmlFor="pink-noise" className="text-sm text-gray-700">
                Add Pink Noise
              </Label>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-medium cursor-help">?</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Smooth background static to mask ringing.
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Switch
              id="pink-noise"
              checked={settings.pinkNoise}
              onCheckedChange={(checked) => onChange({ pinkNoise: checked })}
              disabled={disabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          
          {/* Sleep Timer Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-purple-600" />
              <Label htmlFor="sleep-timer" className="text-sm text-gray-700">
                Sleep Timer
              </Label>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-medium cursor-help">?</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Automatically stops audio playback after selected time.
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Select
              value={settings.sleepTimer.toString()}
              onValueChange={(value) => onChange({ sleepTimer: parseInt(value) })}
              disabled={disabled}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Off</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Save to Timeline Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="save-timeline" className="text-sm text-gray-700">
              Save to Timeline
            </Label>
            <Switch
              id="save-timeline"
              checked={settings.saveToTimeline}
              onCheckedChange={(checked) => onChange({ saveToTimeline: checked })}
              disabled={disabled}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JourneySettings;
