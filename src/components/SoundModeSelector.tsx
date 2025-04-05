
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Music2, Waves, MessageCircle } from "lucide-react";
import { SoundMode } from "@/utils/focusTrackMap";
import { toast } from "sonner";

interface SoundModeSelectorProps {
  soundMode: SoundMode;
  onChange: (mode: SoundMode) => void;
}

const SoundModeSelector: React.FC<SoundModeSelectorProps> = ({ soundMode, onChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-500">SOUND MODE</h4>
      <ToggleGroup 
        type="single" 
        value={soundMode} 
        onValueChange={(value) => {
          if (value) onChange(value as SoundMode);
        }}
        className="justify-start"
      >
        <ToggleGroupItem 
          value="pureTone" 
          aria-label="Pure Tone"
          onClick={() => toast.info("Pure frequency tone only")}
          className="flex flex-col items-center gap-1 px-3 py-2"
        >
          <Waves className="h-4 w-4" />
          <span className="text-xs">Pure Tone</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="ambient" 
          aria-label="Layered Ambient"
          onClick={() => toast.info("Frequency with ambient soundscape")}
          className="flex flex-col items-center gap-1 px-3 py-2"
        >
          <Music2 className="h-4 w-4" />
          <span className="text-xs">Ambient</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="affirmation" 
          aria-label="Affirmation Boost"
          onClick={() => toast.info("Includes whispered affirmations")}
          className="flex flex-col items-center gap-1 px-3 py-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Affirmations</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default SoundModeSelector;
