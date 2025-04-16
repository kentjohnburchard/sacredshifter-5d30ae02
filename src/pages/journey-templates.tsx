
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import FloatingCosmicPlayer from '@/components/audio/FloatingCosmicPlayer';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

// List of available journey templates
const journeyTemplates = [
  {
    id: 'trinity-journey',
    name: 'Trinity Gateway™',
    description: 'A three-phase journey through 396Hz, 639Hz, and 963Hz frequencies',
    frequency: 396,
    chakra: 'root',
    image: '/images/trinity-journey.jpg'
  },
  {
    id: 'dna-healing',
    name: 'DNA Activation',
    description: 'Activate your genetic potential with the 528Hz miracle frequency',
    frequency: 528,
    chakra: 'heart',
    image: '/images/dna-healing.jpg'
  },
  {
    id: 'cosmic-connection',
    name: 'Cosmic Connection',
    description: 'Open your third eye and crown with 852Hz and 963Hz frequencies',
    frequency: 852,
    chakra: 'third-eye',
    image: '/images/cosmic-connection.jpg'
  },
  {
    id: 'theta-meditation',
    name: 'Theta Meditation',
    description: 'Access deep meditative states with guided theta brain entrainment',
    frequency: 432,
    chakra: 'all',
    image: '/images/theta-meditation.jpg'
  },
];

const JourneyTemplatesPage = () => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  const [activeJourney, setActiveJourney] = useState<string | null>(null);

  // Determine which journey to play (if any)
  const selectedJourney = activeJourney 
    ? journeyTemplates.find(journey => journey.id === activeJourney)
    : null;
  
  // Play a journey template
  const playJourney = (journeyId: string) => {
    setActiveJourney(journeyId);
    toast.success(`Playing ${journeyTemplates.find(j => j.id === journeyId)?.name || 'journey'}`);
  };
  
  // Navigate to the journey detail page
  const viewJourneyDetails = (journeyId: string) => {
    navigate(`/journeys/${journeyId}`);
  };

  return (
    <PageLayout title="Journey Templates">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sacred Journey Templates</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Experience curated frequency journeys for transformation and healing
          </p>
        </div>
        
        {/* Journey template cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {journeyTemplates.map((journey) => (
            <Card 
              key={journey.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                activeJourney === journey.id ? (
                  liftTheVeil 
                    ? 'border-2 border-pink-500' 
                    : 'border-2 border-purple-500'
                ) : ''
              }`}
            >
              <div className="h-48 bg-gray-300 relative">
                {journey.image ? (
                  <img 
                    src={journey.image} 
                    alt={journey.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    liftTheVeil ? 'bg-pink-900/30' : 'bg-purple-900/30'
                  }`}>
                    <span className="text-2xl font-bold text-white opacity-50">
                      {journey.name}
                    </span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{journey.name}</h3>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
                  {journey.description}
                </p>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => viewJourneyDetails(journey.id)}
                  >
                    <Info className="h-4 w-4" />
                    Details
                  </Button>
                  
                  <Button
                    variant={activeJourney === journey.id ? "secondary" : "default"}
                    size="sm" 
                    className={`gap-1 ${
                      activeJourney === journey.id 
                        ? 'bg-purple-700 text-white hover:bg-purple-800' 
                        : liftTheVeil 
                          ? 'bg-pink-600 text-white hover:bg-pink-700' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    onClick={() => playJourney(journey.id)}
                  >
                    <Play className="h-4 w-4" />
                    {activeJourney === journey.id ? 'Playing' : 'Play'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Floating Cosmic Player */}
      {selectedJourney && (
        <FloatingCosmicPlayer
          frequency={selectedJourney.frequency}
          title={selectedJourney.name}
          description={selectedJourney.description}
          initiallyVisible={true}
          chakra={selectedJourney.chakra}
          initialShape={selectedJourney.id === 'trinity-journey' ? 'metatrons-cube' : 
                        selectedJourney.id === 'dna-healing' ? 'flower-of-life' :
                        selectedJourney.id === 'cosmic-connection' ? 'sri-yantra' : 'torus'}
          initialColorTheme={
            liftTheVeil ? 'risen-pink' : 
            selectedJourney.id === 'trinity-journey' ? 'cosmic-purple' :
            selectedJourney.id === 'dna-healing' ? 'divine-green' :
            selectedJourney.id === 'cosmic-connection' ? 'ethereal-blue' : 'sacred-gold'
          }
        />
      )}
    </PageLayout>
  );
};

export default JourneyTemplatesPage;
