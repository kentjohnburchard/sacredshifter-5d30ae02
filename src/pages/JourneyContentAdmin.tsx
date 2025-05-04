
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import useSpiralParams, { SpiralParams, addJourneyParams, getAllJourneyParams } from '@/hooks/useSpiralParams';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { useNavigate } from 'react-router-dom';
import { createJourney, updateJourney, fetchJourneys } from '@/services/journeyService';

const JourneyContentAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [journeys, setJourneys] = useState<any[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState({
    title: '',
    tags: '',
    veilLocked: false,
    content: '',
    filename: ''
  });
  const [params, setParams] = useState<SpiralParams>({
    coeffA: 4,
    coeffB: 4,
    coeffC: 1.3,
    freqA: 44,
    freqB: -17,
    freqC: -54,
    color: '255,255,0',
    opacity: 100,
    strokeWeight: 0.5,
    maxCycles: 5,
    speed: 0.001
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const data = await fetchJourneys();
      setJourneys(data);
    } catch (error) {
      console.error('Error loading journeys:', error);
      toast.error('Failed to load journeys');
    }
  };

  const handleParamChange = (param: keyof SpiralParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [param]: typeof prev[param] === 'number' ? parseFloat(value) : value
    }));
  };

  const handleContentChange = (field: string, value: any) => {
    setContentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJourneySelect = (journeyId: string) => {
    const selectedJourney = journeys.find(j => j.id === journeyId || j.filename === journeyId);
    if (selectedJourney) {
      setSelectedJourney(journeyId);
      
      // Load spiral params if they exist
      const allParams = getAllJourneyParams();
      const journeyParams = allParams[journeyId] || allParams[selectedJourney.filename];
      
      if (journeyParams) {
        setParams(journeyParams);
      } else {
        // Reset to default if no params found
        setParams({
          coeffA: 4,
          coeffB: 4,
          coeffC: 1.3,
          freqA: 44,
          freqB: -17,
          freqC: -54,
          color: '255,255,0',
          opacity: 100,
          strokeWeight: 0.5,
          maxCycles: 5,
          speed: 0.001
        });
      }
      
      // Load content form data
      setContentForm({
        title: selectedJourney.title || '',
        tags: selectedJourney.tags || '',
        veilLocked: selectedJourney.veil_locked || false,
        content: selectedJourney.content || '',
        filename: selectedJourney.filename || ''
      });
    }
  };

  const handleSaveParams = () => {
    if (!selectedJourney) {
      toast.error("Please select a journey first");
      return;
    }

    // Save the parameters for this journey
    addJourneyParams(selectedJourney, {...params});
    toast.success(`Spiral parameters saved for "${selectedJourney}" journey`);
  };

  const handleSaveJourney = async () => {
    if (!selectedJourney) {
      toast.error("Please select a journey first");
      return;
    }

    try {
      const journeyData = {
        id: parseInt(selectedJourney),
        title: contentForm.title,
        tags: contentForm.tags,
        veil_locked: contentForm.veilLocked,
        content: contentForm.content,
        filename: contentForm.filename
      };
      
      await updateJourney(journeyData);
      
      // Also save spiral params
      addJourneyParams(selectedJourney, {...params});
      addJourneyParams(contentForm.filename, {...params});
      
      toast.success(`Journey "${contentForm.title}" saved successfully`);
      
      // Refresh journey list
      loadJourneys();
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save journey');
    }
  };

  const handleCreateNewJourney = async () => {
    // Reset forms for new journey
    setSelectedJourney(null);
    setContentForm({
      title: 'New Journey',
      tags: '',
      veilLocked: false,
      content: '# New Journey\n\nAdd your journey content here.',
      filename: 'new-journey'
    });
    setParams({
      coeffA: 4,
      coeffB: 4,
      coeffC: 1.3,
      freqA: 44,
      freqB: -17,
      freqC: -54,
      color: '255,255,0',
      opacity: 100,
      strokeWeight: 0.5,
      maxCycles: 5,
      speed: 0.001
    });
    
    setActiveTab('content');
  };

  const handleSaveNewJourney = async () => {
    try {
      const journeyData = {
        title: contentForm.title,
        tags: contentForm.tags,
        veil_locked: contentForm.veilLocked,
        filename: contentForm.filename || contentForm.title.toLowerCase().replace(/\s+/g, '-')
      };
      
      const newJourney = await createJourney(journeyData);
      
      // Save spiral params for the new journey
      if (newJourney && newJourney.id) {
        addJourneyParams(newJourney.id.toString(), {...params});
        addJourneyParams(newJourney.filename, {...params});
        
        toast.success(`New journey "${contentForm.title}" created successfully`);
        
        // Refresh journey list and select the new journey
        await loadJourneys();
        setSelectedJourney(newJourney.id.toString());
      }
    } catch (error) {
      console.error('Error creating journey:', error);
      toast.error('Failed to create new journey');
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <PageLayout title="Journey Content Admin">
      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Journey Content & Spiral Admin</h1>
          <div className="space-x-2">
            <Button onClick={handleCreateNewJourney} variant="outline">New Journey</Button>
            <Button onClick={() => navigate('/journey-templates')}>Back to Journeys</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Journey List</CardTitle>
              </CardHeader>
              <CardContent>
                {journeys.length > 0 ? (
                  <div className="space-y-2 h-[400px] overflow-y-auto">
                    {journeys.map(journey => (
                      <div 
                        key={journey.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedJourney === journey.id.toString() 
                            ? 'bg-purple-100 dark:bg-purple-900' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleJourneySelect(journey.id.toString())}
                      >
                        {journey.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No journeys found</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedJourney 
                    ? `Edit Journey: "${contentForm.title}"` 
                    : "Create New Journey"}
                </CardTitle>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                    <TabsTrigger value="spiral" className="flex-1">Spiral Parameters</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="content" className="p-0">
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input 
                        value={contentForm.title} 
                        onChange={(e) => handleContentChange('title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Filename/Slug</label>
                      <Input 
                        value={contentForm.filename} 
                        onChange={(e) => handleContentChange('filename', e.target.value)}
                        placeholder="e.g. heart-opening-journey"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Used in URLs, lowercase with hyphens
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                      <Input 
                        value={contentForm.tags} 
                        onChange={(e) => handleContentChange('tags', e.target.value)}
                        placeholder="meditation, healing, energy, etc."
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="veilLocked" 
                        checked={contentForm.veilLocked}
                        onChange={(e) => handleContentChange('veilLocked', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="veilLocked">Require Authentication (Veil Locked)</label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Content (Markdown Supported)
                      </label>
                      <Textarea 
                        value={contentForm.content} 
                        onChange={(e) => handleContentChange('content', e.target.value)}
                        rows={12}
                        className="font-mono"
                        placeholder="# Journey Title&#10;&#10;## Intent&#10;- Add your intent here&#10;&#10;## Script&#10;> Your guided journey script here"
                      />
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="spiral" className="p-0">
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient A</label>
                        <Input 
                          type="number" 
                          value={params.coeffA} 
                          onChange={e => handleParamChange('coeffA', e.target.value)}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency A</label>
                        <Input 
                          type="number" 
                          value={params.freqA} 
                          onChange={e => handleParamChange('freqA', e.target.value)}
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient B</label>
                        <Input 
                          type="number" 
                          value={params.coeffB} 
                          onChange={e => handleParamChange('coeffB', e.target.value)}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency B</label>
                        <Input 
                          type="number" 
                          value={params.freqB} 
                          onChange={e => handleParamChange('freqB', e.target.value)}
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient C</label>
                        <Input 
                          type="number" 
                          value={params.coeffC} 
                          onChange={e => handleParamChange('coeffC', e.target.value)}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency C</label>
                        <Input 
                          type="number" 
                          value={params.freqC} 
                          onChange={e => handleParamChange('freqC', e.target.value)}
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Color (R,G,B)</label>
                        <Input 
                          value={params.color} 
                          onChange={e => handleParamChange('color', e.target.value)}
                          placeholder="255,255,0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Opacity (0-100)</label>
                        <Input 
                          type="number" 
                          value={params.opacity} 
                          onChange={e => handleParamChange('opacity', e.target.value)}
                          min="1"
                          max="100"
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Stroke Weight</label>
                        <Input 
                          type="number" 
                          value={params.strokeWeight} 
                          onChange={e => handleParamChange('strokeWeight', e.target.value)}
                          step="0.1"
                          min="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Cycles</label>
                        <Input 
                          type="number" 
                          value={params.maxCycles} 
                          onChange={e => handleParamChange('maxCycles', e.target.value)}
                          step="1"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Animation Speed</label>
                        <Input 
                          type="number" 
                          value={params.speed} 
                          onChange={e => handleParamChange('speed', e.target.value)}
                          step="0.0001"
                          min="0.0001"
                        />
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
              
              <CardFooter className="flex justify-between">
                <Button onClick={togglePreview} variant="outline">
                  {showPreview ? "Hide Preview" : "Show Spiral Preview"}
                </Button>
                
                <div className="space-x-2">
                  {selectedJourney ? (
                    <Button onClick={handleSaveJourney}>Save Journey</Button>
                  ) : (
                    <Button onClick={handleSaveNewJourney}>Create Journey</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {showPreview && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Spiral Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] relative bg-black rounded-md">
                <SpiralVisualizer params={params} containerId="previewSpiral" className="!absolute !inset-0 !rounded-md"/>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default JourneyContentAdmin;
