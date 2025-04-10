
import React, { useState, useEffect, useCallback } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';
import { generateBlueprint, saveBlueprint, getUserQuizResponses, getUserAstroData, fetchUserBlueprint } from '@/utils/blueprintUtils';
import BlueprintQuiz from './BlueprintQuiz';
import BlueprintDisplay from './BlueprintDisplay';
import { Sparkles, Loader2 } from 'lucide-react';

export const SacredBlueprintCreator: React.FC = () => {
  const { user } = useAuth();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'generating' | 'display'>('intro');
  const [blueprint, setBlueprint] = useState<SacredBlueprint | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if the user already has a blueprint
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

    checkExistingBlueprint();
  }, [user]);

  const handleQuizComplete = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to generate a blueprint");
      return;
    }

    setStage('generating');

    try {
      // Get all user quiz responses
      const { data: responses } = await getUserQuizResponses(user.id);
      
      // Get user astrology data if available
      const { data: astroData } = await getUserAstroData(user.id);
      
      // Generate blueprint from responses
      const generatedBlueprint = await generateBlueprint(user.id, responses, astroData);
      
      // Save blueprint to database
      const { error } = await saveBlueprint(generatedBlueprint);
      
      if (error) {
        throw new Error("Failed to save blueprint");
      }
      
      // Update local state with new blueprint
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-white">
      {stage === 'intro' && (
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
            Discover Your Sacred Blueprint
          </h2>
          <p className="mb-6 text-gray-200">
            Your Sacred Blueprint is a personalized frequency chart and spiritual identity map 
            based on your energy, emotions, and resonance tendencies. It reveals your unique 
            vibrational signature and provides insights into your energetic nature.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={startQuiz} 
              className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-700/80 hover:to-purple-700/80 shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Begin Sacred Blueprint Journey
            </Button>
          </div>
        </Card>
      )}

      {stage === 'quiz' && (
        <BlueprintQuiz onComplete={handleQuizComplete} />
      )}

      {stage === 'generating' && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-indigo-400" />
          <h3 className="text-xl font-medium mb-2 text-white">Generating Your Sacred Blueprint</h3>
          <p className="text-gray-300">We are connecting with your unique frequency...</p>
        </div>
      )}

      {stage === 'display' && blueprint && (
        <div className="space-y-6">
          <BlueprintDisplay blueprint={blueprint} />
          
          <div className="flex justify-center">
            <Button 
              onClick={createNewBlueprint} 
              variant="outline"
              className="text-indigo-200 border-indigo-400/30 hover:bg-indigo-800/30"
            >
              Create a New Blueprint (Version {(blueprint.version || 1) + 1})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SacredBlueprintCreator;
