
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import SacredJourneyCard from './SacredJourneyCard';
import JourneyTagFilter from './JourneyTagFilter';
import JourneySearchBar from './JourneySearchBar';
import { JourneyMetadata } from '../../types/journeys';
import { mockJourneyData } from './mockJourneyData';

const JourneyScrollDashboard: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [journeys, setJourneys] = useState<JourneyMetadata[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<JourneyMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  
  // Unique tags from all journeys
  const allTags = [...new Set(journeys.flatMap(journey => journey.tags || []))];
  
  // Group journeys by tag 
  const journeysByTag = journeys.reduce((acc, journey) => {
    (journey.tags || []).forEach(tag => {
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(journey);
    });
    if (!(journey.tags?.length)) {
      if (!acc['uncategorized']) acc['uncategorized'] = [];
      acc['uncategorized'].push(journey);
    }
    return acc;
  }, {} as Record<string, JourneyMetadata[]>);
  
  // Load journeys data
  useEffect(() => {
    // In a real implementation, this would fetch markdown files
    // For now, we'll use mock data
    setJourneys(mockJourneyData);
    setFilteredJourneys(mockJourneyData);
  }, []);
  
  // Filter journeys based on search and active tag
  useEffect(() => {
    let result = journeys;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(journey => 
        journey.title.toLowerCase().includes(query) || 
        journey.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (activeTag && activeTag !== 'all') {
      result = result.filter(journey => 
        journey.tags?.includes(activeTag)
      );
    }
    
    setFilteredJourneys(result);
  }, [searchQuery, activeTag, journeys]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${liftTheVeil ? 'veil-mode' : 'standard-mode'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-2">
          Sacred Journey Scroll
        </h1>
        <p className="text-gray-300">
          Explore transformative pathways to elevate consciousness
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <JourneySearchBar onSearch={handleSearch} />
        <JourneyTagFilter 
          tags={['all', ...allTags]} 
          activeTag={activeTag} 
          onSelectTag={handleTagSelect} 
        />
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-gray-800/60 backdrop-blur-sm">
          <TabsTrigger value="all">All Journeys</TabsTrigger>
          {Object.keys(journeysByTag).map(tag => (
            <TabsTrigger key={tag} value={tag}>{tag}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.map(journey => (
              <SacredJourneyCard key={journey.slug} journey={journey} />
            ))}
            
            {filteredJourneys.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-400">No journeys found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {Object.entries(journeysByTag).map(([tag, tagJourneys]) => (
          <TabsContent key={tag} value={tag} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tagJourneys
                .filter(journey => !searchQuery || 
                  journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  journey.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(journey => (
                  <SacredJourneyCard key={journey.slug} journey={journey} />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default JourneyScrollDashboard;
