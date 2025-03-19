
import React from "react";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";
import { MusicGenerationRequest } from "@/services/api";

const Index = () => {
  const { 
    isGenerating, 
    generatedTracks, 
    startGeneration, 
    deleteTrack 
  } = useMusicGeneration();

  const handleSubmit = (params: MusicGenerationRequest) => {
    startGeneration(params);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            Create <span className="font-medium">Beautiful</span> Music
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Describe the music you want to create and let AI compose it for you. From calm piano melodies to energetic beats.
          </p>
        </div>
        
        <MusicForm onSubmit={handleSubmit} isGenerating={isGenerating} />
        
        <GenerationHistory 
          tracks={generatedTracks} 
          onDelete={deleteTrack} 
        />
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        <p>AI-powered music generation. Simple and beautiful.</p>
      </footer>
    </div>
  );
};

export default Index;
