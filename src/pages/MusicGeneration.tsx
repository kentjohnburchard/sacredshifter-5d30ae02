
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import UserCreditsDisplay from "@/components/UserCreditsDisplay";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";
import { Card, CardContent } from "@/components/ui/card";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import FrequencyInfoBox from "@/components/FrequencyInfoBox";
import FrequencyMusicConfirmation from "@/components/FrequencyMusicConfirmation";
import FrequencySelector from "@/components/FrequencySelector";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import FrequencyInfo from "@/components/FrequencyInfo";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music2, History, Sparkles, BookOpen } from "lucide-react";

const MusicGeneration = () => {
  const location = useLocation();
  const { isGenerating, generatedTracks, startGeneration, deleteTrack, userCredits } = useMusicGeneration();
  const [selectedFrequency, setSelectedFrequency] = useState<HealingFrequency>(healingFrequencies[0]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [initialFrequency, setInitialFrequency] = useState<HealingFrequency | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  
  useEffect(() => {
    if (location.state?.selectedFrequency) {
      const incomingFrequency = location.state.selectedFrequency as HealingFrequency;
      setSelectedFrequency(incomingFrequency);
      setInitialFrequency(incomingFrequency);
      
      if (location.state.generateWithFrequency) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);
  
  const handleSelectFrequency = (frequency: HealingFrequency) => {
    setSelectedFrequency(frequency);
    setShowConfirmation(true);
  };
  
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/03d64fc7-3a06-4a05-bb16-d5f23d3983f5.png')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-black/95 backdrop-blur-sm -z-10"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-purple-300 to-blue-300">
              Music Generation
            </span>
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto text-lg text-shadow-sm">
            Create beautiful healing music with AI. Enter a description and get a unique track in minutes.
          </p>
        </div>
        
        <UserCreditsDisplay credits={userCredits} />
        
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-purple-500/30 overflow-hidden mb-10">
          <CardContent className="p-6 text-white">
            <MusicForm 
              onSubmit={startGeneration} 
              isGenerating={isGenerating} 
              initialFrequency={initialFrequency}
            />
          </CardContent>
        </Card>
        
        {/* Sacred Frequencies Section (moved from Index page) */}
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-purple-500/30 overflow-hidden mb-10 rounded-xl">
          <CardContent className="p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400 text-shadow">
              Sacred Frequencies
            </h3>
            <p className="mb-4 text-slate-200 text-shadow-sm">
              Enhance your music generation by incorporating sacred frequencies. Select a frequency to learn more about its healing properties and meditation practices.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              <div className="lg:col-span-1">
                <FrequencySelector 
                  frequencies={healingFrequencies} 
                  selectedFrequency={selectedFrequency}
                  onSelect={setSelectedFrequency}
                />
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <FrequencyPlayer frequency={selectedFrequency} />
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-black/70 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
                  <TabsList className="grid grid-cols-3 bg-transparent border-b border-white/10 w-full rounded-t-lg">
                    <TabsTrigger value="info" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200">
                      <Music2 className="h-4 w-4 mr-2" />
                      <span>About</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200">
                      <History className="h-4 w-4 mr-2" />
                      <span>History</span>
                    </TabsTrigger>
                    <TabsTrigger value="meditation" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>Meditation</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-72 p-5 text-white">
                    <TabsContent value="info" className="mt-0">
                      <FrequencyInfo frequency={selectedFrequency} />
                    </TabsContent>
                    
                    <TabsContent value="history" className="space-y-4 mt-0">
                      <h3 className="text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 drop-shadow-sm">
                        Historical Origins
                      </h3>
                      <p className="text-slate-100">
                        {selectedFrequency.history || "The historical origins of this frequency are part of ancient sound healing traditions passed down through generations of healers and spiritual practitioners."}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="meditation" className="space-y-4 mt-0">
                      <h3 className="text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 drop-shadow-sm">
                        Meditation Practices
                      </h3>
                      {selectedFrequency.meditations ? (
                        <ul className="space-y-2">
                          {selectedFrequency.meditations.map((meditation, index) => (
                            <li key={index} className="flex items-start">
                              <Sparkles className="h-5 w-5 mr-2 text-purple-300 shrink-0 mt-0.5" />
                              <span className="text-slate-100">{meditation}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-100">
                          Sit comfortably with your spine straight. Close your eyes and take deep breaths while focusing on the sound. Allow the frequency to flow through your entire being, releasing any tension or blockages.
                        </p>
                      )}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-purple-500/30 overflow-hidden rounded-xl">
          <CardContent className="p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400 text-shadow">
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
