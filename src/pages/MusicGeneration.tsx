
import React from "react";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";

const MusicGeneration = () => {
  const { isGenerating, generatedTracks, startGeneration, deleteTrack } = useMusicGeneration();
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
              Music Generation
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create beautiful music with AI. Enter a description and get a unique track in minutes.
          </p>
        </div>
        
        <MusicForm onSubmit={startGeneration} isGenerating={isGenerating} />
        <GenerationHistory tracks={generatedTracks} onDelete={deleteTrack} />
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        <p>Sacred Shifter - Generate music and heal with sound.</p>
      </footer>
    </div>
  );
};

export default MusicGeneration;
