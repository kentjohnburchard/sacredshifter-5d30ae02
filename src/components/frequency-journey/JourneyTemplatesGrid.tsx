
import React, { useState } from "react";
import JourneyTemplateCard from "./JourneyTemplateCard";
import { useJourneyTemplates } from "@/hooks/useJourneyTemplates";
import JourneyDetail from "./JourneyDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Filter, 
  SlidersHorizontal,
  Waves, 
  Music, 
  Headphones, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JourneyTemplate } from "@/data/journeyTemplates";
import TinnitusSupportJourney from "./TinnitusSupportJourney";

export const JourneyTemplatesGrid = () => {
  const { templates, loading, error, audioMappings } = useJourneyTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCloseDetail = () => {
    setSelectedTemplate(null);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  
  // Filter templates based on active filters
  const filteredTemplates = templates.filter(template => {
    if (activeTab === "all") {
      // Apply chakra and vibe filters if they are selected
      if (selectedChakra && (!template.chakras || !template.chakras.includes(selectedChakra))) {
        return false;
      }
      if (selectedVibe && template.vibe !== selectedVibe) {
        return false;
      }
      return true;
    } else if (activeTab === "sound-healing") {
      return template.tags && template.tags.some(tag => 
        ["Sound Healing", "Relaxation", "Sleep Support"].includes(tag)
      );
    } else if (activeTab === "meditation") {
      return template.tags && template.tags.some(tag => 
        ["Focus", "Meditation", "Calm", "Mindfulness"].includes(tag)
      );
    } else if (activeTab === "chakra") {
      return template.chakras && template.chakras.length > 0;
    }
    return true;
  });
  
  // Get unique chakras and vibes for filters
  const uniqueChakras = Array.from(
    new Set(templates.flatMap(t => t.chakras || []))
  );
  
  const uniqueVibes = Array.from(
    new Set(templates.map(t => t.vibe).filter(Boolean) as string[])
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load journey templates: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Journeys</TabsTrigger>
              <TabsTrigger value="sound-healing">Sound Healing</TabsTrigger>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
              <TabsTrigger value="chakra">Chakra Work</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {
                  setSelectedChakra(null);
                  setSelectedVibe(null);
                }}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Reset Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Chakra Filter */}
          {uniqueChakras.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Chakra Filter:</p>
              <div className="flex flex-wrap gap-2">
                {uniqueChakras.map(chakra => (
                  <Badge 
                    key={chakra}
                    variant={selectedChakra === chakra ? "default" : "outline"} 
                    className="cursor-pointer transition-all hover:shadow-sm"
                    onClick={() => setSelectedChakra(selectedChakra === chakra ? null : chakra)}
                  >
                    {chakra}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Vibe Filter */}
          {uniqueVibes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Vibe Filter:</p>
              <div className="flex flex-wrap gap-2">
                {uniqueVibes.map(vibe => (
                  <Badge 
                    key={vibe}
                    variant={selectedVibe === vibe ? "default" : "outline"} 
                    className="cursor-pointer transition-all hover:shadow-sm"
                    onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
              <Headphones className="w-3 h-3 mr-1" /> Featured Mode
            </Badge>
            <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
              <Clock className="w-3 h-3 mr-1" /> Sleep Timer
            </Badge>
            <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
              <WaveformIcon className="w-3 h-3 mr-1" /> Pink Noise
            </Badge>
            <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
              <Music className="w-3 h-3 mr-1" /> Multiple Tracks
            </Badge>
          </div>
          
          {/* Featured Content */}
          <TabsContent value="all" className="pt-4">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-purple-800 mb-3">Featured Journey</h2>
              <TinnitusSupportJourney />
            </div>
            
            <h2 className="text-lg font-semibold text-purple-800 mb-3">All Journeys</h2>
            <div className="flex flex-col gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
                  <JourneyTemplateCard 
                    template={template} 
                    audioMapping={audioMappings[template.id]}
                  />
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No journeys match your current filters. Try adjusting your selections.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sound-healing" className="pt-4">
            <div className="flex flex-col gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
                  <JourneyTemplateCard 
                    template={template} 
                    audioMapping={audioMappings[template.id]}
                  />
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No sound healing journeys available.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="meditation" className="pt-4">
            <div className="flex flex-col gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
                  <JourneyTemplateCard 
                    template={template} 
                    audioMapping={audioMappings[template.id]}
                  />
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No meditation journeys available.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chakra" className="pt-4">
            <div className="flex flex-col gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
                  <JourneyTemplateCard 
                    template={template} 
                    audioMapping={audioMappings[template.id]}
                  />
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No chakra journeys available.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none max-h-[90vh] overflow-y-auto">
          {selectedTemplateData && (
            <JourneyDetail 
              template={selectedTemplateData} 
              audioMapping={audioMappings[selectedTemplateData.id]}
              onBack={handleCloseDetail}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JourneyTemplatesGrid;
