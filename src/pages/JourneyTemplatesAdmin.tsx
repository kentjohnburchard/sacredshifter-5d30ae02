
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSpiralParams, { SpiralParams, paramsCache } from '@/hooks/useSpiralParams';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const JourneyTemplatesAdmin: React.FC = () => {
  const { templates, loading } = useJourneyTemplates();
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [params, setParams] = useState<SpiralParams>({
    coeffA: 4,
    coeffB: 4,
    coeffC: 1.3,
    freqA: 44,
    freqB: -17,
    freqC: -54,
  });

  const handleParamChange = (param: keyof SpiralParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleSaveParams = () => {
    if (!selectedJourney) {
      toast.error("Please select a journey first");
      return;
    }

    // Use paramsCache directly since addJourneyParams is gone
    paramsCache[selectedJourney] = {...params};
    toast.success(`Parameters saved for "${selectedJourney}" journey`);
  };

  const handleExportParams = () => {
    // Generate output using paramsCache and useSpiralParams for each template
    const output = templates.reduce((acc, template) => {
      acc[template.id] = useSpiralParams(template.id);
      return acc;
    }, {} as Record<string, SpiralParams>);
    
    console.log(JSON.stringify(output, null, 2));
    toast.success("Parameters exported to console");
  };

  return (
    <PageLayout title="Journey Spiral Parameters">
      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Journey Spiral Parameters</h1>
          <Button onClick={handleExportParams}>Export All Parameters</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Journey</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading templates...</p>
                ) : (
                  <div className="space-y-2 h-[400px] overflow-y-auto">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedJourney === template.id 
                            ? 'bg-purple-100 dark:bg-purple-900' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedJourney(template.id)}
                      >
                        {template.title}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedJourney 
                    ? `Edit Parameters for "${templates.find(t => t.id === selectedJourney)?.title}"` 
                    : "Select a journey to edit parameters"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedJourney ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient A</label>
                        <Input 
                          type="number" 
                          value={params.coeffA} 
                          onChange={e => handleParamChange('coeffA', parseFloat(e.target.value))}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency A</label>
                        <Input 
                          type="number" 
                          value={params.freqA} 
                          onChange={e => handleParamChange('freqA', parseFloat(e.target.value))}
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient B</label>
                        <Input 
                          type="number" 
                          value={params.coeffB} 
                          onChange={e => handleParamChange('coeffB', parseFloat(e.target.value))}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency B</label>
                        <Input 
                          type="number" 
                          value={params.freqB} 
                          onChange={e => handleParamChange('freqB', parseFloat(e.target.value))}
                          step="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Coefficient C</label>
                        <Input 
                          type="number" 
                          value={params.coeffC} 
                          onChange={e => handleParamChange('coeffC', parseFloat(e.target.value))}
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency C</label>
                        <Input 
                          type="number" 
                          value={params.freqC} 
                          onChange={e => handleParamChange('freqC', parseFloat(e.target.value))}
                          step="1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveParams}>Save Parameters</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Select a journey from the list to edit its spiral parameters</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] relative">
              <div className="bg-black h-full w-full rounded">
                <div id="preview" className="w-full h-full"></div>
              </div>
              {/* We would need to implement a preview here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default JourneyTemplatesAdmin;
