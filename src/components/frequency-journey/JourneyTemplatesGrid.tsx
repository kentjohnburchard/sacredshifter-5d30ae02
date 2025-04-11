
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
import { meditationTypes } from "@/data/meditationTypes";
import MeditationTypeCard from "@/components/meditation/MeditationTypeCard";
import { MeditationType } from "@/types/meditation";

export const JourneyTemplatesGrid = () => {
  const { templates, loading, error, audioMappings } = useJourneyTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationType | null>(null);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCloseDetail = () => {
    setSelectedTemplate(null);
  };

  const handleSelectMeditation = (meditation: MeditationType) => {
    setSelectedMeditation(meditation);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  
  const filteredTemplates = templates.filter(template => {
    if (activeTab === "all") {
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
          <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
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
          
          {uniqueChakras.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Chakra Filter:</p>
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
          
          {uniqueVibes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Vibe Filter:</p>
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
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Headphones className="w-3 h-3 mr-1" /> Featured Mode
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Clock className="w-3 h-3 mr-1" /> Sleep Timer
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Waves className="w-3 h-3 mr-1" /> Pink Noise
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Music className="w-3 h-3 mr-1" /> Multiple Tracks
            </Badge>
          </div>
          
          <TabsContent value="all" className="pt-4">
            <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">All Journeys</h2>
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
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No sound healing journeys available.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="meditation" className="pt-4">
            {/* Meditation content from the Meditation page */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Sacred Meditation Experiences</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Find peace and elevate your consciousness through guided meditations enhanced with sacred frequencies.
              </p>
            </div>
            
            {selectedMeditation ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300">{selectedMeditation.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedMeditation(null)}
                  >
                    Back to Library
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-4 rounded-md mb-4">
                  <h4 className="text-purple-900 dark:text-purple-100 font-medium mb-2">About this Meditation</h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMeditation.longDescription}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border border-purple-100 dark:border-purple-900 rounded-md p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedMeditation.frequency} Hz</p>
                  </div>
                  <div className="border border-purple-100 dark:border-purple-900 rounded-md p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedMeditation.duration} minutes</p>
                  </div>
                  <div className="border border-purple-100 dark:border-purple-900 rounded-md p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chakra</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedMeditation.chakra}</p>
                  </div>
                  <div className="border border-purple-100 dark:border-purple-900 rounded-md p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedMeditation.level}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-4 rounded-md">
                  <h4 className="text-purple-900 dark:text-purple-100 font-medium mb-2">Begin Your Practice</h4>
                  {selectedMeditation.audioUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">Meditation Audio:</p>
                      <audio controls className="w-full" src={selectedMeditation.audioUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {selectedMeditation.guidanceUrl && (
                    <div>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">Guided Instructions:</p>
                      <audio controls className="w-full" src={selectedMeditation.guidanceUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meditationTypes.map((meditation) => (
                  <MeditationTypeCard
                    key={meditation.id}
                    meditation={meditation}
                    onSelect={() => handleSelectMeditation(meditation)}
                  />
                ))}
              </div>
            )}
            
            <div className="flex flex-col gap-6 mt-8">
              <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Meditation Journeys</h2>
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
                  <JourneyTemplateCard 
                    template={template} 
                    audioMapping={audioMappings[template.id]}
                  />
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
