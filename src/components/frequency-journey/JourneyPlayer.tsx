
import React, { useState, useEffect } from 'react';
import { FrequencyLibraryItem } from '@/types/frequencies';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Heart, 
  Send, 
  ChevronDown, 
  Music, 
  FileText, 
  BookOpen,
  Menu
} from 'lucide-react';
import RandomizingAudioPlayer from '@/components/audio/RandomizingAudioPlayer';
import { toast } from 'sonner';

interface JourneyPlayerProps {
  frequency: FrequencyLibraryItem;
  onSessionStart?: (intention: string) => void;
  onReflectionSubmit?: (reflection: string) => void;
  currentIntention?: string;
  sessionId?: string | null;
  audioGroupId?: string | null;
  audioUrl?: string;
}

export const JourneyPlayer: React.FC<JourneyPlayerProps> = ({
  frequency,
  onSessionStart,
  onReflectionSubmit,
  currentIntention = '',
  sessionId = null,
  audioGroupId = null,
  audioUrl = null
}) => {
  const [intention, setIntention] = useState<string>(currentIntention);
  const [reflection, setReflection] = useState<string>('');
  const [sessionStarted, setSessionStarted] = useState<boolean>(!!sessionId);
  const [isVisualEffectActive, setIsVisualEffectActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("journey");
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // For demo purposes, automatically start after 1 second
  useEffect(() => {
    if (sessionStarted || !intention) return;
    
    const timer = setTimeout(() => {
      handleStartJourney();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [sessionStarted, intention]);
  
  const handleStartJourney = () => {
    if (!intention.trim()) {
      toast.error("Please set an intention before starting");
      return;
    }
    
    if (onSessionStart) {
      onSessionStart(intention);
    }
    
    setSessionStarted(true);
    setIsVisualEffectActive(true);
    setIsAudioPlaying(true);
    
    toast.success("Journey started");
  };
  
  const handleReflectionSubmit = () => {
    if (!reflection.trim()) {
      toast.error("Please write a reflection before submitting");
      return;
    }
    
    if (onReflectionSubmit) {
      onReflectionSubmit(reflection);
    }
    
    toast.success("Reflection saved");
    setReflection('');
  };

  // Get frequency display values
  const frequencyValue = frequency?.frequency || 0;
  const frequencyTitle = frequency?.title || `${frequencyValue}Hz Journey`;
  const chakraName = frequency?.chakra || '';
  const description = frequency?.description || `Experience the healing vibrations of ${frequencyValue}Hz frequency.`;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-purple-200 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className={`h-2 bg-gradient-to-r from-purple-400 to-blue-500`}></div>
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-900">{frequencyTitle}</h1>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="mr-2 border-purple-200 text-purple-700">
                  {frequencyValue}Hz
                </Badge>
                {chakraName && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    {chakraName} Chakra
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                <Clock className="inline-block mr-1 h-4 w-4" />
                {frequency?.duration ? `${Math.floor(frequency.duration / 60)} min` : '15-30 min'}
              </div>
              
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5 text-gray-400 hover:text-pink-500" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div>
                <p className="text-gray-600">{description}</p>
              </div>
              
              {!sessionStarted ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-medium text-purple-800">Set Your Intention</h3>
                  <p className="text-sm text-gray-600">
                    What would you like to create or experience during this frequency journey?
                  </p>
                  
                  <Textarea
                    placeholder="I am open to receiving..."
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <Button 
                    onClick={handleStartJourney}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Begin Journey
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="journey">
                      <Music className="h-4 w-4 mr-2" />
                      Journey
                    </TabsTrigger>
                    <TabsTrigger value="reflection">
                      <FileText className="h-4 w-4 mr-2" />
                      Reflection
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="journey" className="space-y-4 pt-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-2">Your Intention</Badge>
                        <p className="text-sm italic text-gray-600">"{intention}"</p>
                      </div>
                      
                      <div className={`rounded-lg overflow-hidden relative ${isVisualEffectActive ? 'h-48' : 'h-32'}`}>
                        <div className={`absolute inset-0 bg-gradient-to-br from-purple-300/20 via-indigo-300/20 to-blue-300/20 flex items-center justify-center transition-all ${isVisualEffectActive ? 'opacity-100' : 'opacity-0'}`}>
                          {isVisualEffectActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-pulse-slow absolute h-40 w-40 rounded-full bg-purple-400/30"></div>
                              <div className="animate-pulse-medium absolute h-32 w-32 rounded-full bg-indigo-400/30"></div>
                              <div className="animate-pulse-fast absolute h-24 w-24 rounded-full bg-blue-400/30"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <RandomizingAudioPlayer
                            audioUrl={audioUrl || frequency?.audio_url || frequency?.url}
                            groupId={audioGroupId || undefined}
                            frequency={frequencyValue}
                            autoPlay={isAudioPlaying}
                            onPlayStateChange={setIsAudioPlaying}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button 
                          variant="ghost" 
                          className="text-purple-600"
                          onClick={() => setIsVisualEffectActive(!isVisualEffectActive)}
                        >
                          {isVisualEffectActive ? 'Hide' : 'Show'} Visual Effects
                          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isVisualEffectActive ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="flex items-center text-sm font-medium text-purple-800 mb-2">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Guided Journey
                      </h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        Take slow, deep breaths.
                        Feel the frequency resonating within you.
                        Allow this {frequencyValue}Hz vibration to harmonize with your body.
                        {chakraName && ` Feel your ${chakraName} chakra opening and rebalancing.`}
                        Stay with this energy for as long as feels right.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reflection" className="pt-4">
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-md font-medium text-purple-800 mb-2">Journal Your Experience</h3>
                        <Textarea
                          placeholder="How did you feel during this journey? What insights arose?"
                          value={reflection}
                          onChange={(e) => setReflection(e.target.value)}
                          className="min-h-[150px] bg-white"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleReflectionSubmit}
                        className="w-full flex items-center justify-center"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Save Reflection
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-4">
                  <h3 className="text-md font-medium mb-4">Frequency Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Frequency</h4>
                      <p className="text-lg">{frequencyValue}Hz</p>
                    </div>
                    
                    {chakraName && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">Chakra</h4>
                        <p className="text-lg">{chakraName}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Benefits</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                        <li>Promotes energetic balance</li>
                        <li>Supports inner harmony</li>
                        {chakraName && <li>{`Activates ${chakraName} chakra energy`}</li>}
                        <li>Enhances meditation practice</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">How to Use</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                        <li>Find a quiet space</li>
                        <li>Use headphones for best experience</li>
                        <li>Focus on your intention</li>
                        <li>Allow 15-30 minutes for full effect</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyPlayer;
