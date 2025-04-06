
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TimelineConfirmationProps {
  onBackToHome: () => void;
}

const TimelineConfirmation: React.FC<TimelineConfirmationProps> = ({
  onBackToHome
}) => {
  const navigate = useNavigate();

  const handleViewTimeline = () => {
    // Redirect to dashboard instead of timeline since timeline is now part of dashboard
    navigate("/dashboard"); 
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
          ✨ Your moment has been saved to your Dashboard Timeline.
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
          View Dashboard
        </Button>

        <Button
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          onClick={onBackToHome}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TimelineConfirmation;
