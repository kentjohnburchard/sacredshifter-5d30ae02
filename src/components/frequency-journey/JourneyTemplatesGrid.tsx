
import React from "react";
import JourneyTemplateCard from "./JourneyTemplateCard";
import { useJourneyTemplates } from "@/hooks/useJourneyTemplates";

export const JourneyTemplatesGrid = () => {
  const { templates, loading, error, audioMappings } = useJourneyTemplates();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <JourneyTemplateCard 
          key={template.id} 
          template={template} 
          audioMapping={audioMappings[template.id]}
        />
      ))}
    </div>
  );
};

export default JourneyTemplatesGrid;
