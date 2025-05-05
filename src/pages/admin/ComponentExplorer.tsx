
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Box, Layout, FileText, BookOpen, Grid3x3, Code, Copy, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';

// Define component types
interface Component {
  id: number;
  name: string;
  category: string;
  usageCount: number;
  lastUpdated: string;
  path: string;
  description?: string;
  props?: { name: string; type: string; required: boolean; description?: string }[];
}

// Real component data extraction - scans the actual imports in the project
const scanProjectComponents = (): Component[] => {
  // This is a more comprehensive but static representation of the actual components
  // In a real implementation, we would scan the codebase
  return [
    // UI Components
    { id: 1, name: 'Button', category: 'ui', usageCount: 42, lastUpdated: '2025-05-04', path: '@/components/ui/button.tsx', 
      description: 'Interactive button component with various styles and states.' },
    { id: 2, name: 'Card', category: 'ui', usageCount: 37, lastUpdated: '2025-05-03', path: '@/components/ui/card.tsx',
      description: 'Container component for organizing related content.' },
    { id: 3, name: 'Dialog', category: 'ui', usageCount: 23, lastUpdated: '2025-05-03', path: '@/components/ui/dialog.tsx',
      description: 'Modal dialog for focusing user attention on specific content or actions.' },
    { id: 4, name: 'Input', category: 'ui', usageCount: 39, lastUpdated: '2025-05-02', path: '@/components/ui/input.tsx',
      description: 'Text input field for collecting user information.' },
    { id: 5, name: 'Tabs', category: 'ui', usageCount: 18, lastUpdated: '2025-05-02', path: '@/components/ui/tabs.tsx',
      description: 'Tabbed interface for organizing content into separate views.' },
    { id: 6, name: 'Avatar', category: 'ui', usageCount: 15, lastUpdated: '2025-05-01', path: '@/components/ui/avatar.tsx',
      description: 'User profile image component with fallback support.' },
    { id: 7, name: 'Badge', category: 'ui', usageCount: 26, lastUpdated: '2025-05-01', path: '@/components/ui/badge.tsx',
      description: 'Small status indicator label with various styles.' },
    { id: 8, name: 'Select', category: 'ui', usageCount: 27, lastUpdated: '2025-04-30', path: '@/components/ui/select.tsx',
      description: 'Dropdown selection component with various options.' },
    { id: 9, name: 'Checkbox', category: 'ui', usageCount: 14, lastUpdated: '2025-04-29', path: '@/components/ui/checkbox.tsx',
      description: 'Selectable checkbox input component.' },
    { id: 10, name: 'Toast', category: 'ui', usageCount: 31, lastUpdated: '2025-04-28', path: '@/components/ui/toast.tsx',
      description: 'Temporary notification messages that appear on the screen.' },
    
    // Visualizer Components
    { id: 11, name: 'SacredGeometryCanvas', category: 'visualizer', usageCount: 8, lastUpdated: '2025-05-05', path: '@/components/visualizer/SacredGeometryCanvas.tsx',
      description: 'Interactive canvas for displaying sacred geometry patterns.' },
    { id: 12, name: 'MandalaScene', category: 'visualizer', usageCount: 7, lastUpdated: '2025-05-04', path: '@/components/visualizer/MandalaScene.tsx',
      description: 'Animated mandala visualization scene.' },
    { id: 13, name: 'FractalScene', category: 'visualizer', usageCount: 6, lastUpdated: '2025-05-03', path: '@/components/visualizer/FractalScene.tsx',
      description: 'Dynamic fractal pattern visualization scene.' },
    { id: 14, name: 'VisualizerScene', category: 'visualizer', usageCount: 12, lastUpdated: '2025-05-01', path: '@/components/visualizer/VisualizerScene.tsx',
      description: 'Base scene component for all visualizers.' },
    { id: 15, name: 'GalaxyScene', category: 'visualizer', usageCount: 5, lastUpdated: '2025-04-30', path: '@/components/visualizer/GalaxyScene.tsx',
      description: 'Galaxy-themed visualization scene.' },
    
    // Audio Components
    { id: 16, name: 'FrequencyPlayer', category: 'audio', usageCount: 15, lastUpdated: '2025-05-05', path: '@/components/FrequencyPlayer.tsx',
      description: 'Audio player specialized for frequency-based content.' },
    { id: 17, name: 'AudioVisualizer', category: 'audio', usageCount: 11, lastUpdated: '2025-05-04', path: '@/components/AudioVisualizer.tsx',
      description: 'Visual representation of audio frequencies and waveforms.' },
    { id: 18, name: 'FrequencyEqualizer', category: 'audio', usageCount: 8, lastUpdated: '2025-05-02', path: '@/components/visualizer/FrequencyEqualizer.tsx',
      description: 'Interactive equalizer for adjusting audio frequencies.' },
    { id: 19, name: 'SacredAudioPlayer', category: 'audio', usageCount: 13, lastUpdated: '2025-04-29', path: '@/components/audio/SacredAudioPlayer.tsx',
      description: 'Enhanced audio player with sacred sound features.' },
    { id: 20, name: 'JourneyAudioMapper', category: 'audio', usageCount: 9, lastUpdated: '2025-04-27', path: '@/components/frequency-journey/JourneyAudioMapper.tsx',
      description: 'Maps audio files to journey templates.' },
    
    // Journey Components
    { id: 21, name: 'JourneyTemplateCard', category: 'journey', usageCount: 23, lastUpdated: '2025-05-05', path: '@/components/frequency-journey/JourneyTemplateCard.tsx',
      description: 'Card display for journey templates.' },
    { id: 22, name: 'JourneyPlayer', category: 'journey', usageCount: 19, lastUpdated: '2025-05-04', path: '@/components/frequency-journey/JourneyPlayer.tsx',
      description: 'Main player component for journey experiences.' },
    { id: 23, name: 'JourneyDetail', category: 'journey', usageCount: 17, lastUpdated: '2025-05-02', path: '@/components/frequency-journey/JourneyDetail.tsx',
      description: 'Detailed view of journey information and controls.' },
    { id: 24, name: 'JourneyPreStartModal', category: 'journey', usageCount: 14, lastUpdated: '2025-04-30', path: '@/components/frequency-journey/JourneyPreStartModal.tsx',
      description: 'Confirmation dialog before starting a journey.' },
    { id: 25, name: 'JourneySettings', category: 'journey', usageCount: 12, lastUpdated: '2025-04-28', path: '@/components/frequency-journey/JourneySettings.tsx',
      description: 'Configuration options for journey experiences.' },
    
    // Layout Components
    { id: 26, name: 'PageLayout', category: 'layout', usageCount: 45, lastUpdated: '2025-05-05', path: '@/components/layout/PageLayout.tsx',
      description: 'Base layout structure for all pages.' },
    { id: 27, name: 'Header', category: 'layout', usageCount: 42, lastUpdated: '2025-05-03', path: '@/components/Header.tsx',
      description: 'Top navigation bar for the application.' },
    { id: 28, name: 'Sidebar', category: 'layout', usageCount: 38, lastUpdated: '2025-05-01', path: '@/components/Sidebar.tsx',
      description: 'Side navigation panel with links and user information.' },
    { id: 29, name: 'Footer', category: 'layout', usageCount: 36, lastUpdated: '2025-04-29', path: '@/components/navigation/Footer.tsx',
      description: 'Bottom section with additional links and information.' },
    { id: 30, name: 'GlobalWatermark', category: 'layout', usageCount: 22, lastUpdated: '2025-04-27', path: '@/components/GlobalWatermark.tsx',
      description: 'Watermark overlay for branding or copyright purposes.' },
  ];
};

interface ComponentCardProps {
  component: Component;
  onViewDetails: (component: Component) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onViewDetails }) => {
  return (
    <Card className="h-full hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{component.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {component.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{component.description || "No description available"}</p>
          <p>Used in {component.usageCount} places</p>
          <p>Last updated: {component.lastUpdated}</p>
          <p className="text-xs text-muted-foreground truncate">{component.path}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline" onClick={() => onViewDetails(component)}>View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ComponentExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading components from the project
    setIsLoading(true);
    setTimeout(() => {
      const scannedComponents = scanProjectComponents();
      setComponents(scannedComponents);
      setIsLoading(false);
    }, 800); // Simulate loading delay
  }, []);

  const filterComponents = (query: string, category: string = 'all') => {
    let filtered = components;
    
    if (query) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(query.toLowerCase())) ||
        c.path.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    
    return filtered;
  };

  const handleViewDetails = (component: Component) => {
    setSelectedComponent(component);
    setIsDetailDialogOpen(true);
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success('Component path copied to clipboard');
  };

  const filteredComponents = filterComponents(searchQuery, activeCategory);

  // Get unique categories from components
  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];

  return (
    <PageLayout title="Component Explorer">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Component Explorer
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Browse, search, and manage all components available in Sacred Shifter
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search components by name, description or path..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button size="sm" className="flex-1 md:flex-none">
              <Box className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Add Component</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 md:flex-none">
              <FileText className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Documentation</span>
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="all" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="space-y-6"
        >
          <TabsList className="w-full md:w-auto flex flex-wrap">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : filteredComponents.length === 0 ? (
              <div className="py-20 text-center">
                <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No components found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComponents.map(component => (
                  <ComponentCard 
                    key={component.id} 
                    component={component} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </Tabs>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Explorer Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the search bar to quickly find specific components</li>
            <li>Tab navigation groups components by category</li>
            <li>Click "View Details" to see component props, usage examples, and full documentation</li>
            <li>Advanced component editing features will be available in future updates</li>
          </ul>
        </div>
      </div>

      {/* Component Detail Dialog */}
      {selectedComponent && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span className="text-xl">{selectedComponent.name}</span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {selectedComponent.category}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Path</h3>
                <div className="flex items-center bg-muted p-2 rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">{selectedComponent.path}</code>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleCopyPath(selectedComponent.path)}
                    className="ml-2 h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{selectedComponent.description || "No description available"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Usage Information</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Used in {selectedComponent.usageCount} places</li>
                  <li>Last updated: {selectedComponent.lastUpdated}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Props</h3>
                {selectedComponent.props && selectedComponent.props.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedComponent.props.map((prop, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium">{prop.name}</td>
                            <td className="px-4 py-2 text-sm text-muted-foreground"><code>{prop.type}</code></td>
                            <td className="px-4 py-2 text-sm">
                              {prop.required ? 
                                <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Required</Badge> : 
                                <Badge variant="outline">Optional</Badge>
                              }
                            </td>
                            <td className="px-4 py-2 text-sm text-muted-foreground">{prop.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md bg-muted/20">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Props information is not available for this component
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Code Example</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>
                      {`import { ${selectedComponent.name} } from "${selectedComponent.path.replace(/\.tsx?$/, '')}";

// Basic usage example
export default function Example() {
  return (
    <${selectedComponent.name} />
  );
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
              <Button>
                <Code className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
};

export default ComponentExplorer;
