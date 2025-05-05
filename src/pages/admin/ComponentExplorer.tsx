
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Box, Layout, FileText, BookOpen, Grid3x3, Music, Calendar, Database, Settings, Users } from 'lucide-react';

// Mock component data - in a real implementation, this would be dynamically generated
const mockComponents = [
  { id: 1, name: 'Button', category: 'ui', usageCount: 42, lastUpdated: '2023-05-01' },
  { id: 2, name: 'Card', category: 'ui', usageCount: 37, lastUpdated: '2023-04-15' },
  { id: 3, name: 'SacredGeometryCanvas', category: 'visualizer', usageCount: 8, lastUpdated: '2023-03-22' },
  { id: 4, name: 'FrequencyPlayer', category: 'audio', usageCount: 15, lastUpdated: '2023-04-28' },
  { id: 5, name: 'JourneyTemplateCard', category: 'journey', usageCount: 23, lastUpdated: '2023-05-03' },
];

interface ComponentCardProps {
  component: {
    id: number;
    name: string;
    category: string;
    usageCount: number;
    lastUpdated: string;
  };
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
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
          <p>Used in {component.usageCount} places</p>
          <p>Last updated: {component.lastUpdated}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ComponentExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState(mockComponents);

  const filterComponents = (query: string, category: string = 'all') => {
    let filtered = mockComponents;
    
    if (query) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }
    
    setComponents(filtered);
  };

  useEffect(() => {
    filterComponents(searchQuery);
  }, [searchQuery]);

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
              placeholder="Search components..."
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

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-5 gap-1">
            <TabsTrigger value="all" onClick={() => filterComponents(searchQuery)}>All</TabsTrigger>
            <TabsTrigger value="ui" onClick={() => filterComponents(searchQuery, 'ui')}>UI</TabsTrigger>
            <TabsTrigger value="visualizer" onClick={() => filterComponents(searchQuery, 'visualizer')}>Visualizer</TabsTrigger>
            <TabsTrigger value="journey" onClick={() => filterComponents(searchQuery, 'journey')}>Journey</TabsTrigger>
            <TabsTrigger value="audio" onClick={() => filterComponents(searchQuery, 'audio')}>Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ui" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.filter(c => c.category === 'ui').map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="visualizer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.filter(c => c.category === 'visualizer').map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="journey" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.filter(c => c.category === 'journey').map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.filter(c => c.category === 'audio').map(component => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </TabsContent>
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
    </PageLayout>
  );
};

export default ComponentExplorer;
