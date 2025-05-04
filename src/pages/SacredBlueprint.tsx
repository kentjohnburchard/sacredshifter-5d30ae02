
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import BlueprintChart from '@/components/sacred-blueprint/BlueprintChart';
import BlueprintDisplay from '@/components/sacred-blueprint/BlueprintDisplay';
import BlueprintQuiz from '@/components/sacred-blueprint/BlueprintQuiz';
import SacredBlueprintCreator from '@/components/sacred-blueprint/SacredBlueprintCreator';
import { ChakraData, ChakraSignature, SacredBlueprint as BlueprintType } from '@/types/blueprint';
import { toast } from 'sonner';

const SacredBlueprint: React.FC = () => {
  const [blueprint, setBlueprint] = useState<BlueprintType | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock blueprint data for display when no actual blueprint is generated yet
  const mockBlueprint: BlueprintType = {
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    core_frequency: "Cosmic Harmony",
    frequency_value: 528,
    elemental_resonance: "water",
    energetic_archetype: "The Harmonizer",
    emotional_profile: "Balanced Empathy",
    musical_key: "C Major",
    blueprint_text: "Your sacred blueprint reveals a deep connection to cosmic harmony. You are a natural healer with the ability to bring balance to chaotic situations.",
    chakra_signature: {
      root: { strength: 72, color: "#FF0000" },
      sacral: { strength: 65, color: "#FF7F00" },
      solar: { strength: 80, color: "#FFFF00" },
      heart: { strength: 90, color: "#00FF00" },
      throat: { strength: 75, color: "#00FFFF" },
      third_eye: { strength: 85, color: "#0000FF" },
      crown: { strength: 70, color: "#8B00FF" }
    },
    shadow_frequencies: [
      "Fear of abandonment",
      "Resistance to change"
    ]
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    // In a real application, this would fetch the blueprint from an API
    setBlueprint(mockBlueprint);
    toast.success("Your Sacred Blueprint has been generated!");
  };

  return (
    <Layout pageTitle="Sacred Blueprint™" hideHeader={true}>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/60 backdrop-blur-md border-purple-500/30 mb-12 shadow-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white text-center text-contrast-high">Sacred Blueprint™</h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto">
              Discover your unique energetic blueprint and spiritual path.
            </p>
          </div>
        </Card>
        
        <div className="space-y-16">
          <section className="py-8">
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-indigo-200 text-center">Create Your Blueprint</h2>
              <SacredBlueprintCreator />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-indigo-200 text-center">Blueprint Assessment</h2>
              <BlueprintQuiz onComplete={handleQuizComplete} />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-indigo-200 text-center">Blueprint Visualization</h2>
              <BlueprintChart blueprint={blueprint || mockBlueprint} />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/60 border-indigo-500/30 backdrop-blur-md p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-indigo-200 text-center">Your Blueprint Results</h2>
              <BlueprintDisplay blueprint={blueprint || mockBlueprint} />
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
