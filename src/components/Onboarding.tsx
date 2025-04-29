
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleComplete = () => {
    // In a real implementation, you would update the user profile
    // to mark onboarding as completed
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <Card className="w-full max-w-lg border border-border/40 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome to Sacred Shifter</CardTitle>
          <CardDescription>
            Complete your profile to get personalized frequency recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Welcome, {user?.email}! We're excited to have you join our community of sound healing enthusiasts.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-center font-medium">
              Onboarding is currently being set up.
            </p>
            <p className="text-center text-muted-foreground">
              You can proceed to the dashboard to start exploring Sacred Shifter's features.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
