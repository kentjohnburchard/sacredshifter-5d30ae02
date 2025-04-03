
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, Music, Info } from "lucide-react";
import { HermeticJourney } from "@/data/hermeticJourneys";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import HermeticPlaylist from "./HermeticPlaylist";
import HermeticTrackUploadModal from "./HermeticTrackUploadModal";
import HermeticWisdomDrop from "./HermeticWisdomDrop";
import { getTracksForPrinciple } from "@/services/hermeticPlaylistService";
import { HermeticTrack } from "@/types/playlist";
import FrequencyPlayer from "@/components/FrequencyPlayer";

interface HermeticJourneyDetailProps {
  journey: HermeticJourney;
  onBack: () => void;
}

const HermeticJourneyDetail: React.FC<HermeticJourneyDetailProps> = ({ journey, onBack }) => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<HermeticTrack[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<HermeticTrack | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      const principlesTracks = await getTracksForPrinciple(journey.principle);
      setTracks(principlesTracks);
    };
    
    loadTracks();
  }, [journey.principle]);

  const handleStartJourney = () => {
    // Navigate to the frequency journey player with this frequency
    navigate(`/journey/${journey.frequency}`);
    toast.success(`Starting ${journey.title} journey`);
  };

  const handleTrackPlay = (track: HermeticTrack) => {
    setCurrentPlayingTrack(track);
    setIsAudioPlaying(true);
  };

  const handleTrackUploaded = (newTrack: HermeticTrack) => {
    setTracks(prev => [newTrack, ...prev]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className={`h-3 bg-gradient-to-r from-purple-400 to-blue-600`}></div>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">{journey.title}</h2>
          
          {currentPlayingTrack && (
            <div className="ml-auto flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentPlayingTrack.title}</p>
                <p className="text-xs text-gray-500">{currentPlayingTrack.artist}</p>
              </div>
              <FrequencyPlayer
                audioUrl={currentPlayingTrack.audioUrl}
                isPlaying={isAudioPlaying}
                onPlayToggle={() => setIsAudioPlaying(!isAudioPlaying)}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-purple-700">Details</h3>
              <HermeticWisdomDrop 
                principle={journey.principle} 
                variant="hover-card"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full"
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Vale's Wisdom</span>
                </Button>
              </HermeticWisdomDrop>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Principle:</span> {journey.principle}</p>
              <p><span className="font-medium">Frequency:</span> {journey.frequency}Hz</p>
              <p><span className="font-medium">Chakra:</span> {journey.chakra}</p>
              <p><span className="font-medium">Visual Theme:</span> {journey.visualTheme}</p>
              <p><span className="font-medium">Audio:</span> {journey.audioDescription}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-purple-700">Affirmation</h3>
            <div className="bg-purple-50 p-4 rounded-md mb-4">
              <p className="text-gray-800 italic">"{journey.affirmation}"</p>
            </div>
            
            <h3 className="text-lg font-medium mb-2 text-purple-700">Session Flow</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {journey.sessionFlow.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-2 text-purple-700">Guided Prompt</h3>
          <p className="text-gray-700 whitespace-pre-line">{journey.guidedPrompt}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-purple-700">
              <Music className="h-5 w-5 inline mr-2" />
              Journey Playlist
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm"
              onClick={() => setUploadModalOpen(true)}
            >
              Add Track
            </Button>
          </div>
          
          <HermeticPlaylist
            principle={journey.principle}
            frequency={journey.frequency}
            chakra={journey.chakra}
            tracks={tracks}
            onTrackPlay={handleTrackPlay}
            onUploadClick={() => setUploadModalOpen(true)}
          />
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleStartJourney}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3"
          >
            <Play className="h-5 w-5 mr-2" /> Begin Journey
          </Button>
        </div>
      </CardContent>
      
      <HermeticTrackUploadModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        defaultPrinciple={journey.principle}
        onTrackUploaded={handleTrackUploaded}
      />
    </Card>
  );
};

export default HermeticJourneyDetail;
