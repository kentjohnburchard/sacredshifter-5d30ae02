
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fetchSacredSpectrumResources, SacredSpectrumResource } from '@/services/sacredSpectrumService';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, ExternalLinkIcon, FileIcon } from 'lucide-react';

const SacredResourcesSection: React.FC = () => {
  const [resources, setResources] = useState<SacredSpectrumResource[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFeaturedResources = async () => {
      try {
        const data = await fetchSacredSpectrumResources();
        // Get up to 3 recent resources
        setResources(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load featured resources:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedResources();
  }, []);
  
  const getResourceIcon = (resource: SacredSpectrumResource) => {
    if (resource.file_url) {
      return <FileIcon className="h-5 w-5 text-purple-500" />;
    } else if (resource.external_link) {
      return <ExternalLinkIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <BookOpenIcon className="h-5 w-5 text-indigo-500" />;
    }
  };

  if (loading || resources.length === 0) {
    return null; // Don't show the section if no resources or still loading
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50/70 to-indigo-50/70">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700">
          Sacred Spectrum Knowledge
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
          Explore our growing archive of vibrational research and ancient wisdom that bridge science and spirituality.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map(resource => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-2 bg-gradient-to-r from-purple-400 to-indigo-400" />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {getResourceIcon(resource)}
                </div>
                {resource.category && (
                  <CardDescription className="mb-2">{resource.category}</CardDescription>
                )}
                {resource.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/sacred-spectrum">
            <Button className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700">
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Explore Sacred Knowledge
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SacredResourcesSection;
