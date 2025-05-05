
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Music, 
  FileText, 
  Settings, 
  Search, 
  Book,
  Plus, 
  Upload, 
  Edit, 
  Headphones,
  Grid3x3, 
  AudioLines, 
  BookOpen, 
  ListOrdered, 
  FileAudio, 
  FileImage,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AdminToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const AdminToolCard: React.FC<AdminToolCardProps> = ({ 
  title, 
  description, 
  icon, 
  path, 
  badgeText, 
  badgeVariant = "default" 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-purple-300" onClick={() => navigate(path)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badgeText && (
            <Badge variant={badgeVariant} className="ml-2">
              {badgeText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

const AdminConsole: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const journeyTools = [
    {
      title: "Journey Manager",
      description: "Create, edit, and manage core and database journeys",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/journeys",
    },
    {
      title: "Journey Content Editor",
      description: "Advanced editor for journey content and spiral parameters",
      icon: <Edit className="h-5 w-5" />,
      path: "/journey-content-admin",
    },
    {
      title: "Spiral Parameters",
      description: "Manage visual spiral parameters for each journey",
      icon: <Settings className="h-5 w-5" />,
      path: "/journey-templates-admin",
    },
  ];

  const audioTools = [
    {
      title: "Audio Admin",
      description: "Manage audio files for journeys and soundscapes",
      icon: <Music className="h-5 w-5" />,
      path: "/admin/journey-audio",
    },
    {
      title: "Audio Mappings",
      description: "Map audio files to journey templates",
      icon: <Headphones className="h-5 w-5" />,
      path: "/admin/journey-audio-mappings",
    },
  ];

  const libraryTools = [
    {
      title: "Frequency Library",
      description: "Manage the Sacred Spectrum frequency catalog",
      icon: <AudioLines className="h-5 w-5" />,
      path: "/frequency-library",
      badgeText: "View",
      badgeVariant: "outline",
    },
    {
      title: "Hermetic Wisdom",
      description: "Manage hermetic principles and journeys",
      icon: <Book className="h-5 w-5" />,
      path: "/hermetic-wisdom",
      badgeText: "View",
      badgeVariant: "outline",
    },
  ];

  const visualTools = [
    {
      title: "Visualizer Scenes",
      description: "Manage and customize visualizer scenes",
      icon: <Layers className="h-5 w-5" />,
      path: "/admin/visualizer-scenes",
    },
    {
      title: "Page Editor",
      description: "Edit content for static pages",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/admin/pages-canvas",
    },
  ];

  const quickActions = [
    {
      title: "Add New Journey",
      icon: <Plus className="h-5 w-5" />,
      action: () => navigate("/journey-content-admin"),
    },
    {
      title: "Upload Audio",
      icon: <Upload className="h-5 w-5" />,
      action: () => navigate("/admin/journey-audio"),
    },
    {
      title: "Edit Spiral",
      icon: <Edit className="h-5 w-5" />,
      action: () => navigate("/journey-templates-admin"),
    },
  ];

  // Filter tools based on search query
  const filterTools = (tools: typeof journeyTools) => {
    if (!searchQuery) return tools;
    return tools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filtered tool arrays
  const filteredJourneyTools = filterTools(journeyTools);
  const filteredAudioTools = filterTools(audioTools);
  const filteredLibraryTools = filterTools(libraryTools);
  const filteredVisualTools = filterTools(visualTools);

  return (
    <PageLayout title="Admin Console">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Sacred Shifter Admin Console
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Unified management center for all Sacred Shifter administrative functions
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search admin tools..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                onClick={action.action} 
                size="sm" 
                className="flex-1 md:flex-none"
                variant={index === 0 ? "default" : "outline"}
              >
                {action.icon}
                <span className="ml-1 hidden md:inline">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-5 gap-1">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="journeys">Journeys</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="libraries">Libraries</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Journey Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJourneyTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  Audio Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAudioTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Book className="h-5 w-5 text-purple-600" />
                  Content Libraries
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLibraryTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Visual & Content Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVisualTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="journeys">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Journey Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJourneyTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="audio">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              Audio Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudioTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="libraries">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-600" />
              Content Libraries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibraryTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="visual">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-600" />
              Visual & Content Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVisualTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Admin Console Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the search bar to quickly find specific admin tools</li>
            <li>Tab navigation groups tools by category for easier access</li>
            <li>Quick action buttons at the top provide shortcuts to common tasks</li>
            <li>All admin tools maintain their original functionality</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminConsole;
