
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import FrequencySelector from "@/components/FrequencySelector";
import FrequencyInfo from "@/components/FrequencyInfo";
import { healingFrequencies } from "@/data/frequencies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Music2, History, Sparkles, BookOpen } from "lucide-react";

const Index = () => {
  const [selectedFrequency, setSelectedFrequency] = useState(healingFrequencies[0]);
  const [activeTab, setActiveTab] = useState("info");
  
  // Add smooth scrolling to the top when frequency changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedFrequency.id]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/03d64fc7-3a06-4a05-bb16-d5f23d3983f5.png')] bg-cover bg-center bg-fixed">
      {/* Darker overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-black/95 backdrop-blur-sm -z-10"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
              Sacred Sound Healing
            </span>
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto font-light text-lg">
            Experience the ancient healing power of sacred frequencies. These sound vibrations have been used for millennia to restore harmony and balance to mind, body, and spirit.
          </p>
        </div>
        
        {/* Introduction Card */}
        <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden mb-10">
          <CardContent className="p-6 text-white">
            <h3 className="text-2xl font-light mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 drop-shadow-sm">
              The Sacred Science of Sound
            </h3>
            <p className="mb-4 text-slate-100">
              Sound healing is one of the oldest and most natural forms of healing known to man. Since ancient times, sound therapy has been used to treat a variety of physical and mental conditions. The Egyptians used vowel sound chants in healing because they believed vowels were sacred. Tibetan monks use singing bowls, which the body's chakra system responds to.
            </p>
            <p className="text-slate-100">
              Each frequency below corresponds to a specific vibration that resonates with different parts of your being. They activate the body's natural healing mechanisms and help restore perfect harmony to body, mind, and spirit.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        
        {/* Additional information section */}
        <Card className="mt-12 border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h3 className="text-2xl font-light text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200 drop-shadow-sm">
                Understanding Sound Healing
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-300" />
                    <span>The Solfeggio Frequencies</span>
                  </h4>
                  <p className="text-slate-100">
                    The Solfeggio frequencies are a set of six tones that were used in ancient sacred music, including the beautiful Gregorian chants. Each Solfeggio tone helps to balance energy and heal the mind, body, and spirit in various ways.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-300" />
                    <span>Sound and the Chakras</span>
                  </h4>
                  <p className="text-slate-100">
                    Each of the seven chakras in the human body vibrates at its own frequency. When these energy centers become blocked or imbalanced, specific sound frequencies can help to restore harmony. The frequencies provided here are aligned with specific chakras to target healing where you need it most.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-300" />
                    <span>How to Use These Frequencies</span>
                  </h4>
                  <p className="text-slate-100">
                    For best results, listen to these healing frequencies with headphones in a quiet, comfortable space. A daily practice of 15-30 minutes can yield the most benefits. You may listen actively during meditation or passively while doing gentle activities or before sleep.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-medium flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-300" />
                    <span>The Science Behind Sound Healing</span>
                  </h4>
                  <p className="text-slate-100">
                    Modern research is beginning to validate what ancient cultures knew about sound healing. Studies show that specific frequencies can affect brainwave states, reduce stress hormones, and even promote cellular healing. Everything in the universe is in a state of vibration, including our bodies, and sound healing works on the principle of resonance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-slate-300">
        <p>Sacred Shifter - Heal with the power of sound. Journey to harmony through sacred frequencies.</p>
      </footer>
    </div>
  );
};

export default Index;
