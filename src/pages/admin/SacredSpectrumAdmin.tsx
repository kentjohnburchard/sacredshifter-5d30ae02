
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import {
  fetchSacredSpectrumResources,
  createSacredSpectrumResource,
  updateSacredSpectrumResource,
  deleteSacredSpectrumResource,
  uploadSacredSpectrumFile,
  SacredSpectrumResource,
  resourceCategories
} from '@/services/sacredSpectrumService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  FileIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  ExternalLinkIcon,
  CheckIcon,
  AlertCircleIcon,
  FileTextIcon
} from 'lucide-react';
import { fetchJourneys, Journey } from '@/services/journeyService';

const SacredSpectrumAdmin: React.FC = () => {
  const [resources, setResources] = useState<SacredSpectrumResource[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SacredSpectrumResource | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const { user } = useAuth();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Partial<SacredSpectrumResource>>();
  
  // Watch fields for conditional rendering
  const externalLink = watch('external_link');
  const fileUrl = watch('file_url');
  
  useEffect(() => {
    loadResources();
    loadJourneys();
  }, []);
  
  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await fetchSacredSpectrumResources();
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
      toast.error('Failed to load sacred knowledge resources');
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
    }
  };
  
  const handleAddResource = () => {
    setSelectedResource(null);
    reset({
      title: '',
      category: '',
      tags: '',
      description: '',
      external_link: '',
      file_url: '',
      journey_slug: '',
      needs_moderation: false,
      is_approved: true
    });
    setSelectedFile(null);
    setDialogOpen(true);
  };
  
  const handleEditResource = (resource: SacredSpectrumResource) => {
    setSelectedResource(resource);
    reset({
      title: resource.title,
      category: resource.category || '',
      tags: resource.tags || '',
      description: resource.description || '',
      external_link: resource.external_link || '',
      file_url: resource.file_url || '',
      journey_slug: resource.journey_slug || '',
      needs_moderation: resource.needs_moderation || false,
      is_approved: resource.is_approved !== null ? resource.is_approved : true
    });
    setDialogOpen(true);
  };
  
  const handleDeleteResource = (resource: SacredSpectrumResource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedResource) {
      try {
        await deleteSacredSpectrumResource(selectedResource.id);
        setResources(prev => prev.filter(r => r.id !== selectedResource.id));
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const onSubmit = async (data: Partial<SacredSpectrumResource>) => {
    try {
      // Handle file upload if file is selected
      if (selectedFile) {
        setFileUploading(true);
        const fileUrl = await uploadSacredSpectrumFile(selectedFile);
        data.file_url = fileUrl;
        setFileUploading(false);
      }
      
      // Set user ID to current user
      if (user) {
        data.user_id = user.id;
      }
      
      if (selectedResource) {
        // Update existing resource
        const updated = await updateSacredSpectrumResource({
          ...data,
          id: selectedResource.id
        } as SacredSpectrumResource);
        
        setResources(prev => 
          prev.map(r => r.id === selectedResource.id ? updated : r)
        );
      } else {
        // Create new resource
        const created = await createSacredSpectrumResource(data as Omit<SacredSpectrumResource, 'id' | 'created_at' | 'updated_at'>);
        setResources(prev => [created, ...prev]);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  return (
    <Layout pageTitle="Sacred Spectrum Admin">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Spectrum Knowledge Archive
          </h1>
          <Button onClick={handleAddResource} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Resource
          </Button>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
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
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No sacred knowledge resources found. Click "Add Resource" to create your first entry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    resources.map(resource => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>
                          {resource.file_url ? (
                            <div className="flex items-center">
                              <FileIcon className="h-4 w-4 mr-1 text-blue-500" />
                              <span>File</span>
                            </div>
                          ) : resource.external_link ? (
                            <div className="flex items-center">
                              <ExternalLinkIcon className="h-4 w-4 mr-1 text-green-500" />
                              <span>Link</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <FileTextIcon className="h-4 w-4 mr-1 text-gray-500" />
                              <span>Text</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {resource.is_approved ? (
                            <div className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                              <span>Approved</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertCircleIcon className="h-4 w-4 mr-1 text-amber-500" />
                              <span>Needs Review</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(resource.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditResource(resource)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteResource(resource)}
                            >
                              <TrashIcon className="h-4 w-4" />
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
        </div>
        
        {/* Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedResource ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
              <DialogDescription>
                Add sacred knowledge to the spectrum archive
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Resource title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={watch('category') || ''} 
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Comma-separated tags"
                    {...register('tags')}
                  />
                  <p className="text-xs text-gray-500">
                    Separate multiple tags with commas (e.g., vibration, healing, frequency)
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this resource"
                    rows={3}
                    {...register('description')}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="journey_slug">Related Journey (Optional)</Label>
                  <Select 
                    value={watch('journey_slug') || ''} 
                    onValueChange={(value) => setValue('journey_slug', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Link to a journey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {journeys.map(journey => (
                        <SelectItem key={journey.id} value={journey.filename}>
                          {journey.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Resource Type</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="typeFile"
                        name="resourceType"
                        checked={!externalLink}
                        onChange={() => setValue('external_link', '')}
                        className="rounded text-purple-600"
                      />
                      <Label htmlFor="typeFile" className="cursor-pointer">File/Text</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="typeLink"
                        name="resourceType"
                        checked={!!externalLink}
                        onChange={() => setValue('file_url', '')}
                        className="rounded text-purple-600"
                      />
                      <Label htmlFor="typeLink" className="cursor-pointer">External Link</Label>
                    </div>
                  </div>
                </div>
                
                {!externalLink && (
                  <div className="grid gap-2">
                    <Label htmlFor="file">Upload File (PDF, DOC, TXT)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        disabled={fileUploading}
                        className="flex-1"
                      />
                      {fileUploading && (
                        <div className="animate-spin h-5 w-5 border-b-2 border-purple-600 rounded-full"></div>
                      )}
                    </div>
                    {fileUrl && !selectedFile && (
                      <div className="text-sm text-blue-600">
                        <a href={fileUrl} target="_blank" rel="noreferrer" className="flex items-center">
                          <FileIcon className="h-4 w-4 mr-1" />
                          Current file
                        </a>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Allowed formats: PDF, DOC, DOCX, TXT
                    </p>
                  </div>
                )}
                
                {externalLink !== undefined && externalLink !== null && (
                  <div className="grid gap-2">
                    <Label htmlFor="external_link">External Link URL</Label>
                    <Input
                      id="external_link"
                      placeholder="https://..."
                      {...register('external_link')}
                    />
                  </div>
                )}
                
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_approved"
                      {...register('is_approved')}
                      defaultChecked={true}
                      className="rounded text-purple-600"
                    />
                    <Label htmlFor="is_approved" className="cursor-pointer">Approved for public viewing</Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Uncheck if this resource needs review before being shown publicly
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                  disabled={fileUploading}
                >
                  {fileUploading ? 'Uploading...' : selectedResource ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.
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
    </Layout>
  );
};

export default SacredSpectrumAdmin;
