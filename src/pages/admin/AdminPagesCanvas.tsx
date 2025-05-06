
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
  FileText, 
  PlusCircle, 
  Eye, 
  Edit, 
  Save, 
  Code,
  Clock,
  History,
  Package,
  LayoutGrid,
  Trash2,
  Globe,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllPages,
  getPageSource,
  createPage,
  updatePage,
  getPageDrafts,
  getPageVersions,
  createPageDraft,
  addComponentToPage
} from '@/services/pageManagementService';
import { 
  PageMetadata, 
  PageDraft, 
  PageVersion 
} from '@/services/pageManagementService';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { getAllComponents } from '@/services/componentManagementService';
import { ComponentMetadata } from '@/services/adminComponentsService';

const AdminPagesCanvas: React.FC = () => {
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<PageMetadata | null>(null);
  const [pageSource, setPageSource] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedSource, setEditedSource] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<PageDraft[]>([]);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [components, setComponents] = useState<ComponentMetadata[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const createForm = useForm({
    defaultValues: {
      title: '',
      route: '',
      description: '',
      status: 'draft' as 'published' | 'draft' | 'archived',
    },
  });
  
  const componentForm = useForm({
    defaultValues: {
      componentId: '',
      props: '',
    },
  });
  
  // Load all pages
  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      try {
        const data = await getAllPages();
        setPages(data);
      } catch (error) {
        console.error('Error loading pages:', error);
        toast.error('Failed to load pages');
      } finally {
        setLoading(false);
      }
    };
    
    loadPages();
  }, []);
  
  // Load all components for the add component dialog
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const data = await getAllComponents();
        setComponents(data);
      } catch (error) {
        console.error('Error loading components:', error);
      }
    };
    
    if (isAddComponentOpen) {
      loadComponents();
    }
  }, [isAddComponentOpen]);
  
  // Filter pages based on search query
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.route.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // View page details
  const handleViewDetails = async (page: PageMetadata) => {
    setSelectedPage(page);
    setIsDetailsOpen(true);
    setLoadingDetails(true);
    
    try {
      // Load page source code
      const source = await getPageSource(page.id);
      setPageSource(source);
      setEditedSource(source);
      
      // Load drafts and versions
      const pageDrafts = await getPageDrafts(page.id);
      const pageVersions = await getPageVersions(page.id);
      
      setDrafts(pageDrafts);
      setVersions(pageVersions);
    } catch (error) {
      console.error('Error loading page details:', error);
      toast.error('Failed to load page details');
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Handle create page
  const handleCreatePage = async (data: any) => {
    try {
      const newPage = await createPage({
        title: data.title,
        route: data.route,
        description: data.description,
        status: data.status,
      });
      
      if (newPage) {
        // Add to local state
        setPages([...pages, newPage]);
        
        toast.success('Page created successfully');
        setIsCreateOpen(false);
        createForm.reset();
      } else {
        toast.error('Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    }
  };
  
  // Save page edits
  const handleSaveEdits = async () => {
    if (!selectedPage) return;
    
    try {
      // Create a draft with the edited content
      const draft = await createPageDraft(selectedPage.id, editedSource);
      
      if (draft) {
        // Add to local state
        setDrafts([draft, ...drafts]);
        
        toast.success('Page draft saved successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to save page draft');
      }
    } catch (error) {
      console.error('Error saving page draft:', error);
      toast.error('Failed to save page draft');
    }
  };
  
  // Handle add component to page
  const handleAddComponent = async (data: any) => {
    if (!selectedPage) return;
    
    try {
      const componentToAdd = components.find(c => c.id === data.componentId);
      
      if (!componentToAdd) {
        toast.error('Component not found');
        return;
      }
      
      let componentProps = {};
      
      try {
        if (data.props) {
          componentProps = JSON.parse(data.props);
        }
      } catch (e) {
        toast.error('Invalid JSON format for props');
        return;
      }
      
      const success = await addComponentToPage(
        selectedPage.id,
        componentToAdd.id,
        componentToAdd.name,
        componentProps
      );
      
      if (success) {
        toast.success(`Component ${componentToAdd.name} added to page`);
        setIsAddComponentOpen(false);
        componentForm.reset();
        
        // Reload the page source to reflect the added component
        const updatedSource = await getPageSource(selectedPage.id);
        setPageSource(updatedSource);
        setEditedSource(updatedSource);
      } else {
        toast.error('Failed to add component to page');
      }
    } catch (error) {
      console.error('Error adding component to page:', error);
      toast.error('Failed to add component to page');
    }
  };
  
  // View page history
  const handleViewHistory = () => {
    setIsHistoryOpen(true);
  };
  
  // Apply a draft or version
  const handleApplyVersion = (content: string) => {
    setEditedSource(content);
    setIsEditing(true);
    setIsHistoryOpen(false);
  };
  
  // Publish a page
  const handlePublishPage = async () => {
    if (!selectedPage) return;
    
    try {
      const success = await updatePage(selectedPage.id, {
        status: 'published',
        lastModified: new Date().toISOString(),
      });
      
      if (success) {
        // Update local state
        setPages(pages.map(p => 
          p.id === selectedPage.id ? { ...p, status: 'published', lastModified: new Date().toISOString() } : p
        ));
        
        setSelectedPage({
          ...selectedPage,
          status: 'published',
          lastModified: new Date().toISOString(),
        });
        
        toast.success('Page published successfully');
      } else {
        toast.error('Failed to publish page');
      }
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('Failed to publish page');
    }
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <PageLayout title="Page Editor">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Page Editor Canvas
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Create, manage, and edit pages across your application
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search pages..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Pages</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          {(['all', 'published', 'draft', 'archived'] as Array<'all' | 'published' | 'draft' | 'archived'>).map(tab => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPages
                    .filter(page => tab === 'all' || page.status === tab)
                    .map(page => (
                      <Card key={page.id} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{page.title}</CardTitle>
                            {getStatusBadge(page.status)}
                          </div>
                          <CardDescription>{page.route}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {page.description || 'No description available'}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Last modified: {new Date(page.lastModified).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(page)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={page.route} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4 mr-1" />
                              Visit
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
              
              {!loading && filteredPages.filter(page => tab === 'all' || page.status === tab).length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No pages found</h3>
                  <p className="text-muted-foreground mt-1">Create a new page to get started</p>
                  <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Page
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Page Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={(open) => {
          // Reset editing state when closing
          if (!open) {
            setIsEditing(false);
          }
          setIsDetailsOpen(open);
        }}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    {selectedPage?.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedPage?.route}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedPage?.status || 'draft')}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewHistory}
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {loadingDetails ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  {!isEditing ? (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Source Code</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsAddComponentOpen(true)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Add Component
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsEditing(true);
                              setEditedSource(pageSource);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Code
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted rounded-md p-4 font-mono text-xs h-[50vh] overflow-auto">
                        <pre className="whitespace-pre-wrap">{pageSource}</pre>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Editing Source Code</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsEditing(false);
                              setEditedSource(pageSource);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleSaveEdits}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save Draft
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        value={editedSource} 
                        onChange={(e) => setEditedSource(e.target.value)}
                        className="font-mono text-xs h-[50vh] resize-none"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Page Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">File Path</p>
                        <p className="text-sm font-mono">{selectedPage?.path}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Route</p>
                        <p className="text-sm font-mono">{selectedPage?.route}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Last Modified</p>
                        <p className="text-sm">
                          {selectedPage?.lastModified 
                            ? new Date(selectedPage.lastModified).toLocaleString() 
                            : 'Unknown'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Created By</p>
                        <p className="text-sm">{selectedPage?.createdBy || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPage?.components && selectedPage.components.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Components Used</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="text-left p-2">Component</th>
                              <th className="text-left p-2">Props</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPage.components.map((component, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2 font-medium">{component.name}</td>
                                <td className="p-2 font-mono text-xs">
                                  {JSON.stringify(component.props, null, 2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            
            <DialogFooter className="flex justify-between mt-4">
              <div>
                {selectedPage?.status !== 'published' && (
                  <Button onClick={handlePublishPage}>
                    <Globe className="h-4 w-4 mr-1" />
                    Publish Page
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Create Page Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>
                Create a new page for your application
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreatePage)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="About Us" />
                      </FormControl>
                      <FormDescription>
                        The displayed title of the page
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Route</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="/about" />
                      </FormControl>
                      <FormDescription>
                        The URL route for this page
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Information about our company and team" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Page
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Add Component Dialog */}
        <Dialog open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Component to Page</DialogTitle>
              <DialogDescription>
                Select a component to add to the page
              </DialogDescription>
            </DialogHeader>
            
            <Form {...componentForm}>
              <form onSubmit={componentForm.handleSubmit(handleAddComponent)} className="space-y-4">
                <FormField
                  control={componentForm.control}
                  name="componentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a component" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {components.map(component => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the component you want to add
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={componentForm.control}
                  name="props"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Props (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder='{"variant": "default", "size": "default"}'
                          className="font-mono text-xs"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the component props as a JSON object
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddComponentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Package className="h-4 w-4 mr-1" />
                    Add Component
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Page History Dialog */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Page History</DialogTitle>
              <DialogDescription>
                Review drafts and previous versions of this page
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="drafts" className="space-y-4">
              <TabsList>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="drafts">
                {drafts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No drafts available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drafts.map(draft => (
                      <Card key={draft.id}>
                        <CardHeader className="py-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-base">
                                Draft from {new Date(draft.createdAt).toLocaleString()}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Created by {draft.createdBy}
                              </CardDescription>
                            </div>
                            <Badge variant={draft.status === 'active' ? 'default' : 'secondary'}>
                              {draft.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-0 pb-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApplyVersion(draft.content)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Apply Draft
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="versions">
                {versions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No versions available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {versions.map(version => (
                      <Card key={version.id}>
                        <CardHeader className="py-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-base">
                                Version {version.versionNumber}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {new Date(version.createdAt).toLocaleString()} by {version.createdBy}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0">
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                        </CardContent>
                        <CardFooter className="pt-2 pb-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApplyVersion(version.content)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Restore Version
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" /> Page Editor Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Browse all pages in your application</li>
            <li>Create new pages from scratch or templates</li>
            <li>Edit page source code directly</li>
            <li>Add components to pages visually</li>
            <li>View and restore previous versions</li>
            <li>Publish, unpublish, or archive pages</li>
            <li>View page usage analytics and SEO performance</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPagesCanvas;
