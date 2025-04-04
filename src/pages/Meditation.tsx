
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
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#7510c9] to-[#4d00ff]">
              Sacred Meditation
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find peace and elevate your consciousness through guided meditations enhanced with sacred frequencies.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
          <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="player" disabled={!selectedMeditation}>
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
