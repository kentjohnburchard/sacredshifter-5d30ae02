
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InfoIcon, RefreshCcw } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionControlsProps {
  loopEnabled: boolean;
  cycleFrequencies: boolean;
  onLoopChange: (enabled: boolean) => void;
  onCycleChange: (enabled: boolean) => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  loopEnabled,
  cycleFrequencies,
  onLoopChange,
  onCycleChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="loop-audio" className="text-sm text-gray-600">Loop Audio</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Continue playing audio after completion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch 
          id="loop-audio" 
          checked={loopEnabled}
          onCheckedChange={onLoopChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1.5">
            <RefreshCcw className="h-3.5 w-3.5 text-gray-600" />
            <Label htmlFor="cycle-frequencies" className="text-sm text-gray-600">
              Cycle Frequencies
            </Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Rotate between 396Hz, 432Hz, and 528Hz during the session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch 
          id="cycle-frequencies" 
          checked={cycleFrequencies}
          onCheckedChange={onCycleChange}
        />
      </div>
    </div>
  );
};

export default SessionControls;
