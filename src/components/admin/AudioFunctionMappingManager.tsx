import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Music, PlayCircle, AudioWaveform, Volume2, AudioLines } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AudioFunction, AudioFunctionMapping } from '@/types/music';

const AudioFunctionMappingManager: React.FC = () => {
  const [audioFunctions, setAudioFunctions] = useState<AudioFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [newAudioUrl, setNewAudioUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('journey');
  const [mappings, setMappings] = useState<Record<string, AudioFunctionMapping>>({});

  // List of all available sound functions by category
  const audioFunctionsList: AudioFunction[] = [
    // Journey-related audio functions
    { id: 'journey-start', name: 'Journey Start', description: 'Plays when a journey begins', category: 'journey' },
    { id: 'journey-end', name: 'Journey End', description: 'Plays when a journey completes', category: 'journey' },
    { id: 'guided-meditation', name: 'Guided Meditation', description: 'Background audio for guided meditations', category: 'journey' },
    { id: 'frequency-shift', name: 'Frequency Shifting', description: 'Audio for frequency shifting exercises', category: 'journey' },
    { id: 'journey-transition', name: 'Journey Transition', description: 'Plays during transitions between journey stages', category: 'journey' },
    
    // Interface sounds
    { id: 'button-click', name: 'Button Click', description: 'Plays when buttons are clicked', category: 'interface' },
    { id: 'notification', name: 'Notification', description: 'Plays for system notifications', category: 'interface' },
    { id: 'achievement', name: 'Achievement', description: 'Plays when user reaches an achievement', category: 'interface' },
    { id: 'error', name: 'Error', description: 'Plays on error or invalid action', category: 'interface' },
    { id: 'success', name: 'Success', description: 'Plays on successful completion of action', category: 'interface' },
    
    // Meditation-specific
    { id: 'meditation-start', name: 'Meditation Start', description: 'Beginning of meditation session', category: 'meditation' },
    { id: 'meditation-bell', name: 'Meditation Bell', description: 'Interval bell during meditation', category: 'meditation' },
    { id: 'meditation-end', name: 'Meditation End', description: 'End of meditation session', category: 'meditation' },
    { id: 'breath-guide', name: 'Breathing Guide', description: 'Audio to guide breathing exercises', category: 'meditation' },
    
    // Frequency and vibration
    { id: 'root-chakra', name: 'Root Chakra', description: '396 Hz frequency for Root Chakra', category: 'frequency' },
    { id: 'sacral-chakra', name: 'Sacral Chakra', description: '417 Hz frequency for Sacral Chakra', category: 'frequency' },
    { id: 'solar-plexus', name: 'Solar Plexus', description: '528 Hz frequency for Solar Plexus', category: 'frequency' },
    { id: 'heart-chakra', name: 'Heart Chakra', description: '639 Hz frequency for Heart Chakra', category: 'frequency' },
    { id: 'throat-chakra', name: 'Throat Chakra', description: '741 Hz frequency for Throat Chakra', category: 'frequency' },
    { id: 'third-eye', name: 'Third Eye', description: '852 Hz frequency for Third Eye Chakra', category: 'frequency' },
    { id: 'crown-chakra', name: 'Crown Chakra', description: '963 Hz frequency for Crown Chakra', category: 'frequency' },
  ];

  useEffect(() => {
    // Filter functions by category
    const filteredFunctions = audioFunctionsList.filter(func => func.category === activeTab);
    setAudioFunctions(filteredFunctions);
    
    // Reset selection when changing tabs
    setSelectedFunction('');
    
    // Load existing mappings from database
    fetchAudioMappings();
  }, [activeTab]);

  const fetchAudioMappings = async () => {
    try {
      setLoading(true);
      
      // Now that the table exists, we can fetch the data
      const { data, error } = await supabase
        .from('audio_function_mappings')
        .select('*');
        
      if (error) {
        console.error('Error fetching audio mappings:', error);
        return;
      }
      
      // Convert array to record keyed by function_id for easy lookup
      const mappingsRecord: Record<string, AudioFunctionMapping> = {};
      if (data) {
        data.forEach((mapping: any) => {
          mappingsRecord[mapping.function_id] = mapping as AudioFunctionMapping;
        });
      }
      
      setMappings(mappingsRecord);
    } catch (err) {
      console.error('Error in fetchAudioMappings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFunction) {
      toast.error('Please select an audio function');
      return;
    }
    
    if (!audioFileName) {
      toast.error('Please enter an audio file name');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Generate the audio URL if not provided
      const audioUrl = newAudioUrl || `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioFileName}`;
      
      // Now that the table exists, we can insert data
      const { data, error } = await supabase
        .from('audio_function_mappings')
        .insert([
          {
            function_id: selectedFunction,
            audio_file_name: audioFileName,
            audio_url: audioUrl,
            is_primary: isPrimary
          }
        ]);
      
      if (error) {
        console.error('Error adding audio mapping:', error);
        toast.error('Failed to save audio mapping');
        return;
      }
      
      // Update local state to show the mapping
      fetchAudioMappings();
      
      // Reset form
      setAudioFileName('');
      setNewAudioUrl('');
      setIsPrimary(true);
      
      toast.success('Audio function mapping added successfully');
    } catch (error) {
      console.error('Error adding audio mapping:', error);
      toast.error('Failed to add audio function mapping');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get the currently selected function
  const selectedFunctionDetails = audioFunctions.find(f => f.id === selectedFunction);
  
  // Get current mapping for the selected function
  const currentMapping = selectedFunction ? mappings[selectedFunction] : null;

  // Function to get icon for the category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'journey':
        return <PlayCircle className="h-4 w-4" />;
      case 'interface':
        return <AudioWaveform className="h-4 w-4" />;
      case 'meditation':
        return <Volume2 className="h-4 w-4" />;
      case 'frequency':
        return <AudioLines className="h-4 w-4" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <AudioLines className="h-5 w-5 text-purple-600" />
          Sound Function Mapping Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              <span>Journeys</span>
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <AudioWaveform className="h-4 w-4" />
              <span>Interface</span>
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Meditation</span>
            </TabsTrigger>
            <TabsTrigger value="frequency" className="flex items-center gap-2">
              <AudioLines className="h-4 w-4" />
              <span>Frequency</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-4">Add Sound Mapping</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="function">Audio Function</Label>
                  <Select 
                    value={selectedFunction} 
                    onValueChange={setSelectedFunction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a function" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioFunctions.map(func => (
                        <SelectItem key={func.id} value={func.id}>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(func.category)}
                            <span>{func.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedFunctionDetails && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFunctionDetails.description}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="fileName">Audio File Name</Label>
                  <Input 
                    id="fileName" 
                    value={audioFileName}
                    onChange={(e) => setAudioFileName(e.target.value)}
                    placeholder="sound-effects/notification.mp3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Path in Supabase storage, e.g., "journey/meditation.mp3"
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="url">Custom Audio URL (Optional)</Label>
                  <Input 
                    id="url" 
                    value={newAudioUrl}
                    onChange={(e) => setNewAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use Supabase storage URL based on file name
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isPrimary" 
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isPrimary">Set as primary audio for this function</Label>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={submitting || !selectedFunction || !audioFileName}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <AudioLines className="mr-2 h-4 w-4" />
                      Add Audio Mapping
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Current Mapping</h3>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
                </div>
              ) : selectedFunction ? (
                currentMapping ? (
                  <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
                    <h4 className="font-medium">{audioFunctions.find(f => f.id === selectedFunction)?.name}</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">File: <span className="font-mono text-xs">{currentMapping.audio_file_name}</span></p>
                      {currentMapping.audio_url && (
                        <p className="text-sm">URL: <span className="font-mono text-xs truncate block">{currentMapping.audio_url}</span></p>
                      )}
                      <p className="text-sm">Primary: <span className={currentMapping.is_primary ? "text-green-600" : "text-gray-500"}>{currentMapping.is_primary ? "Yes" : "No"}</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-500 text-center">
                    No audio mapping defined for this function yet
                  </div>
                )
              ) : (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-500 text-center">
                  Select an audio function to view its mapping
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">All Functions in Category</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {audioFunctions.map(func => {
                    const hasMapping = !!mappings[func.id];
                    return (
                      <div 
                        key={func.id}
                        className={`p-3 rounded-md border ${hasMapping ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{func.name}</h4>
                            <p className="text-xs text-gray-500">{func.description}</p>
                          </div>
                          {hasMapping && (
                            <div className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-md">
                              Mapped
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AudioFunctionMappingManager;
