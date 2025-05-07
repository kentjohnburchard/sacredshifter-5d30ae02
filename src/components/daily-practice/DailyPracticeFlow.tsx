import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDailyPractice } from '@/context/DailyPracticeContext';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { DailyPractice } from '@/types/daily-practice';
import { recordJourneyEvent } from '@/services/timelineService';

const DailyPracticeFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    dailyPractice, 
    currentStep, 
    completeStep, 
    resetDailyPractice, 
    isLoading, 
    error 
  } = useDailyPractice();
  const { openModal } = useModal();
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Daily Practice",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleComplete = async () => {
    if (!dailyPractice || !user) return;

    setIsCompleting(true);
    try {
      await completeStep();
      
      // Record the completion event in the timeline
      await recordJourneyEvent(
        user.id,
        'daily_practice_step_complete',
        `Completed Step ${currentStep + 1} of Daily Practice`,
        'daily_practice',
        { step: currentStep + 1, totalSteps: dailyPractice.steps.length }
      );

      if (currentStep < dailyPractice.steps.length - 1) {
        toast({
          title: "Step Completed",
          description: `Moving to step ${currentStep + 2}`,
        });
      } else {
        toast({
          title: "Daily Practice Complete!",
          description: "You've completed all steps for today.",
        });
      }
    } catch (err) {
      console.error("Error completing step:", err);
      toast({
        title: "Error Completing Step",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleReset = () => {
    openModal({
      title: "Reset Daily Practice?",
      description: "Are you sure you want to reset your progress? This cannot be undone.",
      confirmText: "Yes, Reset",
      cancelText: "Cancel",
      onConfirm: () => {
        resetDailyPractice();
        toast({
          title: "Practice Reset",
          description: "Your daily practice has been reset.",
        });
      },
    });
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (isLoading || !dailyPractice) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loading Daily Practice...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          Failed to load daily practice.
        </CardContent>
      </Card>
    );
  }

  const step = dailyPractice.steps[currentStep];
  const progress = ((currentStep + 1) / dailyPractice.steps.length) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{dailyPractice.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of {dailyPractice.steps.length}
          </p>
        </div>
        <div className="text-lg font-semibold">{step.title}</div>
        <div className="text-muted-foreground">{step.description}</div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handleGoBack}>
            Back to Dashboard
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={isCompleting}
          >
            {isCompleting ? (
              <>
                Completing...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : currentStep === dailyPractice.steps.length - 1 ? (
              <>
                Complete Practice <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Step"
            )}
          </Button>
        </div>
        {currentStep > 0 && (
          <div className="flex justify-center mt-4">
            <Button variant="ghost" onClick={handleReset}>
              Reset Practice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPracticeFlow;
