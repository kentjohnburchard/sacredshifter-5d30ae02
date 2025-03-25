
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IntentionInputProps {
  userIntention: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const IntentionInput: React.FC<IntentionInputProps> = ({
  userIntention,
  onChange,
  onSubmit
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-700">Set an intention for your frequency session:</p>
      </div>
      <Input
        type="text"
        placeholder="I am open to receiving healing energy..."
        value={userIntention}
        onChange={(e) => onChange(e.target.value)}
        className="text-center border-purple-200 focus:border-purple-500"
      />
      <div className="flex justify-center pt-4">
        <Button 
          onClick={onSubmit}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        >
          Set Intention
        </Button>
      </div>
    </div>
  );
};

export default IntentionInput;
