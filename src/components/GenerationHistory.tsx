
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Music4 } from "lucide-react";
import Player from "./Player";
import { GeneratedTrack } from "@/hooks/musicGeneration/types";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";

interface GenerationHistoryProps {
  tracks?: GeneratedTrack[];
  onDelete?: (id: string) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ 
  tracks = [], // Provide default empty array
  onDelete = () => {} // Provide default no-op function
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <EmptyState message="No tracks generated yet. Create your first sacred sound above." />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <div className="space-y-6">
        {tracks.map(track => (
          <Player key={track.id} track={track} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
    <div className="rounded-full bg-brand-lavender/10 p-5">
      <Music4 className="h-12 w-12 text-brand-purple/60" />
    </div>
    <div>
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Your Sacred Shifter creations will appear here</p>
    </div>
  </div>
);

export default GenerationHistory;
