
import React, { useState, useEffect, useCallback, memo } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import { generateBlueprint, saveBlueprint, getUserQuizResponses, getUserAstroData, fetchUserBlueprint } from '@/utils/blueprintUtils';
import BlueprintQuiz from './BlueprintQuiz';
import BlueprintDisplay from './BlueprintDisplay';
import { Sparkles, Loader2 } from 'lucide-react';

// Completely refactored for better performance
const SacredBlueprintCreator: React.FC = () => {
  const { user } = useAuth();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'generating' | 'display'>('intro');
  const [blueprint, setBlueprint] = useState<SacredBlueprint | null>(null);
  const [loading, setLoading] = useState(true);

  // Simplified initialization
  useEffect(() => {
    const checkExistingBlueprint = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: existingBlueprint } = await fetchUserBlueprint(user.id);
        
        if (existingBlueprint) {
          setBlueprint(existingBlueprint);
          setStage('display');
        }
      } catch (error) {
        console.error("Error checking for existing blueprint:", error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to prevent immediate heavy operations
    const timer = setTimeout(() => {
      checkExistingBlueprint();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleQuizComplete = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to generate a blueprint");
      return;
    }

    setStage('generating');

    try {
      // Get user data with catch for errors
      const { data: responses } = await getUserQuizResponses(user.id);
      const { data: astroData } = await getUserAstroData(user.id);
      
      const generatedBlueprint = await generateBlueprint(user.id, responses, astroData);
      const { error } = await saveBlueprint(generatedBlueprint);
      
      if (error) {
        throw new Error("Failed to save blueprint");
      }
      
      setBlueprint(generatedBlueprint);
      setStage('display');
      toast.success("Your Sacred Blueprint has been created!");
    } catch (error) {
      console.error("Error generating blueprint:", error);
      toast.error("There was an error generating your blueprint. Please try again.");
      setStage('quiz');
    }
  }, [user]);

  const startQuiz = useCallback(() => {
    setStage('quiz');
  }, []);

  const createNewBlueprint = useCallback(() => {
    setBlueprint(null);
    setStage('quiz');
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
      </div>
    );
  }

  // Simplified render logic
  return (
    <div className="w-full mx-auto text-white">
      {stage === 'intro' && (
        <Card className="p-6 text-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
            Discover Your Sacred Blueprint
          </h2>
          <p className="mb-6 text-gray-200">
            Your Sacred Blueprint reveals your unique vibrational signature and provides insights into your energetic nature.
          </p>
          <Button 
            onClick={startQuiz} 
            className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-700/80 hover:to-purple-700/80"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Begin Sacred Blueprint Journey
          </Button>
        </Card>
      )}

      {stage === 'quiz' && (
        <BlueprintQuiz onComplete={handleQuizComplete} />
      )}

      {stage === 'generating' && (
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-indigo-400" />
          <h3 className="text-xl font-medium mb-2 text-white">Generating Your Blueprint</h3>
          <p className="text-gray-300">Please wait...</p>
        </div>
      )}

      {stage === 'display' && blueprint && (
        <div className="space-y-6">
          <BlueprintDisplay blueprint={blueprint} />
          
          <div className="flex justify-center mt-4">
            <Button 
              onClick={createNewBlueprint} 
              variant="outline"
              className="text-indigo-200 border-indigo-400/30 hover:bg-indigo-800/30"
            >
              Create a New Blueprint
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SacredBlueprintCreator);
