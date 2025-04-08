
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import MusicForm from "@/components/MusicForm";
import GenerationHistory from "@/components/GenerationHistory";
import UserCreditsDisplay from "@/components/UserCreditsDisplay";
import SubscriptionPromotion from "@/components/SubscriptionPromotion";
import { useAuth } from "@/context/AuthContext";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import useMusicGeneration from "@/hooks/musicGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MusicGeneration = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  const { user } = useAuth();
  const { loading, subscription } = useUserSubscription();
  const { isGenerating, generatedTracks, startGeneration, deleteTrack } = useMusicGeneration();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light mb-4">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Sacred Sound Creation
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate healing music infused with sacred frequencies to elevate your consciousness and align your energy.
            </p>
          </div>

          {/* User subscription information is displayed only for logged-in users */}
          {user && (
            <div className="mb-6">
              <SubscriptionPromotion compact={true} />
            </div>
          )}

          <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="history">Your Creations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <MusicForm 
                onSubmit={startGeneration} 
                isGenerating={isGenerating} 
              />
            </TabsContent>
            
            <TabsContent value="history">
              <GenerationHistory 
                tracks={generatedTracks} 
                onDelete={deleteTrack} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MusicGeneration;
