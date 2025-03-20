
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HealingFrequency } from "@/data/frequencies";
import { Heart, Shield, Brain, Sparkles, Zap } from "lucide-react";

interface FrequencyInfoProps {
  frequency: HealingFrequency;
}

const FrequencyInfo: React.FC<FrequencyInfoProps> = ({ frequency }) => {
  const getBenefitIcon = (benefit: string, index: number) => {
    const iconClasses = "h-4 w-4 mr-2";
    
    // Simple heuristic to match icons with benefits
    if (benefit.toLowerCase().includes("heal") || benefit.toLowerCase().includes("heart") || benefit.toLowerCase().includes("love")) {
      return <Heart className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("protect") || benefit.toLowerCase().includes("defense") || benefit.toLowerCase().includes("immune")) {
      return <Shield className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("mind") || benefit.toLowerCase().includes("conscious") || benefit.toLowerCase().includes("mental")) {
      return <Brain className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("energy") || benefit.toLowerCase().includes("power") || benefit.toLowerCase().includes("activate")) {
      return <Zap className={iconClasses} />;
    } else {
      return <Sparkles className={iconClasses} />;
    }
  };
  
  return (
    <Card className="border border-border/40 shadow-sm bg-white dark:bg-gray-900">
      <CardContent className="p-5">
        <h3 className="text-xl font-medium mb-4">About this Frequency</h3>
        
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">{frequency.description}</p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Benefits</h4>
            <ul className="space-y-2">
              {frequency.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm">
                  {getBenefitIcon(benefit, index)}
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {frequency.chakra && (
            <div>
              <h4 className="text-md font-medium mb-2">Associated Chakra</h4>
              <div className={`inline-block px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${frequency.color}`}>
                {frequency.chakra}
              </div>
            </div>
          )}
          
          <div className="text-sm italic text-muted-foreground mt-4">
            <p>
              Note: Listen to this frequency for at least 5-10 minutes daily for optimal benefits. 
              Results may vary and these frequencies should complement, not replace, professional care.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyInfo;
