
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryMusic, Music4 } from "lucide-react";
import Player from "./Player";
import { GeneratedTrack } from "@/hooks/useMusicGeneration";

interface GenerationHistoryProps {
  tracks: GeneratedTrack[];
  onDelete: (id: string) => void;
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ tracks, onDelete }) => {
  const instrumentalTracks = tracks.filter(track => track.lyrics_type === "instrumental");
  const lyricalTracks = tracks.filter(track => track.lyrics_type === "lyrical");

  if (tracks.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border border-border/40 shadow-sm overflow-hidden mt-8 animate-slide-up">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <LibraryMusic className="h-5 w-5 text-accent" />
          Your Music
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-2 pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="instrumental">Instrumental</TabsTrigger>
              <TabsTrigger value="lyrical">With Lyrics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[400px] px-6 py-4">
              <div className="space-y-4">
                {tracks.length > 0 ? (
                  tracks.map(track => (
                    <Player key={track.id} track={track} onDelete={onDelete} />
                  ))
                ) : (
                  <EmptyState message="No tracks generated yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="instrumental" className="m-0">
            <ScrollArea className="h-[400px] px-6 py-4">
              <div className="space-y-4">
                {instrumentalTracks.length > 0 ? (
                  instrumentalTracks.map(track => (
                    <Player key={track.id} track={track} onDelete={onDelete} />
                  ))
                ) : (
                  <EmptyState message="No instrumental tracks generated yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="lyrical" className="m-0">
            <ScrollArea className="h-[400px] px-6 py-4">
              <div className="space-y-4">
                {lyricalTracks.length > 0 ? (
                  lyricalTracks.map(track => (
                    <Player key={track.id} track={track} onDelete={onDelete} />
                  ))
                ) : (
                  <EmptyState message="No lyrical tracks generated yet" />
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
    <div className="rounded-full bg-secondary p-3">
      <Music4 className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default GenerationHistory;
