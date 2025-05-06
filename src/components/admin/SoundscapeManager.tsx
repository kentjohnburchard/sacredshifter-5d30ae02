
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getAllSoundscapes,
  createJourneySoundscape,
  updateJourneySoundscape,
  deleteJourneySoundscape,
  JourneySoundscape,
  validateYoutubeUrl
} from '@/services/soundscapeService';
import { fetchJourneys, Journey } from '@/services/journeyService';
import { toast } from 'sonner';
import { Music, Trash2, Youtube, FileMusic, PlusCircle, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SoundscapeManager: React.FC = () => {
  const [soundscapes, setSoundscapes] = useState<JourneySoundscape[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState<JourneySoundscape | null>(null);
  const [sourceType, setSourceType] = useState<'file' | 'youtube'>('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    journey_id: '',
    source_link: '',
    file_url: ''
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [soundscapeToDelete, setSoundscapeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [soundscapesData, journeysData] = await Promise.all([
          getAllSoundscapes(),
          fetchJourneys()
        ]);
        setSoundscapes(soundscapesData);
        setJourneys(journeysData);
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

  const handleSourceTypeChange = (value: 'file' | 'youtube') => {
    setSourceType(value);
    // Reset source-specific fields
    setFormData(prev => ({
      ...prev,
      source_link: '',
      file_url: ''
    }));
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

  const handleEditSoundscape = (soundscape: JourneySoundscape) => {
    setSelectedSoundscape(soundscape);
    setSourceType(soundscape.source_type);
    setFormData({
      title: soundscape.title || '',
      description: soundscape.description || '',
      journey_id: soundscape.journey_id?.toString() || '',
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
      await deleteJourneySoundscape(soundscapeToDelete);
      setSoundscapes(prev => prev.filter(s => s.id !== soundscapeToDelete));
      toast.success('Soundscape deleted successfully');
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

    if (sourceType === 'youtube' && !validateYoutubeUrl(formData.source_link)) {
      toast.error('Please enter a valid YouTube URL');
      return false;
    }

    if (sourceType === 'file' && !formData.file_url.trim()) {
      toast.error('Please enter an audio file URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const soundscapeData = {
        title: formData.title,
        description: formData.description,
        journey_id: parseInt(formData.journey_id),
        source_link: sourceType === 'file' ? undefined : formData.source_link,
        file_url: sourceType === 'youtube' ? formData.source_link : formData.file_url,
        source_type: sourceType
      };
      
      let updatedSoundscape;
      
      if (selectedSoundscape?.id) {
        // Update existing soundscape
        updatedSoundscape = await updateJourneySoundscape(selectedSoundscape.id, soundscapeData);
        setSoundscapes(prev => 
          prev.map(s => s.id === updatedSoundscape.id ? updatedSoundscape : s)
        );
        toast.success('Soundscape updated successfully');
      } else {
        // Create new soundscape
        updatedSoundscape = await createJourneySoundscape({
          ...soundscapeData,
          journey_id: parseInt(formData.journey_id)
        });
        if (updatedSoundscape) {
          setSoundscapes(prev => [updatedSoundscape!, ...prev]);
          toast.success('Soundscape created successfully');
        }
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving soundscape:', error);
      toast.error('Failed to save soundscape');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Journey Soundscapes</CardTitle>
        <Button onClick={handleOpenNewDialog} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Soundscape
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading soundscapes...</div>
        ) : soundscapes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No soundscapes found. Add one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {soundscapes.map(soundscape => (
              <Card key={soundscape.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0 mr-4">
                      {soundscape.source_type === 'youtube' ? (
                        <div className="w-12 h-12 bg-red-100 rounded-md flex items-center justify-center">
                          <Youtube className="text-red-500" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                          <Music className="text-purple-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{soundscape.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {journeys.find(j => j.id.toString() === soundscape.journey_id)?.title || 'No journey assigned'}
                      </p>
                      {soundscape.description && <p className="text-sm">{soundscape.description}</p>}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditSoundscape(soundscape)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" 
                        onClick={() => handleDeleteRequest(soundscape.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSoundscape ? 'Edit Soundscape' : 'Add New Soundscape'}</DialogTitle>
              <DialogDescription>
                Add audio content for journey experiences.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
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
                      <SelectItem key={journey.id} value={journey.id.toString()}>
                        {journey.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  onValueChange={(value) => handleSourceTypeChange(value as 'file' | 'youtube')} 
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
        
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this soundscape? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
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
      </CardContent>
    </Card>
  );
};

export default SoundscapeManager;
