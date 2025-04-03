
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import FrequencyCard from "./FrequencyCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, Music } from "lucide-react";

const FrequencyLibraryViewer = () => {
  const [search, setSearch] = useState("");
  const [chakraFilter, setChakraFilter] = useState<string | null>(null);
  const [vibeFilter, setVibeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("frequency");

  // Fetch frequencies from the database
  const { data: frequencies, isLoading, error } = useQuery({
    queryKey: ["frequency-library"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frequency_library")
        .select("*")
        .order("frequency");

      if (error) throw error;
      return data as FrequencyLibraryItem[];
    }
  });

  // Filter and sort frequencies
  const filteredFrequencies = React.useMemo(() => {
    if (!frequencies) return [];
    
    return frequencies
      .filter(freq => {
        // Search filter
        const searchMatch = !search || 
          freq.title.toLowerCase().includes(search.toLowerCase()) ||
          freq.description?.toLowerCase().includes(search.toLowerCase()) ||
          freq.frequency.toString().includes(search);
        
        // Chakra filter
        const chakraMatch = !chakraFilter || freq.chakra === chakraFilter;
        
        // Vibe filter (looking in tags and vibe_profile)
        const vibeMatch = !vibeFilter || 
          (freq.vibe_profile && freq.vibe_profile.toLowerCase().includes(vibeFilter.toLowerCase())) ||
          (freq.tags && freq.tags.some(tag => tag.toLowerCase().includes(vibeFilter.toLowerCase())));
        
        return searchMatch && chakraMatch && vibeMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "frequency":
            return a.frequency - b.frequency;
          case "length":
            return (a.length || 0) - (b.length || 0);
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [frequencies, search, chakraFilter, vibeFilter, sortBy]);

  // Get unique chakras for filter
  const chakras = React.useMemo(() => {
    if (!frequencies) return [];
    return Array.from(new Set(frequencies.map(f => f.chakra))).sort();
  }, [frequencies]);

  // Get unique vibes/tags for filter
  const vibes = React.useMemo(() => {
    if (!frequencies) return [];
    
    const allTags = frequencies.flatMap(f => f.tags || []);
    const allVibes = frequencies
      .filter(f => f.vibe_profile)
      .flatMap(f => f.vibe_profile!.split(',').map(v => v.trim()));
    
    return Array.from(new Set([...allTags, ...allVibes]))
      .filter(Boolean)
      .sort();
  }, [frequencies]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading frequencies...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">Error loading frequency library: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search frequencies, titles, or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select value={chakraFilter || ""} onValueChange={value => setChakraFilter(value || null)}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{chakraFilter || "All Chakras"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-chakras">All Chakras</SelectItem>
              {chakras.map(chakra => (
                <SelectItem key={chakra} value={chakra}>{chakra}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={vibeFilter || ""} onValueChange={value => setVibeFilter(value || null)}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Music className="h-4 w-4 mr-2" />
                <span>{vibeFilter || "All Vibes"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-vibes">All Vibes</SelectItem>
              {vibes.map(vibe => (
                <SelectItem key={vibe} value={vibe}>{vibe}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Frequency (Hz)</SelectItem>
              <SelectItem value="length">Duration</SelectItem>
              <SelectItem value="title">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredFrequencies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No frequencies found matching your filters.
        </div>
      ) : (
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFrequencies.map(frequency => (
              <FrequencyCard key={frequency.id} frequency={frequency} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FrequencyLibraryViewer;
