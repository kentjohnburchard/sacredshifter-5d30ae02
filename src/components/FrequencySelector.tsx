
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HealingFrequency } from "@/data/frequencies";

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
    <Card className="border border-border/40 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Healing Frequencies</h3>
        <div className="space-y-2">
          {frequencies.map((freq) => (
            <div
              key={freq.id}
              className={`
                p-3 rounded-lg cursor-pointer transition-all
                ${selectedFrequency.id === freq.id 
                  ? `bg-gradient-to-r ${freq.color} text-white shadow-md` 
                  : 'bg-card hover:bg-accent/50'
                }
              `}
              onClick={() => onSelect(freq)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{freq.name}</h4>
                  <p className={`text-sm ${selectedFrequency.id === freq.id ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {freq.frequency} Hz
                  </p>
                </div>
                {freq.chakra && (
                  <span className={`text-xs px-2 py-1 rounded-full ${selectedFrequency.id === freq.id ? 'bg-white/20' : 'bg-accent'}`}>
                    {freq.chakra}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencySelector;
