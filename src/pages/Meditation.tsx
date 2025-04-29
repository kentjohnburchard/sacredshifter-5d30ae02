
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MeditationPlayer from "@/components/meditation/MeditationPlayer";
import MeditationTypeCard from "@/components/meditation/MeditationTypeCard";
import { meditationTypes } from "@/data/meditationTypes";
import { MeditationType } from "@/types/meditation";

const Meditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationType | null>(null);
  const [activeTab, setActiveTab] = useState("explore");

  const handleSelectMeditation = (meditation: MeditationType) => {
    setSelectedMeditation(meditation);
    setActiveTab("player");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
              style={{textShadow: '0 2px 10px rgba(147, 51, 234, 0.7)'}}>
            Sacred Meditation
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto"
             style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
            Find peace and elevate your consciousness through guided meditations enhanced with sacred frequencies.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
          <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8 bg-black/80 border border-white/30 shadow-lg">
            <TabsTrigger 
              value="explore" 
              className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=active]:shadow-md"
              style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)'}}
            >
              Explore
            </TabsTrigger>
            <TabsTrigger 
              value="player" 
              disabled={!selectedMeditation} 
              className="text-white data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=active]:shadow-md"
              style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)'}}
            >
              Meditation Player
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditationTypes.map((meditation) => (
                <MeditationTypeCard
                  key={meditation.id}
                  meditation={meditation}
                  onSelect={() => handleSelectMeditation(meditation)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="player">
            {selectedMeditation && (
              <MeditationPlayer meditation={selectedMeditation} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Meditation;
