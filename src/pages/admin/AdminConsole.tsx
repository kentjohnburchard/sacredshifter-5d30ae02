
import React, { useState, useEffect } from 'react';
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
  Box,
  Calendar,
  Database,
  Image,
  Video,
  Users,
  Lock,
  LogOut,
  Info,
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

// Handle secret admin access
const useSecretAdminAccess = () => {
  const [secretCode, setSecretCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  
  // Check local storage for admin status
  useEffect(() => {
    const storedAdminStatus = localStorage.getItem('sacredShifterAdminStatus');
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // Secret code handler
  useEffect(() => {
    const secretCodes = ['ADMIN135', 'SACRED777', 'SHIFTER999'];
    
    if (secretCodes.includes(secretCode.toUpperCase())) {
      setIsAdmin(true);
      localStorage.setItem('sacredShifterAdminStatus', 'true');
      setSecretCode('');
    }
  }, [secretCode]);
  
  // Listen for special key combination (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminPortal(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return {
    secretCode,
    setSecretCode,
    isAdmin,
    setIsAdmin,
    showAdminPortal,
    setShowAdminPortal
  };
};

const AdminConsole: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { 
    secretCode, 
    setSecretCode, 
    isAdmin, 
    setIsAdmin, 
    showAdminPortal, 
    setShowAdminPortal 
  } = useSecretAdminAccess();

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
      title: "Content Scheduler",
      description: "Schedule and manage content publication timelines",
      icon: <Calendar className="h-5 w-5" />,
      path: "/admin/content-scheduler",
    },
    {
      title: "Spiral Parameters",
      description: "Manage visual spiral parameters for each journey",
      icon: <Settings className="h-5 w-5" />,
      path: "/journey-templates-admin",
    },
  ];

  const componentTools = [
    {
      title: "Component Explorer",
      description: "Browse, search, and manage all UI components",
      icon: <Box className="h-5 w-5" />,
      path: "/admin/components",
      badgeText: "New",
      badgeVariant: "default",
    },
    {
      title: "Page Editor",
      description: "Edit content for static pages",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/admin/pages-canvas",
    },
    {
      title: "Visualizer Scenes",
      description: "Manage and customize visualizer scenes",
      icon: <Layers className="h-5 w-5" />,
      path: "/admin/visualizer",
      badgeText: "New",
      badgeVariant: "default",
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
    {
      title: "Media Library",
      description: "Centralized repository for audio, images, and videos",
      icon: <FileImage className="h-5 w-5" />,
      path: "/admin/media-library",
      badgeText: "New",
      badgeVariant: "default",
    },
  ];

  const systemTools = [
    {
      title: "Database Browser",
      description: "Browse and manage database tables and records",
      icon: <Database className="h-5 w-5" />,
      path: "/admin/database",
      badgeText: "New",
      badgeVariant: "default",
    },
    {
      title: "User Manager",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
      badgeText: "New",
      badgeVariant: "default",
    },
    {
      title: "System Settings",
      description: "Configure global admin settings and preferences",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
      badgeText: "New",
      badgeVariant: "default",
    },
    {
      title: "Sacred Spectrum",
      description: "Manage the Sacred Spectrum frequency catalog",
      icon: <AudioLines className="h-5 w-5" />,
      path: "/admin/sacred-spectrum",
    },
  ];

  const quickActions = [
    {
      title: "Add New Journey",
      icon: <Plus className="h-5 w-5" />,
      action: () => navigate("/journey-content-admin"),
    },
    {
      title: "Upload Media",
      icon: <Upload className="h-5 w-5" />,
      action: () => navigate("/admin/media-library"),
    },
    {
      title: "Edit Components",
      icon: <Edit className="h-5 w-5" />,
      action: () => navigate("/admin/components"),
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
  const filteredComponentTools = filterTools(componentTools);
  const filteredAudioTools = filterTools(audioTools);
  const filteredSystemTools = filterTools(systemTools);

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('sacredShifterAdminStatus');
    navigate('/');
  };

  if (!isAdmin) {
    return (
      <PageLayout title="Admin Access">
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Admin Portal Access
              </CardTitle>
              <CardDescription>
                Enter the secret code to access the admin portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                placeholder="Enter secret code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="mb-4"
              />
              <p className="text-sm text-muted-foreground">
                <Info className="inline h-4 w-4 mr-1" />
                You can also press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded border">A</kbd> to access the admin portal.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

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
            <Button 
              onClick={handleAdminLogout} 
              size="sm" 
              variant="outline" 
              className="flex-1 md:flex-none text-red-500 border-red-300 hover:bg-red-50"
            >
              <LogOut className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-5 gap-1">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="journeys">Journeys</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
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
                  <Box className="h-5 w-5 text-purple-600" />
                  Component Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComponentTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  Audio & Media Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAudioTools.map((tool, index) => (
                    <AdminToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  System Administration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSystemTools.map((tool, index) => (
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
          
          <TabsContent value="components">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Box className="h-5 w-5 text-purple-600" />
              Component Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponentTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="audio">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              Audio & Media Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudioTools.map((tool, index) => (
                <AdminToolCard key={index} {...tool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              System Administration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSystemTools.map((tool, index) => (
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
            <li>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded border">A</kbd> to toggle the admin portal</li>
            <li>Access is secured with a secret code system for authorized personnel only</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminConsole;
