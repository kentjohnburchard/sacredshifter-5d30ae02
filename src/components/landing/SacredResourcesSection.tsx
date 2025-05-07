
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchSacredSpectrumResources } from '@/services/sacredSpectrumService';
import { SacredSpectrumResource } from '@/types/sacred-spectrum';

const SacredResourcesSection: React.FC = () => {
  const [resources, setResources] = useState<SacredSpectrumResource[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchSacredSpectrumResources();
        setResources(data.slice(0, 3)); // Just show top 3
      } catch (err) {
        console.error("Error loading resources:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadResources();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
      </div>
    );
  }
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Sacred Spectrum Resources</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expand your consciousness with our curated collection of sacred resources
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="bg-black/60 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                {resource.category && (
                  <CardDescription className="text-purple-300/70">
                    {resource.category}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">
                  {resource.description || "Dive into this sacred resource to expand your consciousness."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                {resource.external_link ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.external_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Explore
                    </a>
                  </Button>
                ) : resource.journey_slug ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/journey/${resource.journey_slug}`}>
                      <BookOpen className="h-4 w-4 mr-2" /> Journey
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/sacred-spectrum">
                      <FileText className="h-4 w-4 mr-2" /> View
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/sacred-spectrum">
              Explore All Resources
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SacredResourcesSection;
