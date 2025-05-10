
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchJourneys } from '@/services/journeyService';
import { Plus, Trash2, ExternalLink, FileMusic, Youtube, Play } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface Journey {
  id: string | number;
  title: string;
  filename?: string;
}

interface Soundscape {
  id: string;
  journey_id: number;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
  source_type: 'file' | 'youtube';
  created_at: string;
}

const JourneySoundscapeAdmin: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<string | number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [soundscapeToDelete, setSoundscapeToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sourceType, setSourceType] = useState<'file' | 'youtube'>('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    journey_id: '',
    source_link: '',
    file_url: ''
  });
  const [selectedSoundscape, setSelectedSoundscape] = useState<Soundscape | null>(null);
  const { playAudio, stopAudio } = useGlobalAudioPlayer();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load journeys
        const journeysData = await fetchJourneys();
        setJourneys(journeysData);
        
        // Load soundscapes
        const { data, error } = await supabase
          .from('journey_soundscapes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setSoundscapes(data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      journey_id: '',
      source_link: '',
      file_url: ''
    });
    setSourceType('file');
    setSelectedSoundscape(null);
  };

  const handleOpenNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditSoundscape = (soundscape: Soundscape) => {
    setSelectedSoundscape(soundscape);
    setSourceType(soundscape.source_type || 'file');
    
    setFormData({
      title: soundscape.title || '',
      description: soundscape.description || '',
      journey_id: String(soundscape.journey_id) || '',
      source_link: soundscape.source_link || '',
      file_url: soundscape.file_url || ''
    });
    
    setDialogOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setSoundscapeToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!soundscapeToDelete) return;
    
    try {
      const { error } = await supabase
        .from('journey_soundscapes')
        .delete()
        .eq('id', soundscapeToDelete);
        
      if (error) throw error;
      
      setSoundscapes(prev => prev.filter(s => s.id !== soundscapeToDelete));
      toast.success('Soundscape deleted successfully');
      
      // Stop audio if the deleted soundscape was playing
      stopAudio();
    } catch (error) {
      console.error('Error deleting soundscape:', error);
      toast.error('Failed to delete soundscape');
    } finally {
      setConfirmDialogOpen(false);
      setSoundscapeToDelete(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }

    if (!formData.journey_id) {
      toast.error('Please select a journey');
      return false;
    }

    if (sourceType === 'youtube' && !formData.source_link.includes('youtube')) {
      toast.error('Please enter a valid YouTube URL');
      return false;
    }

    if (sourceType === 'file' && !formData.file_url.trim()) {
      toast.error('Please enter an audio file URL');
      return false;
    }

    return true;
  };

  const handlePlaySoundscape = (soundscape: Soundscape) => {
    playAudio({
      id: soundscape.id,
      title: soundscape.title,
      source: soundscape.file_url,
      description: soundscape.description
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      // Convert journey_id to number
      const journeyId = parseInt(formData.journey_id, 10);
      
      const soundscapeData = {
        title: formData.title,
        description: formData.description || null,
        journey_id: journeyId,
        source_type: sourceType,
        source_link: sourceType === 'youtube' ? formData.source_link : null,
        file_url: sourceType === 'file' ? formData.file_url : formData.source_link,
      };
      
      let updatedSoundscape;
      
      if (selectedSoundscape?.id) {
        // Update existing soundscape
        const { data, error } = await supabase
          .from('journey_soundscapes')
          .update(soundscapeData)
          .eq('id', selectedSoundscape.id)
          .select()
          .single();
          
        if (error) throw error;
        updatedSoundscape = data;
        
        setSoundscapes(prev => prev.map(s => s.id === updatedSoundscape.id ? updatedSoundscape : s));
        toast.success('Soundscape updated successfully');
      } else {
        // Create new soundscape
        const { data, error } = await supabase
          .from('journey_soundscapes')
          .insert(soundscapeData)
          .select()
          .single();
          
        if (error) throw error;
        updatedSoundscape = data;
        
        setSoundscapes(prev => [updatedSoundscape, ...prev]);
        toast.success('Soundscape created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving soundscape:', error);
      toast.error('Failed to save soundscape');
    }
  };

  const filteredSoundscapes = selectedJourney
    ? soundscapes.filter(s => String(s.journey_id) === String(selectedJourney))
    : soundscapes;

  return (
    <PageLayout title="Journey Soundscapes">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Journey Soundscapes</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage audio content for sacred journeys
            </p>
          </div>
          <Button onClick={handleOpenNewDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Soundscape
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Journey selector */}
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Journeys</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div 
                      className={`p-2 rounded cursor-pointer ${
                        selectedJourney === null 
                          ? 'bg-purple-100 dark:bg-purple-900' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedJourney(null)}
                    >
                      All Journeys
                    </div>
                    {journeys.map(journey => (
                      <div 
                        key={journey.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedJourney === journey.id 
                            ? 'bg-purple-100 dark:bg-purple-900' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedJourney(journey.id)}
                      >
                        {journey.title}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Soundscape list */}
          <div className="col-span-1 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedJourney 
                    ? `Soundscapes for "${journeys.find(j => String(j.id) === String(selectedJourney))?.title}"` 
                    : "All Soundscapes"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full"></div>
                  </div>
                ) : filteredSoundscapes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No soundscapes found for the selected journey
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSoundscapes.map(soundscape => (
                      <Card key={soundscape.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-start p-4">
                            <div className="flex-shrink-0 mr-4">
                              {soundscape.source_type === 'youtube' ? (
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-md flex items-center justify-center">
                                  <Youtube className="text-red-500" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                                  <FileMusic className="text-purple-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{soundscape.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {journeys.find(j => String(j.id) === String(soundscape.journey_id))?.title || 'Unknown Journey'}
                              </p>
                              {soundscape.description && <p className="text-sm">{soundscape.description}</p>}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePlaySoundscape(soundscape)}
                              >
                                <Play className="h-4 w-4 mr-1" /> Play
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditSoundscape(soundscape)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700" 
                                onClick={() => handleDeleteRequest(soundscape.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Soundscape Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSoundscape ? 'Edit Soundscape' : 'Add New Soundscape'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="journey_id" className="text-right">Journey</Label>
              <Select 
                value={formData.journey_id}
                onValueChange={(value) => handleSelectChange('journey_id', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a journey" />
                </SelectTrigger>
                <SelectContent>
                  {journeys.map(journey => (
                    <SelectItem key={journey.id} value={String(journey.id)}>
                      {journey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Soundscape title"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the soundscape"
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Source Type</Label>
              <Tabs 
                value={sourceType} 
                onValueChange={(value) => setSourceType(value as 'file' | 'youtube')} 
                className="col-span-3"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center">
                    <FileMusic className="h-4 w-4 mr-2" />
                    Audio File
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="flex items-center">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="file_url">Audio File URL</Label>
                    <Input
                      id="file_url"
                      name="file_url"
                      value={formData.file_url}
                      onChange={handleInputChange}
                      placeholder="/audio/filename.mp3"
                    />
                    <p className="text-xs text-gray-500">
                      Enter the path to an audio file in the public folder
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="youtube" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="source_link">YouTube URL</Label>
                    <Input
                      id="source_link"
                      name="source_link"
                      value={formData.source_link}
                      onChange={handleInputChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-500">
                      Enter a valid YouTube video URL
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedSoundscape ? 'Update' : 'Create'} Soundscape
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this soundscape? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default JourneySoundscapeAdmin;
