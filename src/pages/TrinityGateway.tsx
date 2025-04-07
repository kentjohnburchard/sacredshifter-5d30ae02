
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import TrinityIntro from "@/components/trinity-gateway/TrinityIntro";
import TrinityJourney from "@/components/trinity-gateway/TrinityJourney";
import TrinityPhase1 from "@/components/trinity-gateway/TrinityPhase1";
import TrinityPhase2 from "@/components/trinity-gateway/TrinityPhase2";
import TrinityPhase3 from "@/components/trinity-gateway/TrinityPhase3";
import TrinityActivation from "@/components/trinity-gateway/TrinityActivation";

export type JourneyStage = "intro" | "phase1" | "phase2" | "phase3" | "activation";

const TrinityGateway = () => {
  const [currentStage, setCurrentStage] = useState<JourneyStage>("intro");
  const [userIntention, setUserIntention] = useState<string>("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  
  // Navigation functions
  const startJourney = () => {
    setCurrentStage("phase1");
  };
  
  const moveToPhase2 = () => {
    setCurrentStage("phase2");
  };
  
  const moveToPhase3 = () => {
    setCurrentStage("phase3");
  };
  
  const completeJourney = () => {
    setCurrentStage("activation");
  };
  
  const restartJourney = () => {
    setCurrentStage("intro");
    setUserIntention("");
    setSelectedElements([]);
  };
  
  // Handle intention setting (for Phase 2)
  const handleSetIntention = (intention: string) => {
    setUserIntention(intention);
  };
  
  // Handle element selection (for Phase 2)
  const handleSelectElements = (elements: string[]) => {
    setSelectedElements(elements);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
            Trinity Gateway™
          </h1>
          
          <div className="text-center mb-8">
            <p className="text-lg text-gray-300">
              Unlock the code behind creation. Three frequencies. One path. Infinite transformation.
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {currentStage === "intro" && (
              <TrinityIntro onStart={startJourney} />
            )}
            
            {currentStage === "phase1" && (
              <TrinityPhase1 onComplete={moveToPhase2} />
            )}
            
            {currentStage === "phase2" && (
              <TrinityPhase2 
                onSetIntention={handleSetIntention}
                onSelectElements={handleSelectElements}
                onComplete={moveToPhase3}
                skipPhase={moveToPhase3}
              />
            )}
            
            {currentStage === "phase3" && (
              <TrinityPhase3 onComplete={completeJourney} />
            )}
            
            {currentStage === "activation" && (
              <TrinityActivation 
                intention={userIntention}
                selectedElements={selectedElements}
                onRestart={restartJourney}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default TrinityGateway;
