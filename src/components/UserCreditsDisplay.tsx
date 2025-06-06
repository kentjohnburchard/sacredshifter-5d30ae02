
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface UserCreditsDisplayProps {
  isLoading?: boolean;
  credits?: number;
}

const UserCreditsDisplay: React.FC<UserCreditsDisplayProps> = ({ isLoading = false, credits }) => {
  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-black/70 backdrop-blur-md border border-white/10">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-slate-600"></div>
            <div className="h-4 w-24 bg-slate-600 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-slate-600 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-black/70 backdrop-blur-md border border-white/10">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {credits !== undefined ? (
            <span className="text-sm text-slate-300">Credits: {credits}</span>
          ) : (
            <span className="text-sm text-slate-300">Unlock premium features</span>
          )}
        </div>
        <Link to="/subscription">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscribe Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default UserCreditsDisplay;
