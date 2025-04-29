
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TrinityIntro from '@/components/trinity-gateway/TrinityIntro';
import TrinityJourney from '@/components/trinity-gateway/TrinityJourney';
import TrinityPhase1 from '@/components/trinity-gateway/TrinityPhase1';
import TrinityPhase2 from '@/components/trinity-gateway/TrinityPhase2';
import TrinityPhase3 from '@/components/trinity-gateway/TrinityPhase3';
import TrinityActivation from '@/components/trinity-gateway/TrinityActivation';
import { Card } from '@/components/ui/card';

const TrinityGateway: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'intro' | 'phase1' | 'phase2' | 'phase3' | 'activation'>('intro');
  const [intention, setIntention] = useState("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  
  const handleStartJourney = () => {
    setCurrentStage('phase1');
  };
  
  const handleCompletePhase1 = () => {
    setCurrentStage('phase2');
  };
  
  const handleCompletePhase2 = () => {
    setCurrentStage('phase3');
  };
  
  const handleCompletePhase3 = () => {
    setCurrentStage('activation');
  };
  
  const handleRestart = () => {
    setCurrentStage('intro');
    setIntention("");
    setSelectedElements([]);
  };
  
  // Handler for setting intention in Phase 2
  const handleSetIntention = (newIntention: string) => {
    setIntention(newIntention);
  };
  
  // Handler for selecting elements in Phase 2
  const handleSelectElements = (elements: string[]) => {
    setSelectedElements(elements);
  };
  
  return (
    <Layout pageTitle="Trinity Gateway™">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">Trinity Gateway™</h1>
        <p className="text-lg text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Access the power of the trinity principles for spiritual transformation.
        </p>
        
        <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md p-6 max-w-4xl mx-auto">
          <TrinityJourney>
            {currentStage === 'intro' && (
              <TrinityIntro onStart={handleStartJourney} />
            )}
            {currentStage === 'phase1' && (
              <TrinityPhase1 onComplete={handleCompletePhase1} skipPhase={() => setCurrentStage('phase2')} />
            )}
            {currentStage === 'phase2' && (
              <TrinityPhase2 
                onComplete={handleCompletePhase2} 
                skipPhase={() => setCurrentStage('phase3')}
                onSetIntention={handleSetIntention}
                onSelectElements={handleSelectElements}
              />
            )}
            {currentStage === 'phase3' && (
              <TrinityPhase3 onComplete={handleCompletePhase3} />
            )}
            {currentStage === 'activation' && (
              <TrinityActivation 
                intention={intention}
                selectedElements={selectedElements}
                onRestart={handleRestart}
              />
            )}
          </TrinityJourney>
        </Card>
      </div>
    </Layout>
  );
};

export default TrinityGateway;
