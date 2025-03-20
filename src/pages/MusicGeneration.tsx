
import React, { useState } from "react";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import UserCreditsDisplay from "@/components/UserCreditsDisplay";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";
import { Card, CardContent } from "@/components/ui/card";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import FrequencyInfoBox from "@/components/FrequencyInfoBox";

const MusicGeneration = () => {
  const { isGenerating, generatedTracks, startGeneration, deleteTrack, userCredits } = useMusicGeneration();
  const [selectedFrequency, setSelectedFrequency] = useState<HealingFrequency>(healingFrequencies[0]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/03d64fc7-3a06-4a05-bb16-d5f23d3983f5.png')] bg-cover bg-center bg-fixed">
      {/* Darker overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-black/95 backdrop-blur-sm -z-10"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200">
              Music Generation
            </span>
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto text-lg text-shadow-sm">
            Create beautiful healing music with AI. Enter a description and get a unique track in minutes.
          </p>
        </div>
        
        {/* User credits display */}
        <UserCreditsDisplay credits={userCredits} />
        
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden mb-10">
          <CardContent className="p-6 text-white">
            <MusicForm onSubmit={startGeneration} isGenerating={isGenerating} />
          </CardContent>
        </Card>
        
        {/* Sacred Frequency Info Box */}
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden mb-10">
          <CardContent className="p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 text-shadow">
              Sacred Frequencies
            </h3>
            <p className="mb-4 text-slate-200 text-shadow-sm">
              Enhance your music generation by incorporating sacred frequencies. Select a frequency to learn more about its healing properties and meditation practices.
            </p>
            <FrequencyInfoBox 
              frequencies={healingFrequencies} 
              selectedFrequency={selectedFrequency} 
              onSelectFrequency={setSelectedFrequency} 
            />
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden">
          <CardContent className="p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 text-shadow">
              Your Generated Tracks
            </h3>
            <GenerationHistory tracks={generatedTracks} onDelete={deleteTrack} />
          </CardContent>
        </Card>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-slate-300">
        <p>Sacred Shifter - Generate music and heal with sound.</p>
      </footer>
    </div>
  );
};

export default MusicGeneration;
