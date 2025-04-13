
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useJourneyTemplates } from "@/hooks/useJourneyTemplates";
import JourneyTemplatesGrid from "@/components/frequency-journey/JourneyTemplatesGrid";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";
import { TooltipProvider } from "@/components/ui/tooltip";

const JourneyTemplates = () => {
  const { user } = useAuth();
  const { liftTheVeil } = useTheme();
  const isAdmin = user && user.email === "admin@example.com"; // You can adjust the admin check based on your auth logic
  const [featuredAudio] = useState({
    audioUrl: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/432hz_meditation.mp3",
    title: "Sacred Frequency Journey",
    artist: "Sacred Shifter",
    frequency: 432,
    chakra: "Heart"
  });
  
  return (
    <Layout 
      pageTitle="Sound Journeys & Sacred Meditation" 
      useBlueWaveBackground={false}
      theme="cosmic"
    >
      <TooltipProvider>
        <div className="max-w-6xl mx-auto py-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Sound Journeys & Sacred Meditation</h1>
              <p className="text-base text-white">
                Explore our curated journeys and meditations designed to address specific healing needs. 
                Each experience combines frequencies, soundscapes, and guidance to support your path to wellness.
              </p>
            </div>
            
            {isAdmin && (
              <Link to="/admin/journey-audio-admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-white/40 hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                  Manage Journey Audio
                </Button>
              </Link>
            )}
          </div>
          
          <div className="fixed bottom-4 right-4 z-50">
            <SacredAudioPlayer
              audioUrl={featuredAudio.audioUrl}
              title={featuredAudio.title}
              artist={featuredAudio.artist}
              frequency={featuredAudio.frequency}
              chakra={featuredAudio.chakra}
            />
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-medium mb-3">About Sound Journeys</h2>
                <p className="text-gray-300">
                  Sound journeys use specific frequencies, binaural beats, and guided meditation to help you reach 
                  altered states of consciousness. Each journey is designed to target specific energy centers and 
                  address particular aspects of well-being.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-3">How to Use</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Choose a journey that resonates with your current needs</li>
                  <li>Find a quiet, comfortable space where you won't be disturbed</li>
                  <li>Use headphones for the optimal binaural experience</li>
                  <li>Allow yourself to fully immerse in the experience</li>
                </ol>
              </div>
            </div>
            
            {liftTheVeil && (
              <div 
                className="mt-4 p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
              >
                With the veil lifted, these journeys will access deeper dimensions of consciousness, 
                allowing for more profound healing and awakening experiences. The frequencies will 
                resonate more powerfully with your expanded awareness.
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Featured Journeys</h2>
          
          {/* Replace the hardcoded journey cards with the JourneyTemplatesGrid component */}
          <JourneyTemplatesGrid />
          
          <div className="flex justify-center mt-8">
            <Link to="/dashboard">
              <Button 
                variant="outline"
                className={`${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default JourneyTemplates;
