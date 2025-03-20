
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HealingFrequency } from "@/data/frequencies";
import { Music2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FrequencySelectorProps {
  frequencies: HealingFrequency[];
  selectedFrequency: HealingFrequency;
  onSelect: (frequency: HealingFrequency) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ 
  frequencies, 
  selectedFrequency, 
  onSelect 
}) => {
  return (
    <Card className="border-none shadow-xl glass bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 text-center text-white">Sacred Frequencies</h3>
        <ScrollArea className="h-[500px] pr-3">
          <div className="space-y-2">
            {frequencies.map((freq) => (
              <div
                key={freq.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102
                  ${selectedFrequency.id === freq.id 
                    ? `bg-gradient-to-r ${freq.color} shadow-lg shadow-${freq.color.split('-')[1]}/20` 
                    : 'bg-white/5 hover:bg-white/10 border border-white/5'
                  }
                `}
                onClick={() => onSelect(freq)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className={`font-medium ${selectedFrequency.id === freq.id ? 'text-white' : 'text-slate-200'}`}>
                      {freq.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Music2 className={`h-3 w-3 ${selectedFrequency.id === freq.id ? 'text-white/90' : 'text-slate-400'}`} />
                      <p className={`text-sm ${selectedFrequency.id === freq.id ? 'text-white/90' : 'text-slate-400'}`}>
                        {freq.frequency} Hz
                      </p>
                    </div>
                  </div>
                  {freq.chakra && (
                    <span className={`text-xs px-2 py-1 rounded-full 
                      ${selectedFrequency.id === freq.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-slate-200'}`
                      }
                    >
                      {freq.chakra}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FrequencySelector;
