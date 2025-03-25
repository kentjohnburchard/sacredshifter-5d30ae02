
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import MoodCheckSection from "@/components/MoodCheckSection";
import JournalSection from "@/components/JournalSection";
import FrequencyShiftPrompt from "@/components/FrequencyShiftPrompt";

const EnergyCheck = () => {
  const [activeTab, setActiveTab] = useState("frequency");
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center my-12">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Energy Check-In
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover where your energy needs rebalancing and receive personalized frequency recommendations.
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="mx-auto w-full max-w-md grid grid-cols-3 mb-8">
            <TabsTrigger value="frequency" className="rounded-lg">Frequency Shift</TabsTrigger>
            <TabsTrigger value="mood" className="rounded-lg">Mood Check</TabsTrigger>
            <TabsTrigger value="journal" className="rounded-lg">Journal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frequency" className="space-y-8">
            <FrequencyShiftPrompt />
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-8">
            <MoodCheckSection />
          </TabsContent>
          
          <TabsContent value="journal" className="space-y-8">
            <JournalSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EnergyCheck;
