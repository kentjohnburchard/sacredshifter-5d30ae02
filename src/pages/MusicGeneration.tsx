import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import UserCreditsDisplay from "@/components/UserCreditsDisplay";
import { useMusicGeneration } from "@/hooks/musicGeneration";
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
import { getTemplateByFrequency } from "@/data/journeyTemplates";
import { JourneyTemplateCard } from "@/components/frequency-journey";

const MusicGeneration = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isGenerating, generatedTracks, startGeneration, deleteTrack, userCredits } = useMusicGeneration();
  const [selectedFrequency, setSelectedFrequency] = useState<HealingFrequency>(healingFrequencies[0]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [initialFrequency, setInitialFrequency] = useState<HealingFrequency | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  
  useEffect(() => {
    const frequencyParam = searchParams.get('frequency');
    if (frequencyParam) {
      const frequencyValue = parseFloat(frequencyParam);
      const matchedFrequency = healingFrequencies.find(f => f.frequency === frequencyValue);
      if (matchedFrequency) {
        setSelectedFrequency(matchedFrequency);
        setInitialFrequency(matchedFrequency);
      }
    }
    else if (location.state?.selectedFrequency) {
      const incomingFrequency = location.state.selectedFrequency as HealingFrequency;
      setSelectedFrequency(incomingFrequency);
      setInitialFrequency(incomingFrequency);
      
      if (location.state.generateWithFrequency) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, searchParams]);
  
  const handleSelectFrequency = (frequency: HealingFrequency) => {
    setSelectedFrequency(frequency);
    setShowConfirmation(true);
  };
  
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const journeyTemplate = getTemplateByFrequency(selectedFrequency.frequency);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff]">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="sacred-text-gradient">
              Sacred Sound Creation
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Create beautiful healing music with AI. Infuse your frequencies and intentions into unique sonic experiences.
          </p>
        </div>
        
        <UserCreditsDisplay credits={userCredits} />
        
        <Card className="sacred-glass overflow-hidden mb-10 border-brand-lavender/30">
          <CardContent className="p-6">
            <MusicForm 
              onSubmit={startGeneration} 
              isGenerating={isGenerating} 
              initialFrequency={initialFrequency}
            />
          </CardContent>
        </Card>
        
        <Card className="sacred-glass mb-10 border-brand-lavender/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center sacred-text-gradient">
              Sacred Frequencies
            </h3>
            <p className="mb-6 text-gray-600 max-w-3xl mx-auto text-center">
              Enhance your music with sacred frequencies that resonate with your energy. Select a frequency to learn about its healing properties and meditation practices.
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
                <FrequencyPlayer 
                  audioUrl={selectedFrequency.audio_url || ''} 
                  isPlaying={false} 
                  onPlayToggle={() => {}} 
                />
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/80 rounded-lg shadow-sm border border-brand-lavender/20">
                  <TabsList className="grid grid-cols-3 bg-brand-lavender/10 border-b border-brand-lavender/20 w-full rounded-t-lg">
                    <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:text-brand-chakra text-gray-600">
                      <Music2 className="h-4 w-4 mr-2" />
                      <span>About</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-brand-chakra text-gray-600">
                      <History className="h-4 w-4 mr-2" />
                      <span>History</span>
                    </TabsTrigger>
                    <TabsTrigger value="meditation" className="data-[state=active]:bg-white data-[state=active]:text-brand-chakra text-gray-600">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>Meditation</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-72 p-5">
                    <TabsContent value="info" className="mt-0">
                      <FrequencyInfo frequency={selectedFrequency} />
                    </TabsContent>
                    
                    <TabsContent value="history" className="space-y-4 mt-0">
                      <h3 className="text-xl font-medium text-center sacred-text-gradient">
                        Historical Origins
                      </h3>
                      <p className="text-gray-700">
                        {selectedFrequency.history || "The historical origins of this frequency are part of ancient sound healing traditions passed down through generations of healers and spiritual practitioners."}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="meditation" className="space-y-4 mt-0">
                      <h3 className="text-xl font-medium text-center sacred-text-gradient">
                        Meditation Practices
                      </h3>
                      {selectedFrequency.meditations && selectedFrequency.meditations.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedFrequency.meditations.map((meditation, index) => (
                            <li key={index} className="flex items-start">
                              <Sparkles className="h-5 w-5 mr-2 text-brand-purple shrink-0 mt-0.5" />
                              <span className="text-gray-700">{meditation}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">
                          Sit comfortably with your spine straight. Close your eyes and take deep breaths while focusing on the sound. Allow the frequency to flow through your entire being, releasing any tension or blockages.
                        </p>
                      )}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
                
                {journeyTemplate && (
                  <div className="mt-4 animate-fade-in">
                    <h3 className="text-lg font-medium text-center mb-3 text-brand-deep">Recommended Journey Template</h3>
                    <JourneyTemplateCard 
                      template={journeyTemplate} 
                      showDetails={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="sacred-glass border-brand-lavender/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6 text-center sacred-text-gradient">
              Your Sacred Sound Collection
            </h3>
            <GenerationHistory tracks={generatedTracks} onDelete={deleteTrack} />
          </CardContent>
        </Card>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-brand-amythyst">
        <p>Sacred Shifter • Generate music and heal with sound • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default MusicGeneration;
