
import React, { useState } from "react";
import { journeyTemplates, JourneyTemplate } from "@/data/journeyTemplates";
import JourneyTemplateCard from "./JourneyTemplateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JourneyTemplatesGridProps {
  onSelectTemplate?: (template: JourneyTemplate) => void;
  showDetails?: boolean;
}

const JourneyTemplatesGrid: React.FC<JourneyTemplatesGridProps> = ({ 
  onSelectTemplate,
  showDetails = true
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredTemplates = journeyTemplates.filter(template => {
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.chakra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.frequency.toString().includes(searchQuery);
      
    const matchesTab = activeTab === "all" || 
      (activeTab === "lower" && template.frequency < 600) ||
      (activeTab === "higher" && template.frequency >= 600);
      
    return matchesSearch && matchesTab;
  });
  
  const handleBeginJourney = (template: JourneyTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All Frequencies</TabsTrigger>
            <TabsTrigger value="lower">Lower (≤528Hz)</TabsTrigger>
            <TabsTrigger value="higher">Higher (≥639Hz)</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search journeys..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <JourneyTemplateCard
            key={template.id}
            template={template}
            showDetails={showDetails}
            onBeginJourney={() => handleBeginJourney(template)}
          />
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No journey templates match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyTemplatesGrid;
