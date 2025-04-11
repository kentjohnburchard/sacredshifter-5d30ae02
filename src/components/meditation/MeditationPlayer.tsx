
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MeditationType } from "@/types/meditation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";

interface MeditationPlayerProps {
  meditation: MeditationType;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ meditation }) => {
  const { playAudio } = useGlobalAudioPlayer();
  const [showGuidance, setShowGuidance] = React.useState(true);
  
  useEffect(() => {
    // Play the frequency audio
    playAudio({
      title: meditation.title,
      artist: "Sacred Shifter",
      source: meditation.audioUrl
    });

    // Return cleanup function
    return () => {
      // No cleanup needed - the global player will continue
    };
  }, [meditation.id, playAudio, meditation.audioUrl, meditation.title]);

  const toggleGuidance = () => {
    setShowGuidance(!showGuidance);
    
    if (!showGuidance && meditation.guidanceUrl) {
      // If turning on guidance and it exists
      playAudio({
        title: `${meditation.title} (with guidance)`,
        artist: "Sacred Shifter",
        source: meditation.guidanceUrl
      });
    } else {
      // If turning off guidance, play the regular audio
      playAudio({
        title: meditation.title,
        artist: "Sacred Shifter",
        source: meditation.audioUrl
      });
    }
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-[#9966FF]/10 to-[#bf99ff]/5 dark:from-purple-900/20 dark:to-indigo-900/10 border border-[#9966FF]/20 dark:border-purple-700/40 shadow-lg">
        <CardContent className="pt-6 px-6">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-medium mb-2 text-[#7510c9] dark:text-purple-300">{meditation.title}</h2>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">{meditation.description}</p>
            
            <div className="w-full mt-8 space-y-6">
              <div className="py-4 text-center">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                  Your meditation is now playing in the global audio player.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You can continue browsing while your meditation plays.
                </p>
              </div>
              
              {/* Guidance toggle */}
              {meditation.guidanceUrl && (
                <div className="flex items-center justify-center space-x-3 pt-4">
                  <Label htmlFor="guidance-toggle" className="text-sm text-gray-600 dark:text-gray-300">
                    Guided Meditation
                  </Label>
                  <Switch
                    id="guidance-toggle"
                    checked={showGuidance}
                    onCheckedChange={toggleGuidance}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Meditation information */}
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-2 text-[#7510c9] dark:text-purple-300">About this meditation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{meditation.longDescription}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80 dark:text-purple-300">Duration:</span>
                <span className="text-gray-700 dark:text-gray-300">{meditation.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80 dark:text-purple-300">Frequency:</span>
                <span className="text-gray-700 dark:text-gray-300">{meditation.frequency} Hz</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80 dark:text-purple-300">Focus:</span>
                <span className="text-gray-700 dark:text-gray-300">{meditation.focus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80 dark:text-purple-300">Level:</span>
                <span className="text-gray-700 dark:text-gray-300">{meditation.level}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationPlayer;
