
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { TrademarkedName } from "@/components/ip-protection";
import { Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import BlueprintQuiz from "@/components/sacred-blueprint/BlueprintQuiz";
import BlueprintDisplay from "@/components/sacred-blueprint/BlueprintDisplay";
import BlueprintChart from "@/components/sacred-blueprint/BlueprintChart";
import { type SacredBlueprint as BlueprintType } from "@/types/blueprint";
import { toast } from "sonner";

// Sample mock blueprint data for demo purposes
const mockBlueprint: BlueprintType = {
  user_id: "user123",
  created_at: new Date().toISOString(),
  core_frequency: "Harmonic Resonator",
  frequency_value: 432,
  elemental_resonance: "water",
  energetic_archetype: "The Visionary Healer",
  emotional_profile: "Empathic Intuitive",
  musical_key: "A Major",
  blueprint_text: "Your essence vibrates with the healing frequencies of water. You naturally attune to emotional currents around you, making you a natural empath and healer. Your sacred purpose involves bridging worlds through your intuitive gifts.",
  chakra_signature: {
    root: { strength: 75, color: "#ff0000" },
    sacral: { strength: 82, color: "#ff7f00" },
    solar: { strength: 65, color: "#ffff00" },
    heart: { strength: 92, color: "#00ff00" },
    throat: { strength: 78, color: "#00ffff" },
    third_eye: { strength: 86, color: "#0000ff" },
    crown: { strength: 70, color: "#8b00ff" }
  },
  shadow_frequencies: [
    "Fear of full expression",
    "Resistance to deep emotional connection",
    "Tendency toward people-pleasing"
  ],
  version: 1
};

const SacredBlueprintPage = () => {
  const { user } = useAuth();
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintType | null>(null);

  // Simulate loading the blueprint
  const generateBlueprint = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBlueprint(mockBlueprint);
      setIsQuizComplete(true);
      toast.success("Your Sacred Blueprint™ has been revealed");
    } catch (error) {
      toast.error("Error generating blueprint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = () => {
    generateBlueprint();
  };

  const resetBlueprint = () => {
    setIsQuizComplete(false);
    setBlueprint(null);
  };

  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {!isQuizComplete ? (
            <BlueprintQuiz onComplete={handleQuizComplete} />
          ) : (
            blueprint && <BlueprintDisplay blueprint={blueprint} />
          )}
        </AnimatePresence>
        
        {isQuizComplete && blueprint && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={resetBlueprint}>
              Retake Blueprint Quiz
            </Button>
          </div>
        )}
        
        {/* Additional information about the blueprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-playfair mb-4 text-purple-300">Your Unique Blueprint</h2>
            <p className="text-gray-300 mb-4">
              Every soul has a unique energetic signature - a blueprint designed to help you 
              fulfill your purpose in this incarnation. Understand yours to unlock your greatest potential.
            </p>
            <p className="text-gray-300">
              The Sacred Blueprint™ helps you identify your core frequencies, soul lessons, 
              and energetic patterns that shape your journey.
            </p>
            
            <div className="mt-8 space-y-4">
              <Card className="bg-purple-900/30 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-purple-200">Core Frequency Analysis</h3>
                  </div>
                  <p className="text-gray-300">
                    Discover your unique vibrational signature that influences how you perceive
                    and interact with the world around you.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-indigo-900/30 border-indigo-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-medium text-indigo-200">Chakra Energy Assessment</h3>
                  </div>
                  <p className="text-gray-300">
                    Map your energy centers and understand how they shape your emotional, mental,
                    and spiritual experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="h-96">
            {blueprint ? (
              <BlueprintChart blueprint={blueprint} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-purple-400 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprintPage;
