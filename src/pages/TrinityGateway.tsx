
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { AnimatePresence } from "framer-motion";
import TrinityIntro from "@/components/trinity-gateway/TrinityIntro";
import TrinityPhase1 from "@/components/trinity-gateway/TrinityPhase1";
import TrinityPhase2 from "@/components/trinity-gateway/TrinityPhase2";
import TrinityPhase3 from "@/components/trinity-gateway/TrinityPhase3";
import TrinityActivation from "@/components/trinity-gateway/TrinityActivation";
import { TrademarkedName } from "@/components/ip-protection";

const TrinityGateway = () => {
  // Manage the journey state
  const [journeyStage, setJourneyStage] = useState<'intro' | 'phase1' | 'phase2' | 'phase3' | 'activation'>('intro');
  
  // Store user journey settings
  const [intention, setIntention] = useState<string>("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  // Handlers for progressing through the journey
  const handleStartJourney = () => setJourneyStage('phase1');
  const handlePhase1Complete = () => setJourneyStage('phase2');
  const handlePhase2Complete = () => setJourneyStage('phase3');
  const handlePhase3Complete = () => setJourneyStage('activation');
  const handleRestart = () => setJourneyStage('intro');
  
  // Handlers for storing user selections
  const handleSetIntention = (value: string) => setIntention(value);
  const handleSelectElements = (elements: string[]) => setSelectedElements(elements);

  return (
    <Layout pageTitle="Trinity Gateway™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Trinity Gateway™
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Access the sacred trinity of mind, body, and spirit to unlock your highest potential
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {journeyStage === 'intro' && (
            <TrinityIntro onStart={handleStartJourney} />
          )}
          
          {journeyStage === 'phase1' && (
            <TrinityPhase1 
              onComplete={handlePhase1Complete} 
              skipPhase={handlePhase2Complete} 
            />
          )}
          
          {journeyStage === 'phase2' && (
            <TrinityPhase2 
              onComplete={handlePhase2Complete} 
              onSetIntention={handleSetIntention}
              onSelectElements={handleSelectElements}
              skipPhase={handlePhase3Complete} 
            />
          )}
          
          {journeyStage === 'phase3' && (
            <TrinityPhase3 
              onComplete={handlePhase3Complete} 
            />
          )}
          
          {journeyStage === 'activation' && (
            <TrinityActivation 
              intention={intention}
              selectedElements={selectedElements}
              onRestart={handleRestart} 
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default TrinityGateway;
