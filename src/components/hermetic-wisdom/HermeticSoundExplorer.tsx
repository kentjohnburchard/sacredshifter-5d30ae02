
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Music, Radio, Tag, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import HermeticFrequencyCard from "./HermeticFrequencyCard";
import { hermeticJourneys } from "@/data/hermeticJourneys";

const HermeticSoundExplorer: React.FC = () => {
  const [frequencies, setFrequencies] = useState<FrequencyLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterChakra, setFilterChakra] = useState<string | null>(null);
  const [filterPrinciple, setFilterPrinciple] = useState<string | null>(null);
  
  const chakras = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
  const principles = hermeticJourneys.map(journey => journey.principle);
  
  // Extract all unique tags from frequencies
  const allTags = Array.from(new Set(
    frequencies.flatMap(freq => freq.tags || [])
  ));

  useEffect(() => {
    fetchFrequencies();
  }, []);

  const fetchFrequencies = async () => {
    setIsLoading(true);
    try {
      // Attempt to fetch from Supabase
      const { data: supabaseData, error } = await supabase
        .from('frequency_library')
        .select('*');

      if (error) {
        console.error("Error fetching from Supabase:", error);
        // Use mock data from hermetic journeys as fallback
        const mockFrequencies = hermeticJourneys.map(journey => ({
          id: journey.id,
          title: `${journey.frequency}Hz - ${journey.title}`,
          frequency: journey.frequency,
          description: journey.audioDescription,
          chakra: journey.chakra,
          principle: journey.principle,
          audio_url: "https://pixabay.com/music/meditation-spiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3",
          tags: [journey.tag, journey.chakra.toLowerCase(), "frequency"],
          length: 180 + Math.floor(Math.random() * 180)
        }));
        setFrequencies(mockFrequencies as FrequencyLibraryItem[]);
      } else if (supabaseData && supabaseData.length > 0) {
        // Use real data from Supabase
        setFrequencies(supabaseData as FrequencyLibraryItem[]);
      } else {
        // No data or empty array, fall back to mock data
        const mockFrequencies = hermeticJourneys.map(journey => ({
          id: journey.id,
          title: `${journey.frequency}Hz - ${journey.title}`,
          frequency: journey.frequency,
          description: journey.audioDescription,
          chakra: journey.chakra,
          principle: journey.principle,
          audio_url: "https://pixabay.com/music/meditation-spiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3",
          tags: [journey.tag, journey.chakra.toLowerCase(), "frequency"],
          length: 180 + Math.floor(Math.random() * 180)
        }));
        setFrequencies(mockFrequencies as FrequencyLibraryItem[]);
      }
    } catch (err) {
      console.error("Error in fetchFrequencies:", err);
      // Fallback to mock data
      const mockFrequencies = hermeticJourneys.map(journey => ({
        id: journey.id,
        title: `${journey.frequency}Hz - ${journey.title}`,
        frequency: journey.frequency,
        description: journey.audioDescription,
        chakra: journey.chakra,
        principle: journey.principle,
        audio_url: "https://pixabay.com/music/meditation-spiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3",
        tags: [journey.tag, journey.chakra.toLowerCase(), "frequency"],
        length: 180 + Math.floor(Math.random() * 180)
      }));
      setFrequencies(mockFrequencies as FrequencyLibraryItem[]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter frequencies based on active filters
  const filteredFrequencies = frequencies.filter(freq => {
    // Search query filter
    if (searchQuery && !freq.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !freq.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Tag filter
    if (filterTag && (!freq.tags || !freq.tags.includes(filterTag))) {
      return false;
    }
    
    // Chakra filter
    if (filterChakra && freq.chakra !== filterChakra) {
      return false;
    }
    
    // Principle filter
    if (filterPrinciple && freq.principle !== filterPrinciple) {
      return false;
    }
    
    return true;
  });

  // Group frequencies by chakra
  const frequenciesByChakra = chakras.reduce((acc, chakra) => {
    acc[chakra] = filteredFrequencies.filter(freq => freq.chakra === chakra);
    return acc;
  }, {} as Record<string, FrequencyLibraryItem[]>);
  
  // Group frequencies by principle
  const frequenciesByPrinciple = principles.reduce((acc, principle) => {
    acc[principle] = filteredFrequencies.filter(freq => freq.principle === principle);
    return acc;
  }, {} as Record<string, FrequencyLibraryItem[]>);

  const handleChakraFilter = (chakra: string) => {
    setFilterChakra(prev => prev === chakra ? null : chakra);
    setFilterPrinciple(null);
    setFilterTag(null);
  };

  const handlePrincipleFilter = (principle: string) => {
    setFilterPrinciple(prev => prev === principle ? null : principle);
    setFilterChakra(null);
    setFilterTag(null);
  };

  const handleTagFilter = (tag: string) => {
    setFilterTag(prev => prev === tag ? null : tag);
    setFilterChakra(null);
    setFilterPrinciple(null);
  };

  const getChakraColor = (chakra: string): string => {
    switch (chakra?.toLowerCase()) {
      case 'root': return 'from-red-500 to-red-600';
      case 'sacral': return 'from-orange-400 to-orange-500';
      case 'solar plexus': return 'from-yellow-400 to-yellow-500';
      case 'heart': return 'from-green-400 to-green-500';
      case 'throat': return 'from-blue-400 to-blue-500';
      case 'third eye': return 'from-indigo-400 to-indigo-500';
      case 'crown': return 'from-purple-400 to-violet-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Headphones className="h-5 w-5 text-purple-600" />
          Hermetic Sound Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search frequencies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filterChakra && (
            <Badge 
              className={`bg-gradient-to-r ${getChakraColor(filterChakra)} text-white`}
              onClick={() => setFilterChakra(null)}
            >
              {filterChakra} ×
            </Badge>
          )}
          
          {filterPrinciple && (
            <Badge 
              variant="secondary"
              onClick={() => setFilterPrinciple(null)}
            >
              {filterPrinciple} ×
            </Badge>
          )}
          
          {filterTag && (
            <Badge 
              variant="outline"
              onClick={() => setFilterTag(null)}
            >
              {filterTag} ×
            </Badge>
          )}
          
          {(filterChakra || filterPrinciple || filterTag || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setFilterChakra(null);
                setFilterPrinciple(null);
                setFilterTag(null);
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              <Music className="h-4 w-4 mr-2" />
              All Frequencies
            </TabsTrigger>
            <TabsTrigger value="chakras">
              <Radio className="h-4 w-4 mr-2" />
              Chakra Explorer
            </TabsTrigger>
            <TabsTrigger value="principles">
              <Settings className="h-4 w-4 mr-2" />
              Hermetic Principles
            </TabsTrigger>
            <TabsTrigger value="vibes">
              <Tag className="h-4 w-4 mr-2" />
              Vibe Filters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <>
                {filteredFrequencies.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-600">No frequencies found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFrequencies.map(frequency => (
                      <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="chakras">
            <div className="flex flex-wrap gap-2 mb-6">
              {chakras.map(chakra => (
                <Button
                  key={chakra}
                  variant={filterChakra === chakra ? "default" : "outline"}
                  size="sm"
                  className={`${filterChakra === chakra ? `bg-gradient-to-r ${getChakraColor(chakra)}` : ''}`}
                  onClick={() => handleChakraFilter(chakra)}
                >
                  {chakra}
                </Button>
              ))}
            </div>
            
            {!filterChakra ? (
              // Show all chakra sections
              chakras.map(chakra => {
                const chakraFrequencies = frequenciesByChakra[chakra] || [];
                if (chakraFrequencies.length === 0) return null;
                
                return (
                  <div key={chakra} className="mb-8">
                    <h3 className={`text-lg font-medium mb-3 px-3 py-1 inline-block rounded-md bg-gradient-to-r ${getChakraColor(chakra)} text-white`}>
                      {chakra} Chakra
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chakraFrequencies.slice(0, 3).map(frequency => (
                        <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
                      ))}
                    </div>
                    {chakraFrequencies.length > 3 && (
                      <div className="text-center mt-2">
                        <Button variant="link" onClick={() => handleChakraFilter(chakra)}>
                          View all {chakraFrequencies.length} {chakra} frequencies
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Show only the selected chakra's frequencies
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(frequenciesByChakra[filterChakra] || []).map(frequency => (
                  <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="principles">
            <div className="flex flex-wrap gap-2 mb-6">
              {principles.map(principle => (
                <Button
                  key={principle}
                  variant={filterPrinciple === principle ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrincipleFilter(principle)}
                >
                  {principle}
                </Button>
              ))}
            </div>
            
            {!filterPrinciple ? (
              // Show all principle sections
              principles.map(principle => {
                const principleFrequencies = frequenciesByPrinciple[principle] || [];
                if (principleFrequencies.length === 0) return null;
                
                return (
                  <div key={principle} className="mb-8">
                    <h3 className="text-lg font-medium mb-3">
                      {principle} Principle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {principleFrequencies.slice(0, 3).map(frequency => (
                        <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
                      ))}
                    </div>
                    {principleFrequencies.length > 3 && (
                      <div className="text-center mt-2">
                        <Button variant="link" onClick={() => handlePrincipleFilter(principle)}>
                          View all {principleFrequencies.length} {principle} frequencies
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Show only the selected principle's frequencies
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(frequenciesByPrinciple[filterPrinciple] || []).map(frequency => (
                  <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="vibes">
            <div className="flex flex-wrap gap-2 mb-6">
              {allTags.slice(0, 20).map(tag => (
                <Badge
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"}
                  className={`cursor-pointer ${filterTag === tag ? 'bg-purple-500' : ''} hover:bg-purple-100`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFrequencies.map(frequency => (
                <HermeticFrequencyCard key={frequency.id} frequency={frequency} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HermeticSoundExplorer;
