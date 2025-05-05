
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
import { PlusCircle, Loader2, Save, X, AlertCircle, FileText, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllJourneys } from '@/utils/coreJourneyLoader';
import { Badge } from '@/components/ui/badge';

const JourneysManager: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
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
        // First load journeys from the database
        const dbJourneys = await fetchJourneys();
        
        // Then combine with journeys from core_content
        const allJourneys = await getAllJourneys(dbJourneys);
        
        console.log(`Loaded ${allJourneys.length} total journeys (${dbJourneys.length} from DB, ${allJourneys.length - dbJourneys.length} from core_content)`);
        setJourneys(allJourneys);
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
    // Capture whether this is a core content journey (has high ID)
    const isCoreJourney = journey.id >= 1000; // We assigned high IDs to core content journeys
    
    setEditingJourney({ 
      ...journey,
      // Set a flag to indicate this is from core_content if it has a high ID
      isCoreContent: isCoreJourney
    } as Journey);
    
    setIsDialogOpen(true);
    
    // Show a toast for core content journeys
    if (isCoreJourney) {
      toast.info('This is a core content journey. You can import it to the database to make it editable.');
    }
  };

  const handleViewJourney = (slug: string) => {
    // Navigate to the journey view page
    navigate(`/journey/${slug}`);
  };

  const handleCreateNew = () => {
    setEditingJourney({
      id: 0, // Use 0 to indicate a new journey
      filename: '',
      title: '',
      tags: '',
      veil_locked: false,
      visual_effects: '',
      strobe_patterns: '',
      assigned_songs: '',
      intent: '',
      sound_frequencies: '',
      script: '',
      duration: '',
      notes: '',
      env_lighting: '',
      env_temperature: '',
      env_incense: '',
      env_posture: '',
      env_tools: '',
      recommended_users: ''
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
    if (!editingJourney.filename?.trim() || !editingJourney.title?.trim()) {
      toast.error('Filename and title are required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let updatedJourney;
      
      if (editingJourney.id === 0) {
        // Create new journey
        console.log("Creating new journey:", editingJourney);
        const { id, ...newJourney } = editingJourney;
        updatedJourney = await createJourney(newJourney);
        toast.success('Journey created successfully');
        
        // Add to list
        setJourneys(prev => [...prev, updatedJourney]);
      } else {
        // Update existing journey
        console.log("Updating journey:", editingJourney);
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

  // Add this function for importing a core content journey to the database
  const handleImportToDatabase = async () => {
    if (!editingJourney) return;
    
    setIsSaving(true);
    
    try {
      // Create a copy of the journey without the id (will be assigned by the DB)
      const { id, ...journeyData } = editingJourney;
      
      // Create as a new journey in the database
      const newJourney = await createJourney(journeyData);
      toast.success('Journey imported to database successfully');
      
      // Replace the core journey with the DB version in the list
      setJourneys(prev => prev.map(j => 
        j.filename === newJourney.filename ? newJourney : j
      ));
      
      setIsDialogOpen(false);
      setEditingJourney(null);
    } catch (error) {
      console.error('Error importing journey:', error);
      toast.error('Failed to import journey to database');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout pageTitle="Journey Manager">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sacred Journey Manager</h1>
          <Button onClick={handleCreateNew} className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Journey
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Veil Locked</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No journeys found. Create your first journey to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  journeys.map((journey) => {
                    // Determine if this is a core content journey (has high ID)
                    const isCoreJourney = journey.id >= 1000;
                    
                    return (
                      <TableRow key={journey.id}>
                        <TableCell className="font-medium">{journey.title}</TableCell>
                        <TableCell>{journey.filename}</TableCell>
                        <TableCell>
                          {isCoreJourney ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <FileText className="h-3 w-3 mr-1" /> Core Content
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">Database</Badge>
                          )}
                        </TableCell>
                        <TableCell>{journey.tags || '-'}</TableCell>
                        <TableCell>{journey.veil_locked ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="default" onClick={() => handleEditJourney(journey)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleViewJourney(journey.filename)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJourney?.id === 0 
                  ? 'Create New Journey' 
                  : editingJourney?.id && editingJourney.id >= 1000 
                    ? `View Core Content Journey: ${editingJourney.title}` 
                    : `Edit Journey: ${editingJourney?.title}`
                }
              </DialogTitle>
              
              {editingJourney?.id && editingJourney.id >= 1000 && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-700">This is a core content journey</span>
                  </div>
                  <p className="text-blue-600 pl-6">
                    Core content journeys are read-only. You can import this journey to the database to make it editable.
                  </p>
                </div>
              )}
            </DialogHeader>
            
            {editingJourney && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={editingJourney.title || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="filename" className="text-right">Filename</Label>
                    <Input
                      id="filename"
                      name="filename"
                      value={editingJourney.filename || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="e.g. heart-opening-journey"
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
                        checked={editingJourney.veil_locked || false}
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
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={editingJourney.duration || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="e.g. 20 minutes"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recommended_users" className="text-right">Recommended Users</Label>
                    <Input
                      id="recommended_users"
                      name="recommended_users"
                      value={editingJourney.recommended_users || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="e.g. Beginners, Advanced practitioners"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="intent" className="text-right pt-2">Intent</Label>
                    <Textarea
                      id="intent"
                      name="intent"
                      value={editingJourney.intent || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Purpose and intention of this journey"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="sound_frequencies" className="text-right pt-2">Recommended Sound Frequencies</Label>
                    <Textarea
                      id="sound_frequencies"
                      name="sound_frequencies"
                      value={editingJourney.sound_frequencies || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="e.g. 528Hz (Love), 432Hz (Natural)"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="script" className="text-right pt-2">Script</Label>
                    <Textarea
                      id="script"
                      name="script"
                      value={editingJourney.script || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="The guided journey script"
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={editingJourney.notes || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Additional notes or guidance"
                      rows={3}
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
                </TabsContent>
                
                <TabsContent value="environment" className="space-y-4">
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="env_lighting" className="text-right pt-2">Lighting</Label>
                    <Textarea
                      id="env_lighting"
                      name="env_lighting"
                      value={editingJourney.env_lighting || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Recommended lighting conditions"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="env_temperature" className="text-right pt-2">Temperature</Label>
                    <Textarea
                      id="env_temperature"
                      name="env_temperature"
                      value={editingJourney.env_temperature || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Recommended temperature setting"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="env_incense" className="text-right pt-2">Incense</Label>
                    <Textarea
                      id="env_incense"
                      name="env_incense"
                      value={editingJourney.env_incense || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Recommended incense or aromatics"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="env_posture" className="text-right pt-2">Posture</Label>
                    <Textarea
                      id="env_posture"
                      name="env_posture"
                      value={editingJourney.env_posture || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Recommended physical posture"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="env_tools" className="text-right pt-2">Optional Tools</Label>
                    <Textarea
                      id="env_tools"
                      name="env_tools"
                      value={editingJourney.env_tools || ''}
                      onChange={handleInputChange}
                      className="col-span-3"
                      placeholder="Optional items that enhance the journey"
                      rows={2}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              
              {editingJourney?.id && editingJourney.id >= 1000 ? (
                <Button onClick={handleImportToDatabase} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Import to Database
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleSaveJourney} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Journey
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default JourneysManager;
