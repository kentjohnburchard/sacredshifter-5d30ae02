
import React, { useState, useEffect } from 'react';
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

  const handleQuizComplete = async () => {
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
  };

  const startQuiz = () => {
    setStage('quiz');
  };

  const createNewBlueprint = () => {
    setBlueprint(null);
    setStage('quiz');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {stage === 'intro' && (
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Discover Your Sacred Blueprint
          </h2>
          <p className="mb-6 text-gray-700">
            Your Sacred Blueprint is a personalized frequency chart and spiritual identity map 
            based on your energy, emotions, and resonance tendencies. It reveals your unique 
            vibrational signature and provides insights into your energetic nature.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={startQuiz} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-indigo-600" />
          <h3 className="text-xl font-medium mb-2">Generating Your Sacred Blueprint</h3>
          <p className="text-gray-600">We are connecting with your unique frequency...</p>
        </div>
      )}

      {stage === 'display' && blueprint && (
        <div className="space-y-6">
          <BlueprintDisplay blueprint={blueprint} />
          
          <div className="flex justify-center">
            <Button 
              onClick={createNewBlueprint} 
              variant="outline"
              className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
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
