
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FrequencyShiftTab from "./FrequencyShiftTab";
import MoodCheckTab from "./MoodCheckTab";
import JournalTab from "./JournalTab";

interface EnergyCheckTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const EnergyCheckTabs: React.FC<EnergyCheckTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList className="mx-auto w-full max-w-md grid grid-cols-3 mb-8">
        <TabsTrigger value="frequency" className="rounded-lg">Frequency Shift</TabsTrigger>
        <TabsTrigger value="mood" className="rounded-lg">Mood Check</TabsTrigger>
        <TabsTrigger value="journal" className="rounded-lg">Journal</TabsTrigger>
      </TabsList>
      
      <TabsContent value="frequency" className="space-y-8">
        <FrequencyShiftTab />
      </TabsContent>
      
      <TabsContent value="mood" className="space-y-8">
        <MoodCheckTab />
      </TabsContent>
      
      <TabsContent value="journal" className="space-y-8">
        <JournalTab />
      </TabsContent>
    </Tabs>
  );
};

export default EnergyCheckTabs;
