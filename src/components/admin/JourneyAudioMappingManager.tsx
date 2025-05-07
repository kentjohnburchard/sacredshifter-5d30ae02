import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Play, Pause, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  extractFrequencyFromContent,
  findMatchingAudioFiles,
  updateJourneyAudio,
  getAllAudioFiles,
  getAudioFileUrl
} from '@/services/journeyAudioService';
import { Journey } from '@/types/journey';

interface AudioMapping {
  journey_id: string; // Changed from number to string
  filename: string;
  frequency: string | null;
  audio_filename: string | null;
  is_enabled: boolean;
}

const JourneyAudioMappingManager: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [mappings, setMappings] = useState<Record<string, AudioMapping>>({}); // Changed from number to string key
  const [availableAudioFiles, setAvailableAudioFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null); // Changed from number to string
  
  // Load journeys and their audio information
  useEffect(() => {
    const loadJourneys = async () => {
      setLoadingJourneys(true);
      try {
        const { data, error } = await supabase
          .from('journeys')
          .select('id, title, filename, audio_filename')
          .order('title');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Convert all journey IDs to strings
          const journeysWithRequiredFields = data.map(journey => ({
            id: String(journey.id), // Explicitly convert ID to string
            title: journey.title,
            filename: journey.filename,
            audio_filename: journey.audio_filename,
            veil_locked: false // Default value as it's required by Journey type
          }));
          
          setJourneys(journeysWithRequiredFields as Journey[]);
          
          // Create mappings object for journeys
          const mappingsRecord: Record<string, AudioMapping> = {};
          
          journeysWithRequiredFields.forEach(journey => {
            const frequency = extractFrequencyFromContent(journey.title, journey.filename);
            mappingsRecord[journey.id] = {
              journey_id: journey.id,
              filename: journey.filename,
              frequency,
              audio_filename: journey.audio_filename || null,
              is_enabled: !!journey.audio_filename
            };
          });
          
          setMappings(mappingsRecord);
        }
      } catch (err) {
        console.error('Error loading journeys:', err);
        toast.error('Failed to load journeys');
      } finally {
        setLoadingJourneys(false);
      }
    };
    
    const loadAudioFiles = async () => {
      setLoadingAudio(true);
      try {
        const audioFiles = await getAllAudioFiles();
        setAvailableAudioFiles(audioFiles);
      } catch (err) {
        console.error('Error loading audio files:', err);
      } finally {
        setLoadingAudio(false);
      }
    };
    
    loadJourneys();
    loadAudioFiles();
  }, []);
  
  // Update mapping and save to database
  const handleUpdateMapping = async (
    journeyId: string, // Changed from number to string
    updates: Partial<Pick<AudioMapping, 'audio_filename' | 'is_enabled'>>
  ) => {
    try {
      // Update local state first for responsive UI
      setMappings(prev => ({
        ...prev,
        [journeyId]: {
          ...prev[journeyId],
          ...updates,
          is_enabled: updates.audio_filename ? true : prev[journeyId].is_enabled
        }
      }));
      
      // Save to database - only update audio_filename field in journeys table
      // Convert journeyId to number for database operation
      const result = await updateJourneyAudio(
        parseInt(journeyId), // Convert string ID to number for database
        updates.audio_filename !== undefined ? updates.audio_filename : mappings[journeyId].audio_filename
      );
      
      if (!result) {
        toast.error('Failed to update audio mapping');
      }
    } catch (err) {
      console.error('Error updating mapping:', err);
      toast.error('Failed to update audio mapping');
    }
  };
  
  // Find suggested audio files for a journey
  const findSuggestions = async (journeyId: string) => { // Changed from number to string
    const journey = journeys.find(j => j.id === journeyId);
    if (!journey) return;
    
    const mapping = mappings[journeyId];
    if (!mapping) return;
    
    try {
      const suggestions = await findMatchingAudioFiles(mapping.frequency, journey.filename);
      if (suggestions.length > 0) {
        handleUpdateMapping(journeyId, { audio_filename: suggestions[0] });
        toast.success(`Found matching audio: ${suggestions[0]}`);
      } else {
        toast.info('No matching audio files found');
      }
    } catch (err) {
      console.error('Error finding suggestions:', err);
    }
  };
  
  // Handle audio playback
  const handlePlayPreview = (journeyId: string, audioFilename: string | null) => { // Changed from number to string
    if (!audioFilename) {
      toast.error('No audio file selected');
      return;
    }
    
    // Stop currently playing audio if any
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
      setPlayingId(null);
    }
    
    // If we clicked on the same journey that was already playing, just stop
    if (playingId === journeyId) {
      return;
    }
    
    // Play new audio
    const audio = new Audio(getAudioFileUrl(audioFilename));
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      toast.error('Failed to play audio');
    });
    
    setCurrentAudio(audio);
    setPlayingId(journeyId);
    
    // Stop after 10 seconds
    setTimeout(() => {
      if (audio) {
        audio.pause();
        if (playingId === journeyId) {
          setPlayingId(null);
        }
      }
    }, 10000);
  };
  
  // Filter journeys by search term
  const filteredJourneys = journeys.filter(journey => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      journey.title.toLowerCase().includes(searchLower) ||
      journey.filename.toLowerCase().includes(searchLower) ||
      (mappings[journey.id]?.frequency || '').toLowerCase().includes(searchLower)
    );
  });
  
  if (loadingJourneys) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Journey Audio Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading journeys...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Journey Audio Mapping</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search journeys"
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Journey</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="w-1/3">Audio File</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJourneys.map((journey) => {
                const mapping = mappings[journey.id];
                if (!mapping) return null;
                
                return (
                  <TableRow key={journey.id}>
                    <TableCell className="font-medium">{journey.title}</TableCell>
                    <TableCell>
                      {mapping.frequency || 'Not detected'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={mapping.audio_filename || ''}
                        onValueChange={(value) => handleUpdateMapping(journey.id, { audio_filename: value || null })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select audio file" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableAudioFiles.map((file) => (
                            <SelectItem key={file} value={file}>{file}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={!mapping.audio_filename}
                        onClick={() => handlePlayPreview(journey.id, mapping.audio_filename)}
                      >
                        {playingId === journey.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={mapping.is_enabled}
                        onCheckedChange={(checked) => handleUpdateMapping(journey.id, { 
                          audio_filename: checked ? mapping.audio_filename : null 
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => findSuggestions(journey.id)}
                      >
                        Find Match
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyAudioMappingManager;
