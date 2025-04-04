
import React from "react";
import journeyTemplates from "@/data/journeyTemplates";
import JourneyTemplateCard from "./JourneyTemplateCard";
import TinnitusSupportJourney from "./TinnitusSupportJourney";

const JourneyTemplatesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TinnitusSupportJourney />
      
      {journeyTemplates.filter(template => template.id !== "silent-tune").map((template) => (
        <JourneyTemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};

export default JourneyTemplatesGrid;
