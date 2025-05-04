
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchJourneys, updateJourney, Journey, createJourney } from '@/services/journeyService';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Loader2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JourneysManager: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin access
  useEffect(() => {
    // In a real application, you would check for admin role
    // For now we'll just check if the user is authenticated
    if (!user) {
      toast.error('You must be logged in to access this page');
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        const data = await fetchJourneys();
        setJourneys(data);
      } catch (error) {
        console.error('Failed to load journeys:', error);
        toast.error('Failed to load journeys');
      } finally {
        setLoading(false);
      }
    };

    loadJourneys();
  }, []);

  const handleEditJourney = (journey: Journey) => {
    setEditingJourney({ ...journey });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingJourney({
      id: 0,
      filename: '',
      title: '',
      tags: '',
      veil_locked: false,
      visual_effects: '',
      strobe_patterns: '',
      assigned_songs: ''
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingJourney) {
      setEditingJourney({
        ...editingJourney,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    if (editingJourney) {
      setEditingJourney({
        ...editingJourney,
        veil_locked: checked
      });
    }
  };

  const handleSaveJourney = async () => {
    if (!editingJourney) return;
    
    // Validate inputs
    if (!editingJourney.filename.trim() || !editingJourney.title.trim()) {
      toast.error('Filename and title are required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let updatedJourney;
      
      if (editingJourney.id === 0) {
        // Create new journey
        const { id, ...newJourney } = editingJourney;
        updatedJourney = await createJourney(newJourney);
        toast.success('Journey created successfully');
        
        // Add to list
        setJourneys(prev => [...prev, updatedJourney]);
      } else {
        // Update existing journey
        updatedJourney = await updateJourney(editingJourney);
        toast.success('Journey updated successfully');
        
        // Update in list
        setJourneys(prev => prev.map(journey => 
          journey.id === updatedJourney.id ? updatedJourney : journey
        ));
      }
      
      setIsDialogOpen(false);
      setEditingJourney(null);
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save journey');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout pageTitle="Journey Manager">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sacred Journey Manager</h1>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Journey
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Veil Locked</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No journeys found. Create your first journey to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  journeys.map((journey) => (
                    <TableRow key={journey.id}>
                      <TableCell className="font-medium">{journey.title}</TableCell>
                      <TableCell>{journey.filename}</TableCell>
                      <TableCell>{journey.tags || '-'}</TableCell>
                      <TableCell>{journey.veil_locked ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleEditJourney(journey)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingJourney?.id === 0 ? 'Create New Journey' : 'Edit Journey'}
              </DialogTitle>
            </DialogHeader>
            
            {editingJourney && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editingJourney.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filename" className="text-right">Filename</Label>
                  <Input
                    id="filename"
                    name="filename"
                    value={editingJourney.filename}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="journey_filename_slug"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={editingJourney.tags || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="veil_locked" className="text-right">Veil Locked</Label>
                  <div className="flex items-center col-span-3">
                    <Switch 
                      id="veil_locked"
                      checked={editingJourney.veil_locked}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {editingJourney.veil_locked ? 'Requires authentication' : 'Publicly accessible'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assigned_songs" className="text-right">Audio URL</Label>
                  <Input
                    id="assigned_songs"
                    name="assigned_songs"
                    value={editingJourney.assigned_songs || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="visual_effects" className="text-right pt-2">Visual Effects</Label>
                  <Textarea
                    id="visual_effects"
                    name="visual_effects"
                    value={editingJourney.visual_effects || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder='{"type": "waves", "color": "#8A2BE2"}'
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="strobe_patterns" className="text-right pt-2">Strobe Patterns</Label>
                  <Textarea
                    id="strobe_patterns"
                    name="strobe_patterns"
                    value={editingJourney.strobe_patterns || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder='{"frequency": 2, "colors": ["#ff0000", "#0000ff"]}'
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveJourney} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default JourneysManager;
