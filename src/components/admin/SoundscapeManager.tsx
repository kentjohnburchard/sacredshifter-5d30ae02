
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FileAudio, Play, Pause, Edit, Trash, Upload, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  fetchAllSoundscapes, 
  createJourneySoundscape, 
  updateJourneySoundscape, 
  deleteJourneySoundscape,
  uploadSoundscapeFile,
  JourneySoundscape
} from '@/services/soundscapeService';
import { fetchJourneys, Journey } from '@/services/journeyService';

const SoundscapeManager: React.FC = () => {
  const [soundscapes, setSoundscapes] = useState<JourneySoundscape[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedSoundscape, setSelectedSoundscape] = useState<JourneySoundscape | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    journey_id: '',
    source_link: '',
    file_url: ''
  });
  
  useEffect(() => {
    loadSoundscapes();
    loadJourneys();
  }, []);
  
  const loadSoundscapes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSoundscapes();
      setSoundscapes(data);
    } catch (error) {
      console.error('Failed to load soundscapes:', error);
      toast.error('Failed to load soundscapes');
    } finally {
      setLoading(false);
    }
  };
  
  const loadJourneys = async () => {
    try {
      const data = await fetchJourneys();
      setJourneys(data);
    } catch (error) {
      console.error('Failed to load journeys:', error);
      toast.error('Failed to load journeys');
    }
  };
  
  const handleAddSoundscape = () => {
    setSelectedSoundscape(null);
    setFormData({
      title: '',
      description: '',
      journey_id: '',
      source_link: '',
      file_url: ''
    });
    setUploadedFile(null);
    setIsDialogOpen(true);
  };
  
  const handleEditSoundscape = (soundscape: JourneySoundscape) => {
    setSelectedSoundscape(soundscape);
    setFormData({
      title: soundscape.title,
      description: soundscape.description || '',
      journey_id: String(soundscape.journey_id),
      source_link: soundscape.source_link || '',
      file_url: soundscape.file_url
    });
    setUploadedFile(null);
    setIsDialogOpen(true);
  };
  
  const handleDeleteSoundscape = (soundscape: JourneySoundscape) => {
    setSelectedSoundscape(soundscape);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedSoundscape) {
      try {
        await deleteJourneySoundscape(selectedSoundscape.id);
        setSoundscapes(prev => prev.filter(s => s.id !== selectedSoundscape.id));
        toast.success(`Soundscape "${selectedSoundscape.title}" deleted`);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete soundscape:', error);
        toast.error('Failed to delete soundscape');
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const togglePlayAudio = (soundscape: JourneySoundscape) => {
    const audioUrl = getAudioUrl(soundscape.file_url);
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // Toggle this soundscape
    if (isPlaying[soundscape.id]) {
      setIsPlaying(prev => ({ ...prev, [soundscape.id]: false }));
      setCurrentAudio(null);
    } else {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Failed to play audio");
      });
      
      audio.onended = () => {
        setIsPlaying(prev => ({ ...prev, [soundscape.id]: false }));
        setCurrentAudio(null);
      };
      
      setCurrentAudio(audio);
      setIsPlaying(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(id => { newState[id] = false; });
        return { ...newState, [soundscape.id]: true };
      });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileUrl = formData.file_url;
      
      // Handle file upload if new file is selected
      if (uploadedFile) {
        setFileUploading(true);
        fileUrl = await uploadSoundscapeFile(uploadedFile);
        setFileUploading(false);
      }
      
      const soundscapeData = {
        title: formData.title,
        description: formData.description,
        journey_id: parseInt(formData.journey_id),
        source_link: formData.source_link,
        file_url: fileUrl
      };
      
      if (selectedSoundscape) {
        // Update existing soundscape
        const updated = await updateJourneySoundscape(selectedSoundscape.id, soundscapeData);
        setSoundscapes(prev => prev.map(s => s.id === selectedSoundscape.id ? updated as JourneySoundscape : s));
        toast.success(`Soundscape "${formData.title}" updated`);
      } else {
        // Create new soundscape
        const created = await createJourneySoundscape(soundscapeData);
        if (created) {
          setSoundscapes(prev => [created, ...prev]);
        }
        toast.success(`Soundscape "${formData.title}" created`);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save soundscape:', error);
      toast.error('Failed to save soundscape');
    }
  };

  // Format the audio URL if needed
  const getAudioUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
  };
  
  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-purple-800">Journey Soundscapes</h2>
        <Button 
          onClick={handleAddSoundscape}
          className="bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          <Upload className="h-4 w-4 mr-2" /> Add Soundscape
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Journey</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soundscapes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No soundscapes found. Click "Add Soundscape" to create your first entry.
                  </TableCell>
                </TableRow>
              ) : (
                soundscapes.map(soundscape => (
                  <TableRow key={soundscape.id}>
                    <TableCell className="font-medium">{soundscape.title}</TableCell>
                    <TableCell>
                      {journeys.find(j => j.id === soundscape.journey_id)?.title || 'Unknown Journey'}
                    </TableCell>
                    <TableCell>
                      {soundscape.description ? (
                        <span className="line-clamp-2">{soundscape.description}</span>
                      ) : (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-purple-600"
                          onClick={() => togglePlayAudio(soundscape)}
                        >
                          {isPlaying[soundscape.id] ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />}
                        </Button>
                        <FileAudio className="h-4 w-4 text-blue-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {soundscape.source_link ? (
                        <a 
                          href={soundscape.source_link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> Link
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSoundscape(soundscape)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSoundscape(soundscape)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSoundscape ? 'Edit Soundscape' : 'Add New Soundscape'}
            </DialogTitle>
            <DialogDescription>
              Add immersive audio to journey pages
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Soundscape title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="journey_id" className="block text-sm font-medium mb-1">
                  Journey *
                </label>
                <Select
                  value={formData.journey_id}
                  onValueChange={(value) => handleSelectChange('journey_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a journey" />
                  </SelectTrigger>
                  <SelectContent>
                    {journeys.map((journey) => (
                      <SelectItem key={journey.id} value={String(journey.id)}>
                        {journey.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Brief description of this soundscape"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="source_link" className="block text-sm font-medium mb-1">
                  Source Link
                </label>
                <Input
                  id="source_link"
                  name="source_link"
                  value={formData.source_link}
                  onChange={handleFormChange}
                  placeholder="https://source-website.com/soundscape"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional link to credit the source of this audio
                </p>
              </div>
              
              <div>
                <label htmlFor="file" className="block text-sm font-medium mb-1">
                  Audio File *
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg,audio/ogg"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {fileUploading && (
                    <div className="animate-spin h-5 w-5 border-b-2 border-purple-600 rounded-full"></div>
                  )}
                </div>
                
                {formData.file_url && !uploadedFile && (
                  <div className="flex items-center text-sm text-blue-600 mt-2">
                    <FileAudio className="h-4 w-4 mr-2" />
                    <span>Current audio file</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() => {
                        const audio = new Audio(getAudioUrl(formData.file_url));
                        audio.play().catch(console.error);
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: MP3, WAV, OGG (max 10MB)
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
                disabled={fileUploading || (!formData.file_url && !uploadedFile) || !formData.title || !formData.journey_id}
              >
                {fileUploading ? 'Uploading...' : selectedSoundscape ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Soundscape</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSoundscape?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SoundscapeManager;
