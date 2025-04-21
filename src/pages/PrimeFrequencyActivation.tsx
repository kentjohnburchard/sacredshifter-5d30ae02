
import React, { useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import PalmReader from '@/components/prime-activation/PalmReader';
import PrimeAnalysis from '@/components/prime-activation/PrimeAnalysis';
import FrequencyPlayer from '@/components/prime-activation/FrequencyPlayer';
import MeditationModule from '@/components/prime-activation/MeditationModule';
import BirthdateAnalysis from '@/components/prime-activation/BirthdateAnalysis';
import SigilCanvas from '@/components/prime-activation/SigilCanvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PrimeFrequencyActivation: React.FC = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [palmReadingComplete, setPalmReadingComplete] = useState<boolean>(false);
  const [primeProfile, setPrimeProfile] = useState<any>(null);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const audioPlayer = useAudioPlayer();

  // Handle section navigation
  const nextSection = () => {
    if (currentSection < 6) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Handle palm reading completion
  const handlePalmReadingComplete = (profile: any) => {
    setPalmReadingComplete(true);
    setPrimeProfile(profile);
    toast({
      title: "Palm Reading Complete",
      description: "Your vibrational profile has been analyzed. Proceed to see your results.",
      duration: 5000,
    });
    nextSection();
  };

  // Handle frequency activation
  const handlePlayFrequency = (frequency: number) => {
    setActiveFrequency(frequency);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-4 md:p-8">
      {/* Header with cosmic styling */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair mb-2 text-gradient-primary">
          Sacred Shifter: Prime Frequency Activation
        </h1>
        <p className="text-purple-200 opacity-80">
          Discover your vibrational alignment through palmistry, numerology, and sacred frequency
        </p>
      </header>

      {/* Navigation indicators */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSection === step 
                  ? 'bg-amber-400 scale-125 pulse-animation' 
                  : (currentSection > step ? 'bg-green-400' : 'bg-gray-600')
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto glass-morphism rounded-xl p-6 mb-8">
        {currentSection === 1 && (
          <PalmReader onComplete={handlePalmReadingComplete} />
        )}
        
        {currentSection === 2 && primeProfile && (
          <PrimeAnalysis profile={primeProfile} />
        )}
        
        {currentSection === 3 && (
          <FrequencyPlayer 
            onPlay={handlePlayFrequency} 
            activeFrequency={activeFrequency}
          />
        )}
        
        {currentSection === 4 && (
          <MeditationModule />
        )}
        
        {currentSection === 5 && (
          <BirthdateAnalysis />
        )}
        
        {currentSection === 6 && (
          <SigilCanvas activeFrequency={activeFrequency} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button
          onClick={prevSection}
          variant="ghost"
          className="text-purple-200 hover:text-white hover:bg-purple-800/50"
          disabled={currentSection === 1}
        >
          Previous Step
        </Button>
        
        <Button
          onClick={nextSection}
          variant="ghost"
          className="text-amber-200 hover:text-white hover:bg-amber-800/50"
          disabled={currentSection === 6 || (currentSection === 1 && !palmReadingComplete)}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default PrimeFrequencyActivation;
