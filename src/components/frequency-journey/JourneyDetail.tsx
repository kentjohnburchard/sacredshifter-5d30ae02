
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import JourneySongList from './JourneySongList';

interface JourneyDetailProps {
  template: JourneyTemplate;
  audioMapping?: {
    audioUrl: string;
    audioFileName: string;
  };
  onBack: () => void;
}

const JourneyDetail: React.FC<JourneyDetailProps> = ({ 
  template, 
  audioMapping,
  onBack 
}) => {
  const navigate = useNavigate();
  const { songs, loading } = useJourneySongs(template.id);
  
  const handleStartJourney = () => {
    const journeyUrl = audioMapping
      ? `/journey/${encodeURIComponent(audioMapping.audioUrl)}`
      : `/journey/${template.frequencies[0]?.value.split(' ')[0] || ''}`;
      
    navigate(journeyUrl);
    toast.success(`Starting ${template.title} journey`);
  };

  const handleAddSong = () => {
    toast.info('Song upload functionality coming soon');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="h-3" style={{ backgroundColor: template.color || '#6b46c1' }}></div>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">{template.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-purple-700">Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Purpose:</span> {template.purpose}</p>
              
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
              </div>
              
              {template.chakras && template.chakras.length > 0 && (
                <p><span className="font-medium">Chakras:</span> {template.chakras.join(', ')}</p>
              )}
              
              {template.visualTheme && (
                <p><span className="font-medium">Visual Theme:</span> {template.visualTheme}</p>
              )}
              
              {template.soundSources && template.soundSources.length > 0 && (
                <div>
                  <span className="font-medium">Sound Sources:</span>
                  <ul className="list-disc pl-5">
                    {template.soundSources.map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-purple-700">Affirmation</h3>
            <div className="bg-purple-50 p-4 rounded-md mb-4">
              <p className="text-gray-800 italic">"{template.affirmation}"</p>
            </div>
            
            {template.features && template.features.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2 text-purple-700">Features</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-2 text-purple-700">Guided Prompt</h3>
          <p className="text-gray-700 whitespace-pre-line">{template.guidedPrompt}</p>
        </div>
        
        <div className="mb-6">
          <JourneySongList
            journeyId={template.id}
            journeyTitle={template.title}
            songs={songs}
            loading={loading}
            onAddSongClick={handleAddSong}
          />
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleStartJourney}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3"
          >
            <Play className="h-5 w-5 mr-2" /> Begin Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyDetail;
