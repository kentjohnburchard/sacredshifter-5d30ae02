
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Code, 
  Package, 
  FileText, 
  PlusCircle, 
  Copy, 
  Eye, 
  Edit, 
  Save, 
  ExternalLink,
  RefreshCw,
  Box,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllComponents, 
  getComponentSource, 
  getComponentUsage,
  updateComponentMetadata,
  createComponent
} from '@/services/componentManagementService';
import { ComponentMetadata, ComponentUsage } from '@/services/adminComponentsService';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

type ComponentViewMode = 'grid' | 'list';
type ComponentTab = 'all' | 'ui' | 'layout' | 'data' | 'custom';

const ComponentExplorer: React.FC = () => {
  const [components, setComponents] = useState<ComponentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ComponentViewMode>('grid');
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null);
  const [componentSource, setComponentSource] = useState('');
  const [componentUsage, setComponentUsage] = useState<ComponentUsage[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      category: 'ui',
      description: '',
    },
  });
  
  const editForm = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
    },
  });
  
  // Load all components
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const data = await getAllComponents();
        setComponents(data);
      } catch (error) {
        console.error('Error loading components:', error);
        toast.error('Failed to load components');
      } finally {
        setLoading(false);
      }
    };
    
    loadComponents();
  }, []);
  
  // Filter components based on search query
  const filteredComponents = components.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group components by category
  const groupedComponents = filteredComponents.reduce<Record<string, ComponentMetadata[]>>((acc, component) => {
    const category = component.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {});
  
  // Filter components by tab
  const getComponentsForTab = (tab: ComponentTab) => {
    if (tab === 'all') return filteredComponents;
    return filteredComponents.filter(component => 
      tab === 'ui' ? component.category === 'ui' : 
      tab === 'layout' ? component.category === 'layout' : 
      tab === 'data' ? component.category === 'data' :
      tab === 'custom' ? !['ui', 'layout', 'data'].includes(component.category || '') :
      false
    );
  };
  
  // View component details
  const handleViewDetails = async (component: ComponentMetadata) => {
    setSelectedComponent(component);
    setIsDetailsOpen(true);
    setLoadingDetails(true);
    
    try {
      // Load component source code
      const source = await getComponentSource(component.path);
      setComponentSource(source);
      
      // Load usage information
      const usage = await getComponentUsage(component.id);
      setComponentUsage(usage);
    } catch (error) {
      console.error('Error loading component details:', error);
      toast.error('Failed to load component details');
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Handle edit component
  const handleEditComponent = (component: ComponentMetadata) => {
    setSelectedComponent(component);
    editForm.reset({
      name: component.name,
      category: component.category || '',
      description: component.description || '',
    });
    setIsEditOpen(true);
  };
  
  // Save component edits
  const handleSaveEdit = async (data: any) => {
    if (!selectedComponent) return;
    
    try {
      const updatedComponent = {
        ...selectedComponent,
        name: data.name,
        category: data.category,
        description: data.description,
      };
      
      const success = await updateComponentMetadata(updatedComponent);
      
      if (success) {
        // Update local state
        setComponents(components.map(c => 
          c.id === selectedComponent.id ? updatedComponent : c
        ));
        
        toast.success('Component updated successfully');
        setIsEditOpen(false);
      } else {
        toast.error('Failed to update component');
      }
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component');
    }
  };
  
  // Handle create component
  const handleCreateComponent = async (data: any) => {
    try {
      // For demonstration, we're creating a basic component
      const newComponent = await createComponent(
        data.name,
        data.category,
        'basic', // template type
        [] // default props
      );
      
      if (newComponent) {
        // Add to local state
        setComponents([...components, newComponent]);
        
        toast.success('Component created successfully');
        setIsCreateOpen(false);
        form.reset();
      } else {
        toast.error('Failed to create component');
      }
    } catch (error) {
      console.error('Error creating component:', error);
      toast.error('Failed to create component');
    }
  };
  
  // Copy component usage code
  const handleCopyUsage = () => {
    if (!selectedComponent) return;
    
    const importStatement = `import { ${selectedComponent.name} } from "${selectedComponent.path}";`;
    const usageExample = `<${selectedComponent.name} />`;
    
    navigator.clipboard.writeText(`${importStatement}\n\n${usageExample}`);
    toast.success('Component usage copied to clipboard');
  };
  
  return (
    <PageLayout title="Component Explorer">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Component Explorer
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Browse, manage, and use components across your application
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
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Component
            </Button>
            
            <div className="border rounded-md p-1 flex">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Components</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          {(['all', 'ui', 'layout', 'data', 'custom'] as ComponentTab[]).map(tab => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getComponentsForTab(tab).map(component => (
                    <Card key={component.id} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Package className="h-5 w-5 text-purple-500" />
                              {component.name}
                            </CardTitle>
                            <CardDescription>{component.path}</CardDescription>
                          </div>
                          <Badge>{component.category || 'other'}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {component.description || 'No description available'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <Code className="h-3.5 w-3.5 mr-1" />
                          <span>{component.usageCount || 0} usages</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Updated {component.lastUpdated ? new Date(component.lastUpdated).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(component)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditComponent(component)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {getComponentsForTab(tab).length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No components found</p>
                      ) : (
                        getComponentsForTab(tab).map(component => (
                          <div 
                            key={component.id} 
                            className="flex justify-between items-center p-2 hover:bg-accent rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-purple-500" />
                              <div>
                                <p className="font-medium">{component.name}</p>
                                <p className="text-xs text-muted-foreground">{component.path}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{component.category}</Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleViewDetails(component)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditComponent(component)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Component Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                {selectedComponent?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedComponent?.path}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {loadingDetails ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedComponent?.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Props</h3>
                    {selectedComponent?.props && selectedComponent.props.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="text-left p-2">Name</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Required</th>
                              <th className="text-left p-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedComponent.props.map((prop, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2 font-mono text-xs">{prop.name}</td>
                                <td className="p-2 font-mono text-xs">{prop.type}</td>
                                <td className="p-2">
                                  {prop.required ? (
                                    <Badge variant="default">Required</Badge>
                                  ) : (
                                    <Badge variant="outline">Optional</Badge>
                                  )}
                                </td>
                                <td className="p-2 text-xs text-muted-foreground">{prop.description || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No props documented</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Source Code</h3>
                      <Button variant="outline" size="sm" onClick={handleCopyUsage}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Usage
                      </Button>
                    </div>
                    <div className="bg-muted rounded-md p-4 font-mono text-xs h-64 overflow-auto">
                      <pre className="whitespace-pre-wrap">{componentSource || 'No source code available'}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Usage</h3>
                    {componentUsage.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="text-left p-2">Page</th>
                              <th className="text-left p-2">Path</th>
                              <th className="text-left p-2">Instances</th>
                            </tr>
                          </thead>
                          <tbody>
                            {componentUsage.map((usage, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">{usage.pageName}</td>
                                <td className="p-2 font-mono text-xs">{usage.pagePath}</td>
                                <td className="p-2">{usage.instanceCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No usage information available</p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsDetailsOpen(false);
                handleEditComponent(selectedComponent!);
              }}>
                <Edit className="h-4 w-4 mr-1" />
                Edit Component
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Component Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Component</DialogTitle>
              <DialogDescription>
                Update component details and documentation
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleSaveEdit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ui">UI</SelectItem>
                          <SelectItem value="layout">Layout</SelectItem>
                          <SelectItem value="data">Data</SelectItem>
                          <SelectItem value="util">Utility</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Create Component Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Component</DialogTitle>
              <DialogDescription>
                Create a new component from a template
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateComponent)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MyComponent" />
                      </FormControl>
                      <FormDescription>
                        Use PascalCase for component names (e.g., MyComponent)
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ui">UI</SelectItem>
                          <SelectItem value="layout">Layout</SelectItem>
                          <SelectItem value="data">Data</SelectItem>
                          <SelectItem value="util">Utility</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category determines where the component will be stored
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="A brief description of what this component does" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Component
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" /> Component Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the component explorer to browse all available components</li>
            <li>View component details including props, source code, and usage</li>
            <li>Edit component metadata and documentation</li>
            <li>Create new components from templates</li>
            <li>Copy component import and usage code with a single click</li>
            <li>Track where components are used throughout the application</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default ComponentExplorer;
