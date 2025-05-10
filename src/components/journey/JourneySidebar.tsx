
import React from 'react';
import { Journey } from '@/types/journey';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CirclePause, History, Headphones } from 'lucide-react';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import JourneyAwareSoundscapePlayer from '@/components/journey/JourneyAwareSoundscapePlayer';
import JourneyTimelineView from '@/components/timeline/JourneyTimelineView';

interface JourneySidebarProps {
  journey: Journey | null;
  hasAudioContent: boolean;
  showTimeline: boolean;
  isCurrentJourneyActive: boolean;
  slug?: string;
  handleStartJourney: () => void;
  handleCompleteJourney: () => void;
  toggleTimeline: () => void;
}

const JourneySidebar: React.FC<JourneySidebarProps> = ({
  journey,
  hasAudioContent,
  showTimeline,
  isCurrentJourneyActive,
  slug,
  handleStartJourney,
  handleCompleteJourney,
  toggleTimeline
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl overflow-hidden">
        <div className="h-64 relative">
          <JourneyAwareSpiralVisualizer 
            journeyId={journey?.id}
            autoSync={false}
            showControls={true}
            containerId={`journeySpiral-${slug}`}
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-white">Sacred Frequencies</h3>
          <div className="text-sm text-white/80">
            {journey?.sound_frequencies || 'No frequency information available'}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            {!isCurrentJourneyActive ? (
              <Button 
                onClick={handleStartJourney} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Journey
              </Button>
            ) : (
              <Button 
                onClick={handleCompleteJourney} 
                variant="outline"
                className="border-purple-500/50 text-purple-200"
              >
                <CirclePause className="h-4 w-4 mr-2" />
                Complete Journey
              </Button>
            )}
            
            <Button 
              onClick={toggleTimeline} 
              variant="ghost"
              className="text-purple-200"
              title="Toggle Timeline"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Render audio player if journey has sound frequencies */}
      {hasAudioContent && (
        <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Sacred Audio</h3>
              <Headphones className="h-4 w-4 text-purple-300" />
            </div>
            
            {slug && (
              <JourneyAwareSoundscapePlayer 
                journeyId={slug} 
                autoSync={false}
                autoplay={false} 
              />
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Journey Timeline (conditionally shown) */}
      {showTimeline && (
        <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Journey Timeline</h3>
            <JourneyTimelineView 
              journeyId={journey?.id}
              autoSync={false}
              limit={5}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneySidebar;
