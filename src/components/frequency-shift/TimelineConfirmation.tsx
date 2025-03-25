
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TimelineConfirmationProps {
  onBackToHome: () => void;
}

const TimelineConfirmation: React.FC<TimelineConfirmationProps> = ({
  onBackToHome
}) => {
  const navigate = useNavigate();

  const handleViewTimeline = () => {
    navigate("/timeline"); // Updated to use the new Timeline route
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
          Timeline Updated
        </h3>
        <p className="text-gray-600">
          ✨ Your moment has been saved to your Timeline.
          <br />
          You can return to it anytime to reconnect with this vibration.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex items-center justify-center border-purple-200"
          onClick={handleViewTimeline}
        >
          <Clock className="mr-2 h-4 w-4" />
          View My Timeline
        </Button>

        <Button
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          onClick={onBackToHome}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TimelineConfirmation;
