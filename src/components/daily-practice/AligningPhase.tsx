import React from 'react';
import { Button } from '@/components/ui/button';
import { ChakraTag } from '@/types/chakras';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, ChevronLeft, Save, Loader2 } from 'lucide-react';
import ChakraFilter from '@/components/chakra/ChakraFilter';

// Simple chakra color mapping since getChakraColor doesn't exist
const chakraColors: Record<string, string> = {
  'Root': '#FF0000',
  'Sacral': '#FF7F00',
  'Solar Plexus': '#FFFF00',
  'Heart': '#00FF00',
  'Throat': '#00FFFF',
  'Third Eye': '#0000FF',
  'Crown': '#8B00FF',
  'Transpersonal': '#FFFFFF'
};

// Simple chakra info mapping since getChakraInfo doesn't exist
const chakraInfo: Record<string, { name: string, description: string, element: string, frequency: number }> = {
  'Root': {
    name: 'Root',
    description: 'Grounding and stability',
    element: 'Earth',
    frequency: 396
  },
  'Sacral': {
    name: 'Sacral',
    description: 'Creativity and passion',
    element: 'Water',
    frequency: 417
  },
  'Solar Plexus': {
    name: 'Solar Plexus',
    description: 'Personal power and will',
    element: 'Fire',
    frequency: 528
  },
  'Heart': {
    name: 'Heart',
    description: 'Love and compassion',
    element: 'Air',
    frequency: 639
  },
  'Throat': {
    name: 'Throat',
    description: 'Expression and communication',
    element: 'Sound',
    frequency: 741
  },
  'Third Eye': {
    name: 'Third Eye',
    description: 'Intuition and insight',
    element: 'Light',
    frequency: 852
  },
  'Crown': {
    name: 'Crown',
    description: 'Spiritual connection',
    element: 'Thought',
    frequency: 963
  },
  'Transpersonal': {
    name: 'Transpersonal',
    description: 'Cosmic consciousness',
    element: 'Unity',
    frequency: 1074
  }
};

interface AligningPhaseProps {
  onComplete: () => void;
  onBack: () => void;
  selectedChakras: ChakraTag[];
  setSelectedChakras: (chakras: ChakraTag[]) => void;
  chakraBalances: Record<string, number>;
  setChakraBalances: (balances: Record<string, number>) => void;
  chakraNotes: Record<string, string>;
  setChakraNotes: (notes: Record<string, string>) => void;
  isSaving?: boolean;
  onSave?: () => void;
}

const AligningPhase: React.FC<AligningPhaseProps> = ({
  onComplete,
  onBack,
  selectedChakras,
  setSelectedChakras,
  chakraBalances,
  setChakraBalances,
  chakraNotes,
  setChakraNotes,
  isSaving = false,
  onSave
}) => {
  const [activeTab, setActiveTab] = React.useState<string>(selectedChakras[0] || 'Root');
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleBalanceChange = (chakra: string, value: number[]) => {
    setChakraBalances(prev => ({
      ...prev,
      [chakra]: value[0]
    }));
  };

  const handleNoteChange = (chakra: string, value: string) => {
    setChakraNotes(prev => ({
      ...prev,
      [chakra]: value
    }));
  };

  // Calculate overall balance
  const overallBalance = React.useMemo(() => {
    if (selectedChakras.length === 0) return 0;
    
    const sum = selectedChakras.reduce((acc, chakra) => {
      return acc + (chakraBalances[chakra] || 50);
    }, 0);
    
    return Math.round(sum / selectedChakras.length);
  }, [selectedChakras, chakraBalances]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Chakra Alignment</span>
          <div className="text-sm font-normal flex items-center gap-2">
            <span>Overall Balance:</span>
            <Progress value={overallBalance} className="w-24 h-2" />
            <span>{overallBalance}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Select Chakras to Align</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm">Advanced</span>
              <Switch 
                checked={showAdvanced} 
                onCheckedChange={setShowAdvanced} 
              />
            </div>
          </div>
          
          <ChakraFilter 
            selectedChakras={selectedChakras}
            onChange={setSelectedChakras}
            multiSelect={true}
          />
        </div>
        
        {selectedChakras.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-flow-col auto-cols-fr">
              {selectedChakras.map(chakra => (
                <TabsTrigger 
                  key={chakra} 
                  value={chakra}
                  style={{ color: chakraColors[chakra] || '#888' }}
                >
                  {chakra}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {selectedChakras.map(chakra => (
              <TabsContent key={chakra} value={chakra} className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Current Balance</Label>
                        <span className="text-sm">{chakraBalances[chakra] || 50}%</span>
                      </div>
                      <Slider
                        value={[chakraBalances[chakra] || 50]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleBalanceChange(chakra, value)}
                        className="w-full"
                        style={{
                          // Use a gradient based on the chakra color
                          background: `linear-gradient(to right, ${chakraColors[chakra] || '#888'}22, ${chakraColors[chakra] || '#888'})`
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Notes</Label>
                      <Textarea
                        value={chakraNotes[chakra] || ''}
                        onChange={(e) => handleNoteChange(chakra, e.target.value)}
                        placeholder={`Notes about your ${chakra} chakra...`}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                  
                  {showAdvanced && (
                    <div className="flex-1 space-y-4 border-l pl-6">
                      <div>
                        <Label className="mb-2 block">Element</Label>
                        <Input 
                          value={chakraInfo[chakra]?.element || ''} 
                          readOnly 
                          className="bg-muted"
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Frequency</Label>
                        <Input 
                          value={`${chakraInfo[chakra]?.frequency || ''} Hz`} 
                          readOnly 
                          className="bg-muted"
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Description</Label>
                        <Textarea
                          value={chakraInfo[chakra]?.description || ''}
                          readOnly
                          className="min-h-[80px] bg-muted"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select at least one chakra to begin alignment
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="space-x-2">
            {onSave && (
              <Button 
                variant="outline" 
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Progress
                  </>
                )}
              </Button>
            )}
            
            <Button 
              onClick={onComplete} 
              disabled={selectedChakras.length === 0 || isSaving}
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AligningPhase;
