
import React from "react";
import { HealingFrequency } from "@/data/frequencies";
import { Heart, Shield, Brain, Sparkles, Zap } from "lucide-react";

interface FrequencyInfoProps {
  frequency: HealingFrequency;
}

const FrequencyInfo: React.FC<FrequencyInfoProps> = ({ frequency }) => {
  const getBenefitIcon = (benefit: string, index: number) => {
    const iconClasses = "h-4 w-4 mr-2 text-purple-300";
    
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
    <div className="space-y-6">
      <div>
        <p className="text-slate-200">{frequency.description}</p>
      </div>
      
      {frequency.benefits && frequency.benefits.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3 text-white">Benefits</h4>
          <ul className="space-y-2">
            {frequency.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                {getBenefitIcon(benefit, index)}
                <span className="text-slate-200">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {frequency.chakra && (
        <div>
          <h4 className="text-md font-medium mb-2 text-white">Associated Chakra</h4>
          <div className={`inline-block px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${frequency.color}`}>
            {frequency.chakra}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyInfo;
