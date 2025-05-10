import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape } from '@/services/soundscapeService';
import { useToast } from '@/components/ui/use-toast';
import { Journey } from '@/types/journey';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Music, 
  PlusCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Download, 
  Play, 
  Pause,
  Link,
  Info
} from 'lucide-react';
import { uploadSoundscapeFile, deleteSoundscapeFile } from '@/services/soundscapeService';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

// Define the Soundscape interface
interface Soundscape {
  id: string;
  journey_id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  source_link: string | null;
  source_type: 'file' | 'youtube';
  created_at: string;
}

const SoundscapeManagerV2 = () => {
  const { toast } = useToast();
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState<Soundscape | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    journey_id: '',
    file_url: ''
  });
  const [playingSoundscape, setPlayingSoundscape] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Load soundscapes and journeys on component mount
  useEffect(() => {
    loadSoundscapes();
    loadJourneys();
  }, []);

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  const loadSoundscapes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journey_soundscapes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded soundscapes:', data);
      setSoundscapes(data || []);
    } catch (error) {
      console.error('Error loading soundscapes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load soundscapes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadJourneys = async () => {
    try {
      const { data, error } = await supabase
        .from('journeys')
        .select('id, title, filename')
        .order('title');

      if (error) throw error;
      
      // Transform the data to ensure it has the required tags property
      const journeysWithTags = (data || []).map(journey => ({
        ...journey,
        tags: [] // Add the required tags property
      })) as Journey[];
      
      setJourneys(journeysWithTags);
    } catch (error) {
      console.error('Error loading journeys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load journeys',
        variant: 'destructive'
      });
    }
  };

  const handleCreateSoundscape = () => {
    setFormData({
      title: '',
      description: '',
      journey_id: '',
      file_url: ''
    });
    setFileUpload(null);
    setUploadProgress(0);
    setIsAddDialogOpen(true);
  };

  const handleEditSoundscape = (soundscape: Soundscape) => {
    setSelectedSoundscape(soundscape);
    setFormData({
      title: soundscape.title,
      description: soundscape.description || '',
      journey_id: soundscape.journey_id.toString(),
      file_url: soundscape.file_url || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteSoundscape = (soundscape: Soundscape) => {
    setSelectedSoundscape(soundscape);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setFileUpload(file);
        // Auto-set title from filename if empty
        if (!formData.title) {
          setFormData(prev => ({ 
            ...prev, 
            title: file.name.replace(/\.[^/.]+$/, "") 
          }));
        }
      } else {
        toast({
          title: 'Invalid file',
          description: 'Please select an audio file',
          variant: 'destructive'
        });
        e.target.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const confirmDelete = async () => {
    if (!selectedSoundscape) return;

    try {
      // Delete the file from storage if it exists
      if (selectedSoundscape.file_url) {
        await deleteSoundscapeFile(selectedSoundscape.file_url);
      }

      // Delete from database
      const { error } = await supabase
        .from('journey_soundscapes')
        .delete()
        .eq('id', selectedSoundscape.id);

      if (error) throw error;

      // Update local state
      setSoundscapes(prev => prev.filter(s => s.id !== selectedSoundscape.id));
      
      toast({
        title: 'Success',
        description: 'Soundscape deleted successfully',
      });

      // Close dialog
      setIsDeleteDialogOpen(false);
      setSelectedSoundscape(null);
    } catch (error) {
      console.error('Error deleting soundscape:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete soundscape',
        variant: 'destructive'
      });
    }
  };

  const handleSubmitCreate = async () => {
    // Validate form
    if (!formData.title) {
      toast({
        title: 'Missing information',
        description: 'Please enter a title',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.journey_id) {
      toast({
        title: 'Missing information',
        description: 'Please select a journey',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Handle file upload if provided
      let fileUrl = formData.file_url;
      if (fileUpload) {
        const uploadResult = await uploadSoundscapeFile(fileUpload, progress => {
          setUploadProgress(progress);
        });
        fileUrl = uploadResult.url;
      }

      // Create record in database
      const { data, error } = await supabase
        .from('journey_soundscapes')
        .insert({
          title: formData.title,
          description: formData.description || null,
          journey_id: parseInt(formData.journey_id),
          file_url: fileUrl,
          source_type: 'file'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSoundscapes(prev => [data, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Soundscape created successfully',
      });

      // Close dialog
      setIsAddDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        journey_id: '',
        file_url: ''
      });
      setFileUpload(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error creating soundscape:', error);
      toast({
        title: 'Error',
        description: 'Failed to create soundscape',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedSoundscape) return;

    // Validate form
    if (!formData.title) {
      toast({
        title: 'Missing information',
        description: 'Please enter a title',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.journey_id) {
      toast({
        title: 'Missing information',
        description: 'Please select a journey',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Handle file upload if provided
      let fileUrl = formData.file_url;
      if (fileUpload) {
        // Delete old file if it exists and is different
        if (selectedSoundscape.file_url && selectedSoundscape.file_url !== formData.file_url) {
          await deleteSoundscapeFile(selectedSoundscape.file_url);
        }

        const uploadResult = await uploadSoundscapeFile(fileUpload, progress => {
          setUploadProgress(progress);
        });
        fileUrl = uploadResult.url;
      }

      // Update record in database
      const { data, error } = await supabase
        .from('journey_soundscapes')
        .update({
          title: formData.title,
          description: formData.description || null,
          journey_id: parseInt(formData.journey_id), // Convert string to number
          file_url: fileUrl
        })
        .eq('id', selectedSoundscape.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSoundscapes(prev => prev.map(s => s.id === data.id ? data : s));
      
      toast({
        title: 'Success',
        description: 'Soundscape updated successfully',
      });

      // Close dialog
      setIsEditDialogOpen(false);
      setSelectedSoundscape(null);
      setFormData({
        title: '',
        description: '',
        journey_id: '',
        file_url: ''
      });
      setFileUpload(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error updating soundscape:', error);
      toast({
        title: 'Error',
        description: 'Failed to update soundscape',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayPreview = (soundscape: Soundscape) => {
    // If no file URL, don't play
    if (!soundscape.file_url) {
      toast({
        title: 'Cannot play',
        description: 'This soundscape has no audio file',
        variant: 'destructive'
      });
      return;
    }

    // If already playing this soundscape, stop it
    if (playingSoundscape === soundscape.id && audioElement) {
      audioElement.pause();
      setPlayingSoundscape(null);
      return;
    }

    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause();
    }

    // Create new audio element
    const audio = new Audio(soundscape.file_url);
    audio.onended = () => setPlayingSoundscape(null);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: 'Playback error',
        description: 'Failed to play audio file',
        variant: 'destructive'
      });
      setPlayingSoundscape(null);
    });

    setAudioElement(audio);
    setPlayingSoundscape(soundscape.id);
  };

  // Fix the type comparison in the SELECT element by converting journey.id to string before comparison
  // Get journey title by ID
  const getJourneyTitle = (journeyId: number): string => {
    const journey = journeys.find(j => j.id === journeyId);
    return journey ? journey.title : 'Unknown Journey';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journey Soundscapes</h2>
        <Button onClick={handleCreateSoundscape}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Soundscape
        </Button>
      </div>

      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Supabase Storage Integration</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Files are stored in the <code>soundscapes</code> bucket in Supabase Storage.
                This interface provides full CRUD operations for soundscapes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soundscapes List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : soundscapes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">No Soundscapes Yet</h3>
            <p className="text-gray-500 mb-4">Add your first soundscape to get started.</p>
            <Button onClick={handleCreateSoundscape}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Soundscape
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Soundscapes ({soundscapes.length})</CardTitle>
            <CardDescription>
              Manage audio content for your journeys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Journey</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soundscapes.map(soundscape => (
                  <TableRow key={soundscape.id}>
                    <TableCell className="font-medium">{soundscape.title}</TableCell>
                    <TableCell>{getJourneyTitle(soundscape.journey_id)}</TableCell>
                    <TableCell>
                      {soundscape.file_url ? (
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            File
                          </Badge>
                          <span className="text-xs truncate max-w-[150px]">
                            {soundscape.file_url.split('/').pop()}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          No File
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {soundscape.file_url ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayPreview(soundscape)}
                        >
                          {playingSoundscape === soundscape.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditSoundscape(soundscape)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {soundscape.file_url && (
                            <DropdownMenuItem asChild>
                              <a href={soundscape.file_url} target="_blank" rel="noreferrer">
                                <Link className="mr-2 h-4 w-4" /> Open File
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteSoundscape(soundscape)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Soundscape Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Soundscape</DialogTitle>
            <DialogDescription>
              Upload an audio file or provide a URL for a journey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter soundscape title"
              />
            </div>

            <div>
              <label htmlFor="journey_id" className="text-sm font-medium">
                Journey
              </label>
              <select
                id="journey_id"
                name="journey_id"
                value={formData.journey_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                {journeys.map(journey => (
                  <option key={journey.id} value={journey.id.toString()}>
                    {journey.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter soundscape description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Audio File
              </label>
              <Input
                id="file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
              />
              {fileUpload && (
                <p className="text-sm text-green-600">
                  Selected: {fileUpload.name}
                </p>
              )}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {uploadProgress < 100
                      ? `Uploading: ${uploadProgress}%`
                      : 'Upload complete'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="file_url" className="text-sm font-medium">
                OR File URL (Optional)
              </label>
              <Input
                id="file_url"
                name="file_url"
                value={formData.file_url}
                onChange={handleInputChange}
                placeholder="https://example.com/audio.mp3"
                disabled={!!fileUpload}
              />
              <p className="text-xs text-gray-500">
                Enter a URL if you're not uploading a file
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCreate}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current rounded-full"></div>
                  Uploading...
                </>
              ) : (
                'Create Soundscape'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Soundscape Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Soundscape</DialogTitle>
            <DialogDescription>
              Update soundscape details or audio file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="edit-journey_id" className="text-sm font-medium">
                Journey
              </label>
              <select
                id="edit-journey_id"
                name="journey_id"
                value={formData.journey_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                {journeys.map(journey => (
                  <option key={journey.id} value={journey.id.toString()}>
                    {journey.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="edit-file" className="text-sm font-medium">
                  Replace Audio File
                </label>
                {selectedSoundscape?.file_url && (
                  <a
                    href={selectedSoundscape.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Current File
                  </a>
                )}
              </div>
              <Input
                id="edit-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
              />
              {fileUpload && (
                <p className="text-sm text-green-600">
                  Selected: {fileUpload.name}
                </p>
              )}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {uploadProgress < 100
                      ? `Uploading: ${uploadProgress}%`
                      : 'Upload complete'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current rounded-full"></div>
                  Saving...
                </>
              ) : (
                'Update Soundscape'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the soundscape "{selectedSoundscape?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SoundscapeManagerV2;
