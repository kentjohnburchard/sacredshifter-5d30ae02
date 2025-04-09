
import React, { useState } from "react";
import JourneyTemplateCard from "./JourneyTemplateCard";
import { useJourneyTemplates } from "@/hooks/useJourneyTemplates";
import JourneyDetail from "./JourneyDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const JourneyTemplatesGrid = () => {
  const { templates, loading, error, audioMappings } = useJourneyTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCloseDetail = () => {
    setSelectedTemplate(null);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 bg-gray-100 rounded-lg"></div>
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
      <div className="flex flex-col gap-8">
        {templates.map((template) => (
          <div key={template.id} onClick={() => handleTemplateClick(template.id)} className="cursor-pointer">
            <JourneyTemplateCard 
              template={template} 
              audioMapping={audioMappings[template.id]}
            />
          </div>
        ))}
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
