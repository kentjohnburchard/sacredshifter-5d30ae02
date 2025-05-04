
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  fetchSacredSpectrumResources, 
  SacredSpectrumResource,
  resourceCategories
} from '@/services/sacredSpectrumService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Search, 
  FileIcon, 
  ExternalLinkIcon, 
  FileTextIcon
} from 'lucide-react';
import { toast } from 'sonner';

const SacredSpectrum: React.FC = () => {
  const [resources, setResources] = useState<SacredSpectrumResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<SacredSpectrumResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    loadResources();
  }, []);
  
  // Filter resources whenever filters change
  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory, selectedTags, resources]);
  
  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await fetchSacredSpectrumResources();
      setResources(data);
      
      // Extract all unique tags from the resources
      const tagsSet = new Set<string>();
      data.forEach(resource => {
        if (resource.tags) {
          const tags = resource.tags.split(',').map(tag => tag.trim());
          tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAllTags(Array.from(tagsSet).filter(Boolean).sort());
      
    } catch (error) {
      console.error('Failed to load resources:', error);
      toast.error('Failed to load sacred knowledge resources');
    } finally {
      setLoading(false);
    }
  };
  
  const filterResources = () => {
    let filtered = [...resources];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        (resource.description && resource.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(resource => {
        if (!resource.tags) return false;
        const resourceTags = resource.tags.split(',').map(tag => tag.trim());
        return selectedTags.some(tag => resourceTags.includes(tag));
      });
    }
    
    setFilteredResources(filtered);
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const getResourceIcon = (resource: SacredSpectrumResource) => {
    if (resource.file_url) {
      // Determine file type from URL
      const fileUrl = resource.file_url.toLowerCase();
      if (fileUrl.endsWith('.pdf')) {
        return <FileIcon className="h-5 w-5 text-red-500" />;
      } else if (fileUrl.endsWith('.doc') || fileUrl.endsWith('.docx')) {
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      } else if (fileUrl.endsWith('.txt')) {
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
      } else {
        return <FileIcon className="h-5 w-5 text-purple-500" />;
      }
    } else if (resource.external_link) {
      return <ExternalLinkIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getResourceTypeColor = (resource: SacredSpectrumResource) => {
    // Return Tailwind gradient class based on resource category or type
    if (resource.category === 'Vibrational Acoustics') {
      return 'from-purple-400 to-blue-400';
    } else if (resource.category === 'Sacred Geometry') {
      return 'from-emerald-400 to-cyan-400';
    } else if (resource.category === 'Hermetic Principles') {
      return 'from-amber-400 to-orange-400';
    } else if (resource.category === 'Ancient Technologies') {
      return 'from-rose-400 to-red-400';
    } else if (resource.category === 'Quantum Consciousness') {
      return 'from-violet-400 to-fuchsia-400';
    } else if (resource.category === 'Frequency Healing') {
      return 'from-green-400 to-emerald-400';
    } else {
      return 'from-indigo-400 to-purple-400';
    }
  };
  
  const openResource = (resource: SacredSpectrumResource) => {
    if (resource.external_link) {
      window.open(resource.external_link, '_blank', 'noopener,noreferrer');
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank', 'noopener,noreferrer');
    } else {
      // No link or file, just show the description
      toast.info('This resource contains text content only');
    }
  };
  
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <Card 
            key={resource.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`h-3 bg-gradient-to-r ${getResourceTypeColor(resource)}`} />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                {getResourceIcon(resource)}
              </div>
              {resource.category && (
                <CardDescription>{resource.category}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-4">
              {resource.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {resource.description}
                </p>
              )}
              {resource.tags && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {resource.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                    <Badge variant="outline" key={`${resource.id}-${tag}`} className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => openResource(resource)} 
                className={`w-full bg-gradient-to-r ${getResourceTypeColor(resource)}`}
              >
                {resource.external_link ? 'Open Link' : 
                 resource.file_url ? 'View Document' : 'View Details'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderListView = () => {
    return (
      <div className="space-y-4">
        {filteredResources.map(resource => (
          <div 
            key={resource.id} 
            className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="mr-4">
              {getResourceIcon(resource)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium">{resource.title}</h3>
              {resource.category && (
                <p className="text-sm text-gray-500">{resource.category}</p>
              )}
              {resource.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
              )}
              {resource.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {resource.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                    <Badge variant="outline" key={`${resource.id}-${tag}`} className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-4">
              <Button 
                onClick={() => openResource(resource)} 
                className={`bg-gradient-to-r ${getResourceTypeColor(resource)}`}
                size="sm"
              >
                {resource.external_link ? 'Open Link' : 
                 resource.file_url ? 'View' : 'Details'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout pageTitle="Sacred Spectrum">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Spectrum Knowledge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore ancient wisdom and vibrational research that bridges science and spirituality
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {resourceCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}
              >
                List
              </Button>
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Popular Tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      selectedTags.includes(tag) ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full"></div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-medium text-gray-700">No resources found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-white/60">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="text">Text Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {viewMode === 'grid' ? renderGridView() : renderListView()}
              </TabsContent>
              
              <TabsContent value="documents">
                {viewMode === 'grid' 
                  ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.filter(r => r.file_url).map(resource => (
                        <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          <div className={`h-3 bg-gradient-to-r ${getResourceTypeColor(resource)}`} />
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{resource.title}</CardTitle>
                              {getResourceIcon(resource)}
                            </div>
                            {resource.category && (
                              <CardDescription>{resource.category}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pb-4">
                            {resource.description && (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {resource.description}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button 
                              onClick={() => openResource(resource)} 
                              className={`w-full bg-gradient-to-r ${getResourceTypeColor(resource)}`}
                            >
                              View Document
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  : <div className="space-y-4">
                      {filteredResources.filter(r => r.file_url).map(resource => (
                        <div key={resource.id} className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                          <div className="mr-4">
                            {getResourceIcon(resource)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium">{resource.title}</h3>
                            {resource.category && (
                              <p className="text-sm text-gray-500">{resource.category}</p>
                            )}
                            {resource.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            <Button 
                              onClick={() => openResource(resource)} 
                              className={`bg-gradient-to-r ${getResourceTypeColor(resource)}`}
                              size="sm"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                }
                {filteredResources.filter(r => r.file_url).length === 0 && (
                  <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg">
                    <h3 className="text-xl font-medium text-gray-700">No document resources found</h3>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="links">
                {viewMode === 'grid' 
                  ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.filter(r => r.external_link).map(resource => (
                        <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          <div className={`h-3 bg-gradient-to-r ${getResourceTypeColor(resource)}`} />
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{resource.title}</CardTitle>
                              {getResourceIcon(resource)}
                            </div>
                            {resource.category && (
                              <CardDescription>{resource.category}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pb-4">
                            {resource.description && (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {resource.description}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button 
                              onClick={() => openResource(resource)} 
                              className={`w-full bg-gradient-to-r ${getResourceTypeColor(resource)}`}
                            >
                              Open Link
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  : <div className="space-y-4">
                      {filteredResources.filter(r => r.external_link).map(resource => (
                        <div key={resource.id} className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                          <div className="mr-4">
                            {getResourceIcon(resource)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium">{resource.title}</h3>
                            {resource.category && (
                              <p className="text-sm text-gray-500">{resource.category}</p>
                            )}
                            {resource.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            <Button 
                              onClick={() => openResource(resource)} 
                              className={`bg-gradient-to-r ${getResourceTypeColor(resource)}`}
                              size="sm"
                            >
                              Open Link
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                }
                {filteredResources.filter(r => r.external_link).length === 0 && (
                  <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg">
                    <h3 className="text-xl font-medium text-gray-700">No external link resources found</h3>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="text">
                {viewMode === 'grid' 
                  ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.filter(r => !r.file_url && !r.external_link).map(resource => (
                        <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          <div className={`h-3 bg-gradient-to-r ${getResourceTypeColor(resource)}`} />
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{resource.title}</CardTitle>
                              {getResourceIcon(resource)}
                            </div>
                            {resource.category && (
                              <CardDescription>{resource.category}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            {resource.description && (
                              <p className="text-sm text-gray-600">
                                {resource.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  : <div className="space-y-4">
                      {filteredResources.filter(r => !r.file_url && !r.external_link).map(resource => (
                        <div key={resource.id} className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                          <div className="mr-4">
                            {getResourceIcon(resource)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium">{resource.title}</h3>
                            {resource.category && (
                              <p className="text-sm text-gray-500">{resource.category}</p>
                            )}
                            {resource.description && (
                              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                }
                {filteredResources.filter(r => !r.file_url && !r.external_link).length === 0 && (
                  <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-lg">
                    <h3 className="text-xl font-medium text-gray-700">No text-only resources found</h3>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SacredSpectrum;
