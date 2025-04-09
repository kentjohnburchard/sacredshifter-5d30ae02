import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Info, Timer, Headphones, HeadphoneOff, Volume2 } from 'lucide-react';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJourneySongs } from '@/hooks/useJourneySongs';
import JourneySongList from './JourneySongList';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

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
  
  // Feature states
  const [lowSensitivityMode, setLowSensitivityMode] = useState(false);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [saveToTimeline, setSaveToTimeline] = useState(true);
  
  const handleStartJourney = () => {
    // Store feature settings in sessionStorage
    const settings = {
      lowSensitivityMode,
      useHeadphones,
      sleepTimer,
      saveToTimeline
    };
    sessionStorage.setItem('journeySettings', JSON.stringify(settings));
    
    // Determine journey URL
    const journeyUrl = audioMapping
      ? `/journey/${encodeURIComponent(audioMapping.audioUrl)}`
      : `/journey/${template.frequencies[0]?.value.split(' ')[0] || ''}`;
      
    // Navigate to the journey page
    navigate(journeyUrl);
    toast.success(`Starting ${template.title} journey`);
  };

  const handleAddSong = () => {
    toast.info('Song upload functionality coming soon');
  };

  // Format the timers for display
  const formatTimer = (minutes: number) => {
    if (minutes === 0) return "No timer";
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  // Clean guided prompt text by removing \n characters
  const cleanGuidedPrompt = template.guidedPrompt?.replace(/\\n/g, ' ') || '';

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
          <p className="text-gray-700 whitespace-pre-line">{cleanGuidedPrompt}</p>
        </div>
        
        {/* Journey Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-purple-700">Journey Settings</h3>
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Low Sensitivity Mode</span>
              </div>
              <Switch 
                checked={lowSensitivityMode}
                onCheckedChange={setLowSensitivityMode}
              />
              <span className="text-xs text-gray-500 ml-2 w-20">
                {lowSensitivityMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {useHeadphones ? (
                  <Headphones className="h-4 w-4 text-purple-600" />
                ) : (
                  <HeadphoneOff className="h-4 w-4 text-purple-600" />
                )}
                <span className="text-sm font-medium">Use Headphones</span>
              </div>
              <Switch 
                checked={useHeadphones}
                onCheckedChange={setUseHeadphones}
              />
              <span className="text-xs text-gray-500 ml-2 w-20">
                {useHeadphones ? 'Headphones' : 'Speakers'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Sleep Timer: {formatTimer(sleepTimer)}</span>
              </div>
              <Slider
                min={0}
                max={60}
                step={5}
                value={[sleepTimer]}
                onValueChange={(value) => setSleepTimer(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Off</span>
                <span>30 min</span>
                <span>60 min</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Save to Timeline</span>
              </div>
              <Switch 
                checked={saveToTimeline}
                onCheckedChange={setSaveToTimeline}
              />
              <span className="text-xs text-gray-500 ml-2 w-20">
                {saveToTimeline ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
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
