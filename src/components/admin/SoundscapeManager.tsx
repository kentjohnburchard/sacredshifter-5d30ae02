
import React, { useState, useEffect } from 'react';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { toast } from 'sonner';
import { Music, Trash2, Youtube, FileMusic, PlusCircle, ExternalLink, Upload, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { ensureSoundscapeBucket, uploadSoundscapeFile, deleteSoundscapeFile } from '@/services/soundscapeService';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Define the type we need since JourneySoundscape is no longer imported
type SourceType = 'file' | 'youtube';

interface BasicSoundscape {
  id?: string;
  title: string;
  description?: string | null;
  journey_id?: number | null;
  source_type?: SourceType;
  source_link?: string | null;
  file_url?: string | null;
  created_at?: string;
}

// Simplest YouTube URL validation
function validateYoutubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

const SoundscapeManager: React.FC = () => {
  const [soundscapes, setSoundscapes] = useState<BasicSoundscape[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState<BasicSoundscape | null>(null);
  const [sourceType, setSourceType] = useState<SourceType>('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    journey_id: '',
    source_link: '',
    file_url: ''
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [soundscapeToDelete, setSoundscapeToDelete] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storageBucketInfo, setStorageBucketInfo] = useState<{ exists: boolean; name: string; error: string | null }>({ exists: false, name: '', error: null });

  // Check Supabase storage bucket
  const checkStorageBucket = async () => {
    try {
      const bucketInfo = await ensureSoundscapeBucket();
      setStorageBucketInfo(bucketInfo);
    } catch (error) {
      console.error('Error checking storage bucket:', error);
      setStorageBucketInfo({ exists: false, name: 'soundscapes', error: 'Error checking bucket status' });
    }
  };

  useEffect(() => {
    loadData();
    checkStorageBucket();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load journeys
      const journeysData = await fetchJourneys();
      setJourneys(journeysData);
      
      // Load all soundscapes directly from the database
      const { data: soundscapesData, error } = await supabase
        .from('journey_soundscapes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSoundscapes(soundscapesData || []);
      console.log("Loaded soundscapes:", soundscapesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSourceTypeChange = (value: string) => {
    setSourceType(value as SourceType);
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
    setFileToUpload(null);
    setUploadProgress(0);
  };

  const handleOpenNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditSoundscape = (soundscape: BasicSoundscape) => {
    setSelectedSoundscape(soundscape);
    setSourceType((soundscape.source_type || 'file') as SourceType);
    
    setFormData({
      title: soundscape.title || '',
      description: soundscape.description || '',
      journey_id: String(soundscape.journey_id) || '',
      source_link: soundscape.source_link || '',
      file_url: soundscape.file_url || ''
    });
    
    setDialogOpen(true);
  };

  // Delete handlers
  const handleDeleteRequest = (id: string) => {
    setSoundscapeToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!soundscapeToDelete) return;
    
    try {
      // Find the soundscape to delete
      const soundscapeToRemove = soundscapes.find(s => s.id === soundscapeToDelete);
      if (soundscapeToRemove && soundscapeToRemove.file_url) {
        // Delete the file from storage if it exists
        await deleteSoundscapeFile(soundscapeToRemove.file_url);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('journey_soundscapes')
        .delete()
        .eq('id', soundscapeToDelete);
        
      if (error) throw error;
      
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

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setFileToUpload(file);
      } else {
        toast.error('Please select an audio file');
        e.target.value = '';
      }
    }
  };

  // Form validation
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

    if (sourceType === 'file' && !formData.file_url.trim() && !fileToUpload) {
      toast.error('Please enter an audio file URL or upload a file');
      return false;
    }

    return true;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setUploadingFile(true);
      
      // First upload file if one is selected
      let fileUrl = formData.file_url;
      
      if (fileToUpload && sourceType === 'file') {
        try {
          const uploadResult = await uploadSoundscapeFile(fileToUpload, (progress) => {
            setUploadProgress(progress);
          });
          fileUrl = uploadResult.url;
          toast.success('File uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload file');
          setUploadingFile(false);
          return;
        }
      }
      
      // Convert journey_id to number
      const journeyId = parseInt(formData.journey_id, 10);
      
      const soundscapeData = {
        title: formData.title,
        description: formData.description || null,
        journey_id: journeyId,
        source_type: sourceType,
        source_link: sourceType === 'youtube' ? formData.source_link : null,
        file_url: sourceType === 'file' ? fileUrl : null
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
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
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
        {/* Supabase Storage Info */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Supabase Storage Integration</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                  {storageBucketInfo.exists ? 
                    `Connected to Supabase bucket "${storageBucketInfo.name}" for soundscape audio storage.` : 
                    `Supabase bucket "${storageBucketInfo.name}" will be created when you upload your first file.`}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-700">
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Direct audio upload to Supabase
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
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
                        {journeys.find(j => j.id.toString() === soundscape.journey_id?.toString())?.title || 'No journey assigned'}
                      </p>
                      {soundscape.description && <p className="text-sm">{soundscape.description}</p>}
                      {soundscape.file_url && (
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-md">
                          Source: {soundscape.file_url}
                        </p>
                      )}
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
              {/* Form content */}
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
                  onValueChange={handleSourceTypeChange} 
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
                      {/* File upload option */}
                      <div className="border-2 border-purple-200 dark:border-purple-800 rounded-md p-4 bg-purple-50 dark:bg-purple-900/20 mb-4">
                        <Label htmlFor="fileUpload" className="block mb-2 font-medium">Upload Audio File</Label>
                        <Input
                          id="fileUpload"
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="mb-2"
                        />
                        {fileToUpload && (
                          <p className="text-sm text-green-600 mt-1">{fileToUpload.name} selected</p>
                        )}
                        {uploadProgress > 0 && (
                          <div className="mt-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${Math.round(uploadProgress)}%`}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Label htmlFor="file_url">Or Enter Audio URL</Label>
                      <Input
                        id="file_url"
                        name="file_url"
                        value={formData.file_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/audio.mp3"
                      />
                      <p className="text-xs text-gray-500">
                        Enter a direct URL to an audio file
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
              <Button 
                onClick={handleSubmit}
                disabled={uploadingFile}
              >
                {uploadingFile ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Uploading...
                  </>
                ) : selectedSoundscape ? (
                  'Update'
                ) : (
                  'Create'
                )} Soundscape
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this soundscape? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default SoundscapeManager;
