
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { getAllPages, createPage, updatePage, deletePage } from '@/services/pageManagementService';
import { PageMetadata } from '@/services/pageManagementService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  FilePlus, 
  Edit, 
  Trash2, 
  Eye, 
  File, 
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const PagesManager: React.FC = () => {
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageMetadata | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      path: '',
      route: '',
      description: '',
      status: 'draft' as 'published' | 'draft' | 'archived',
    }
  });
  
  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      try {
        const pagesData = await getAllPages();
        setPages(pagesData);
      } catch (error) {
        console.error('Error loading pages:', error);
        toast.error('Failed to load pages');
      } finally {
        setLoading(false);
      }
    };
    
    loadPages();
  }, []);
  
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.route.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreatePage = async (data: any) => {
    try {
      const newPage = await createPage({
        title: data.title,
        path: data.path,
        route: data.route,
        description: data.description,
        status: data.status,
      });
      
      if (newPage) {
        setPages([...pages, newPage]);
        toast.success('Page created successfully');
        setIsCreateDialogOpen(false);
        form.reset();
      } else {
        toast.error('Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    }
  };
  
  const handleDeletePage = async () => {
    if (!selectedPage) return;
    
    try {
      const success = await deletePage(selectedPage.id);
      
      if (success) {
        setPages(pages.filter(page => page.id !== selectedPage.id));
        toast.success('Page deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedPage(null);
      } else {
        toast.error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Published</Badge>;
      case 'draft':
        return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="h-3 w-3 mr-1" /> Draft</Badge>;
      case 'archived':
        return <Badge variant="outline" className="border-gray-500 text-gray-500"><XCircle className="h-3 w-3 mr-1" /> Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <PageLayout title="Page Manager">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Page Manager
          </span>
        </h1>
        <p className="text-muted-foreground text-center md:text-left mb-6">
          Create, edit, and manage your site's pages
        </p>
        
        <AdminNavigation />
        
        <div className="flex flex-col md:flex-row justify-between items-center my-6 gap-4">
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map(page => (
              <Card key={page.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <File className="h-5 w-5 text-blue-500" />
                      {page.title}
                    </CardTitle>
                    {getStatusBadge(page.status)}
                  </div>
                  <CardDescription>{page.path}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {page.description || 'No description available'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Route: <span className="font-mono">{page.route}</span>
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setSelectedPage(page);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Create Page Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>
                Create a new page on your site
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePage)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Home" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Path</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="/src/pages/Home.tsx" />
                      </FormControl>
                      <FormDescription>
                        The file path where the page component is located
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="/" />
                      </FormControl>
                      <FormDescription>
                        The URL path for this page
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
                        <Textarea {...field} placeholder="A brief description of the page" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select page status" />
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
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Page
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Page</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this page? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedPage && (
              <div className="my-4 p-3 border rounded-md">
                <p className="font-medium">{selectedPage.title}</p>
                <p className="text-sm text-muted-foreground">{selectedPage.path}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePage}
              >
                Delete Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default PagesManager;
