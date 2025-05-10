
import React, { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchJourneys, 
  fetchJourneySoundscapes, 
  createJourneySoundscape, 
  updateJourneySoundscape, 
  deleteJourneySoundscape 
} from '@/services/journeyService';
import { Plus, Trash2, ExternalLink, FileMusic, Youtube, Play, Pause, Volume2, VolumeX, PencilIcon, Upload, Info, FileAudio } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

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

const STORAGE_BUCKET = 'frequency-assets';
const STORAGE_FOLDER = 'soundscapes';

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
  const { playAudio, stopAudio, isPlaying, togglePlayPause, currentAudioId, isMuted, toggleMute } = useGlobalAudioPlayer();
  const [urlValidationState, setUrlValidationState] = useState<'valid' | 'invalid' | 'checking' | 'idle'>('idle');
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [bulkUploadText, setBulkUploadText] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [testSoundscape, setTestSoundscape] = useState<Soundscape | null>(null);
  const [storageBucketInfo, setStorageBucketInfo] = useState<{ exists: boolean; files: number }>({ exists: false, files: 0 });

  useEffect(() => {
    loadData();
    checkStorageBucket();
  }, []);

  const checkStorageBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error checking buckets:', error);
        return;
      }

      const bucketExists = buckets.some(bucket => bucket.name === STORAGE_BUCKET);
      
      if (bucketExists) {
        // Count files in the soundscapes folder
        const { data: files, error: filesError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(STORAGE_FOLDER);
          
        if (filesError) {
          console.error('Error checking files:', filesError);
          setStorageBucketInfo({ exists: true, files: 0 });
        } else {
          setStorageBucketInfo({ exists: true, files: files.length });
        }
      } else {
        setStorageBucketInfo({ exists: false, files: 0 });
      }
    } catch (error) {
      console.error('Error checking storage bucket:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Create a test soundscape to demonstrate CRUD if none exist
      if (!testSoundscape) {
        const testItem = {
          id: 'demo-1',
          journey_id: 1,
          title: 'Demo Soundscape (Sample)',
          description: 'This is a sample soundscape to demonstrate the CRUD functionality. It is not saved to the database.',
          file_url: 'https://example.com/sample-audio.mp3',
          source_type: 'file' as const,
          created_at: new Date().toISOString(),
          source_link: ''
        };
        setTestSoundscape(testItem);
      }

      // Load journeys
      const journeysData = await fetchJourneys();
      setJourneys(journeysData);
      
      // Load all soundscapes initially
      const soundscapesData = await fetchJourneySoundscapes();
      setSoundscapes(soundscapesData);
      console.log("Loaded soundscapes:", soundscapesData);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJourney) {
      loadJourneySoundscapes();
    }
  }, [selectedJourney]);

  const loadJourneySoundscapes = async () => {
    setLoading(true);
    try {
      const data = await fetchJourneySoundscapes(selectedJourney);
      setSoundscapes(data);
      console.log("Loaded soundscapes for journey:", selectedJourney, data);
    } catch (error) {
      console.error('Error loading soundscapes:', error);
      toast.error('Failed to load soundscapes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // URL validation for audio files
    if (name === 'file_url' && value && sourceType === 'file') {
      validateAudioUrl(value);
    }
  };

  const validateAudioUrl = async (url: string) => {
    if (!url) return;
    
    // Skip validation for local files or files in Supabase storage
    if (!url.startsWith('http') || url.includes('supabase.co')) {
      return;
    }
    
    setUrlValidationState('checking');
    
    try {
      // Try to fetch the header to see if it exists and is an audio file
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('audio')) {
          setUrlValidationState('valid');
        } else {
          setUrlValidationState('invalid');
          toast.warning('URL exists but may not be an audio file');
        }
      } else {
        setUrlValidationState('invalid');
        toast.warning('Could not verify audio URL');
      }
    } catch (error) {
      console.error('Error validating URL:', error);
      // Don't show error to user - many valid URLs will fail CORS checks
      setUrlValidationState('idle');
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      journey_id: selectedJourney ? String(selectedJourney) : '',
      source_link: '',
      file_url: ''
    });
    setSourceType('file');
    setSelectedSoundscape(null);
    setUrlValidationState('idle');
    setFileToUpload(null);
    setUploadProgress(0);
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
      await deleteJourneySoundscape(soundscapeToDelete);
      
      setSoundscapes(prev => prev.filter(s => s.id !== soundscapeToDelete));
      toast.success('Soundscape deleted successfully');
      
      // Stop audio if the deleted soundscape was playing
      if (currentAudioId === soundscapeToDelete) {
        stopAudio();
      }
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

    if (sourceType === 'file' && !formData.file_url.trim() && !fileToUpload) {
      toast.error('Please enter an audio file URL or upload a file');
      return false;
    }

    return true;
  };

  const handlePlaySoundscape = (soundscape: Soundscape) => {
    if (isPlaying && currentAudioId === soundscape.id) {
      togglePlayPause();
      return;
    }
    
    playAudio({
      id: soundscape.id,
      title: soundscape.title,
      source: soundscape.file_url,
      description: soundscape.description
    });
  };

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

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    setUploadingFile(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file name with timestamp and original name
      const timestamp = new Date().getTime();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${STORAGE_FOLDER}/${timestamp}-${cleanFileName}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
      }

      // Get public URL for file
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      
      await checkStorageBucket(); // Refresh storage info
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in file upload process:', error);
      throw error;
    } finally {
      setUploadingFile(false);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      // First upload file if one is selected
      let fileUrl = formData.file_url;
      
      if (fileToUpload && sourceType === 'file') {
        try {
          fileUrl = await uploadFileToSupabase(fileToUpload);
          toast.success('File uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload file');
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
        file_url: sourceType === 'file' ? fileUrl : formData.source_link,
      };
      
      let updatedSoundscape;
      
      if (selectedSoundscape?.id) {
        // Update existing soundscape
        updatedSoundscape = await updateJourneySoundscape(selectedSoundscape.id, soundscapeData);
        setSoundscapes(prev => prev.map(s => s.id === updatedSoundscape.id ? updatedSoundscape : s));
        toast.success('Soundscape updated successfully');
      } else {
        // Create new soundscape
        updatedSoundscape = await createJourneySoundscape(soundscapeData);
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

  const processBulkUpload = async () => {
    try {
      // Simple parsing of TSV or CSV format
      // Expected format: journey_id, title, description, file_url
      const lines = bulkUploadText.trim().split('\n');
      
      if (lines.length === 0) {
        toast.error('No data to import');
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const line of lines) {
        const parts = line.split('\t');
        if (parts.length < 3) {
          // Try comma-separated if tab-separated didn't work
          const commaParts = line.split(',');
          if (commaParts.length < 3) {
            errorCount++;
            continue;
          }
          parts.length = 0;
          parts.push(...commaParts);
        }
        
        // Get journey ID by matching title/filename if needed
        let journeyId = parseInt(parts[0], 10);
        if (isNaN(journeyId)) {
          // Try to find journey by title or filename
          const journeyMatch = journeys.find(j => j.title === parts[0] || j.filename === parts[0]);
          if (journeyMatch) {
            journeyId = parseInt(String(journeyMatch.id), 10);
          } else {
            errorCount++;
            continue;
          }
        }
        
        const soundscapeData = {
          journey_id: journeyId,
          title: parts[1].trim(),
          description: parts[2]?.trim() || null,
          file_url: parts[3]?.trim() || '',
          source_type: 'file' as const
        };
        
        if (!soundscapeData.title || !soundscapeData.file_url) {
          errorCount++;
          continue;
        }
        
        try {
          // Create soundscape
          await createJourneySoundscape(soundscapeData);
          successCount++;
        } catch (error) {
          console.error('Error creating soundscape:', error);
          errorCount++;
        }
      }
      
      toast.success(`Imported ${successCount} soundscapes successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      
      if (successCount > 0) {
        // Reload data to show new soundscapes
        loadData();
      }
      
      setBulkUploadDialogOpen(false);
      setBulkUploadText('');
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      toast.error('Failed to process bulk upload');
    }
  };

  // Get all soundscapes based on filter
  const filteredSoundscapes = selectedJourney
    ? soundscapes.filter(s => String(s.journey_id) === String(selectedJourney))
    : soundscapes;
    
  // Always include test soundscape if no other soundscapes exist
  const displaySoundscapes = filteredSoundscapes.length === 0 && testSoundscape ? [testSoundscape] : filteredSoundscapes;
    
  const noSoundscapesMessage = loading 
    ? "Loading soundscapes..." 
    : isDataLoaded 
      ? "No soundscapes found for the selected journey. Click 'Add Soundscape' to create one." 
      : "No soundscapes data available. Try refreshing the page.";

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
          <div className="flex space-x-2">
            <Button onClick={() => setBulkUploadDialogOpen(true)} variant="outline">
              <FileMusic className="mr-2 h-4 w-4" /> Bulk Import
            </Button>
            <Button onClick={handleOpenNewDialog} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add Soundscape
            </Button>
          </div>
        </div>
        
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
                    `Connected to Supabase bucket "${STORAGE_BUCKET}" with ${storageBucketInfo.files} audio files in the "${STORAGE_FOLDER}" folder.` : 
                    `Supabase bucket "${STORAGE_BUCKET}" not found. Files will still be uploaded but may not be accessible.`}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-700">
                    <FileAudio className="h-3.5 w-3.5 mr-1" />
                    Upload audio directly to Supabase
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-700">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Link to external audio URLs
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedJourney 
                    ? `Soundscapes for "${journeys.find(j => String(j.id) === String(selectedJourney))?.title}"` 
                    : "All Soundscapes"}
                </CardTitle>
                <Button onClick={handleOpenNewDialog} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Soundscape
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full"></div>
                  </div>
                ) : displaySoundscapes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                    {noSoundscapesMessage}
                    <Button 
                      onClick={handleOpenNewDialog} 
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Soundscape
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displaySoundscapes.map(soundscape => (
                      <Card key={soundscape.id} className={`overflow-hidden ${soundscape.id === 'demo-1' ? 'border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
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
                              <h3 className="font-medium">
                                {soundscape.title}
                                {soundscape.id === 'demo-1' && (
                                  <Badge className="ml-2 bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Demo
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {journeys.find(j => String(j.id) === String(soundscape.journey_id))?.title || 'Unknown Journey'}
                              </p>
                              {soundscape.description && <p className="text-sm">{soundscape.description}</p>}
                              {soundscape.file_url && (
                                <p className="text-xs text-gray-500 mt-1 truncate max-w-md">
                                  Source: {soundscape.file_url.includes('supabase') ? 'Supabase Storage' : soundscape.file_url}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePlaySoundscape(soundscape)}
                                disabled={soundscape.id === 'demo-1'}
                              >
                                {isPlaying && currentAudioId === soundscape.id ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-1" /> Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-1" /> Play
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditSoundscape(soundscape)}
                                disabled={soundscape.id === 'demo-1'}
                              >
                                <PencilIcon className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700" 
                                onClick={() => handleDeleteRequest(soundscape.id)}
                                disabled={soundscape.id === 'demo-1'}
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
            <DialogDescription>
              {selectedSoundscape 
                ? 'Update the details of this soundscape' 
                : 'Create a new audio soundscape for a journey'}
            </DialogDescription>
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
              <Label htmlFor="title" className="text-right">Title *</Label>
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
                  <div className="space-y-4">
                    {/* File upload option - Highlighted */}
                    <div className="border-2 border-purple-200 dark:border-purple-800 rounded-md p-4 bg-purple-50 dark:bg-purple-900/20">
                      <Label htmlFor="fileUpload" className="block mb-2 font-bold flex items-center">
                        <Upload className="h-4 w-4 mr-1 text-purple-600" />
                        Upload Audio to Supabase
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="fileUpload"
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="flex-grow"
                        />
                      </div>
                      {fileToUpload && (
                        <div className="mt-2">
                          <p className="text-sm text-green-600">{fileToUpload.name} selected</p>
                        </div>
                      )}
                      {uploadProgress > 0 && (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${Math.round(uploadProgress)}%`}</p>
                        </div>
                      )}
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                        <Info className="h-3 w-3 inline mr-1" />
                        File will be uploaded to Supabase "{STORAGE_BUCKET}/{STORAGE_FOLDER}" bucket
                      </p>
                    </div>
                    
                    {/* OR divider */}
                    <div className="flex items-center">
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                      <span className="px-2 text-sm text-gray-500 dark:text-gray-400">OR</span>
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    
                    {/* URL input */}
                    <div className="space-y-2">
                      <Label htmlFor="file_url">Audio File URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="file_url"
                          name="file_url"
                          value={formData.file_url}
                          onChange={handleInputChange}
                          placeholder="/audio/filename.mp3 or full URL"
                          className={urlValidationState === 'valid' ? 'border-green-500' : 
                                    urlValidationState === 'invalid' ? 'border-red-500' : ''}
                        />
                        {urlValidationState === 'checking' && (
                          <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter the path to an audio file in the public folder or full URL
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="youtube" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="source_link">YouTube URL *</Label>
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
              className="bg-purple-600 hover:bg-purple-700"
              disabled={uploadingFile}
            >
              {uploadingFile ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                  Uploading...
                </>
              ) : selectedSoundscape ? (
                'Update Soundscape'
              ) : (
                'Create Soundscape'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadDialogOpen} onOpenChange={setBulkUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Soundscapes</DialogTitle>
            <DialogDescription>
              Paste data in tab or comma-separated format:
              journey_id/title, soundscape_title, description, file_url
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={bulkUploadText}
              onChange={(e) => setBulkUploadText(e.target.value)}
              placeholder="journey_id,title,description,file_url"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-sm text-gray-500">
              You can use journey ID numbers or journey titles/filenames in the first column
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processBulkUpload} className="bg-purple-600 hover:bg-purple-700">
              Import Soundscapes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default JourneySoundscapeAdmin;
