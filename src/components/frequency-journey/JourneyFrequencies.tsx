
import React from 'react';
import { JourneyTemplate } from '@/data/journeyTemplates';

interface JourneyFrequenciesProps {
  template: JourneyTemplate;
}

const JourneyFrequencies: React.FC<JourneyFrequenciesProps> = ({ template }) => {
  return (
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Frequencies</h4>
      <ul className="space-y-1">
        {template.frequencies.map((freq, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-purple-600 font-medium">{freq.name}:</span> 
            <span>{freq.value}</span>
          </li>
        ))}
      </ul>
      
      {template.chakras && template.chakras.length > 0 && (
        <p className="mt-2"><span className="font-medium">Chakras:</span> {template.chakras.join(', ')}</p>
      )}
      
      {template.visualTheme && (
        <p className="mt-2"><span className="font-medium">Visual Theme:</span> {template.visualTheme}</p>
      )}
      
      {template.soundSources && template.soundSources.length > 0 && (
        <div className="mt-2">
          <span className="font-medium">Sound Sources:</span>
          <ul className="list-disc pl-5">
            {template.soundSources.map((source, idx) => (
              <li key={idx}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JourneyFrequencies;
