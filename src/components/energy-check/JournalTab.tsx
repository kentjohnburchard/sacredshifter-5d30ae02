
import React from "react";
import { Link } from "react-router-dom";
import JournalSection from "@/components/JournalSection";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const JournalTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <JournalSection />
      
      <div className="flex justify-center mt-8">
        <Link to="/timeline">
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Clock className="h-4 w-4" />
            View My Timeline
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JournalTab;
