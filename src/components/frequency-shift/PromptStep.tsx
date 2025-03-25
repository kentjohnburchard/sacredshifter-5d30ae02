
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export type PromptOption = {
  text: string;
  tag: string;
  frequency?: number;
  chakra?: string;
};

interface PromptStepProps {
  step: number;
  title: string;
  text: string;
  options: PromptOption[];
  onOptionSelect: (option: PromptOption) => void;
  onStartOver?: () => void;
  showStartOver?: boolean;
}

const PromptStep: React.FC<PromptStepProps> = ({
  step,
  title,
  text,
  options,
  onOptionSelect,
  onStartOver,
  showStartOver
}) => {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          {title}
        </h3>
        <p className="text-gray-600 whitespace-pre-line">{text}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              onClick={() => onOptionSelect(option)}
              className="w-full py-6 px-4 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md"
              variant="outline"
            >
              {option.text}
            </Button>
          </motion.div>
        ))}
      </div>

      {showStartOver && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="text-gray-500 hover:text-gray-700"
          >
            Start Over
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PromptStep;
