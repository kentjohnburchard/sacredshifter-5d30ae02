
import React from "react";
import { HealingFrequency } from "@/data/frequencies";

interface FrequencyMatchDisplayProps {
  frequency: HealingFrequency;
}

const FrequencyMatchDisplay: React.FC<FrequencyMatchDisplayProps> = ({ frequency }) => {
  return (
    <div className="text-center mb-4">
      <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        {frequency.frequency} Hz
      </div>
      <div className="text-lg text-gray-700 mb-4">
        {frequency.name}
      </div>
      <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 font-medium mb-4">
        {frequency.chakra || "Healing"} Energy
      </div>
    </div>
  );
};

export default FrequencyMatchDisplay;
