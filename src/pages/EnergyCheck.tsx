
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FrequencyShiftPrompt from "@/components/FrequencyShiftPrompt";
import { MoodCheckTab } from "@/components/energy-check";
import { JournalTab } from "@/components/energy-check";

const EnergyCheck = () => {
  return (
    <Layout pageTitle="Energy Check">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Energy Check-In
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Assess your current energy and find tools to recalibrate your frequency.
          </p>

          <Tabs defaultValue="frequency" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="frequency">Frequency Shift</TabsTrigger>
              <TabsTrigger value="mood">Mood Check</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="frequency">
              <FrequencyShiftPrompt />
            </TabsContent>
            
            <TabsContent value="mood">
              <MoodCheckTab />
            </TabsContent>
            
            <TabsContent value="journal">
              <JournalTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EnergyCheck;
