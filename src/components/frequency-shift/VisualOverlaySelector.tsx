
import React from "react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { visualOverlayOptions } from "./promptSteps";
import { VisualOverlayOption } from "./types";

interface VisualOverlaySelectorProps {
  selectedVisual: string | null;
  onSelectVisual: (visualType: string) => void;
  onContinue: () => void;
}

const VisualOverlaySelector: React.FC<VisualOverlaySelectorProps> = ({
  selectedVisual,
  onSelectVisual,
  onContinue
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Visual Overlay – Choose Your Visual Vibe
        </h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">
          Want to enhance your journey with visuals?<br/>
          Pick a visual frequency field that matches your vibe:
        </p>
      </div>
      
      <RadioGroup 
        value={selectedVisual || ""} 
        onValueChange={onSelectVisual} 
        className="space-y-4"
      >
        {visualOverlayOptions.map((option: VisualOverlayOption) => (
          <div 
            key={option.tag}
            className={`relative border border-gray-200 rounded-lg p-4 transition-all duration-300 ${
              selectedVisual === option.tag 
                ? `shadow-md border-purple-300 bg-gradient-to-r ${option.color} bg-opacity-10` 
                : "hover:border-purple-200 hover:bg-purple-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem 
                value={option.tag} 
                id={option.tag} 
                className="mt-1" 
              />
              <div className="flex-1">
                <Label 
                  htmlFor={option.tag} 
                  className={`text-lg font-medium ${selectedVisual === option.tag ? "text-purple-700" : ""}`}
                >
                  {option.text}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                
                {selectedVisual === option.tag && (
                  <div className={`h-2 w-full mt-3 rounded-full bg-gradient-to-r ${option.color}`}></div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div 
          className={`relative border border-gray-200 rounded-lg p-4 transition-all duration-300 ${
            selectedVisual === "none" 
              ? "shadow-md border-purple-300 bg-purple-50" 
              : "hover:border-purple-200 hover:bg-purple-50"
          }`}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem 
              value="none" 
              id="visual_none" 
              className="mt-1" 
            />
            <div className="flex-1">
              <Label 
                htmlFor="visual_none" 
                className={`text-lg font-medium ${selectedVisual === "none" ? "text-purple-700" : ""}`}
              >
                Just sound for now
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Enjoy the pure audio experience without visual elements
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
      
      <div className="pt-4">
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          disabled={!selectedVisual}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default VisualOverlaySelector;
