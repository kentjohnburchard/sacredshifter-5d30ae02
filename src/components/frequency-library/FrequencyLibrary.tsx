
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { Loader2 } from "lucide-react";
import FrequencyLibraryGrid from "./FrequencyLibraryGrid";
import FrequencyFilters from "./FrequencyFilters";

interface FrequencyLibraryProps {
  className?: string;
}

const FrequencyLibrary: React.FC<FrequencyLibraryProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chakraFilter, setChakraFilter] = useState<string | null>(null);
  const [principleFilter, setPrincipleFilter] = useState<string | null>(null);

  // Fetch frequencies from Supabase
  const { data: frequencies, isLoading, error } = useQuery({
    queryKey: ["frequencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frequency_library")
        .select("*")
        .order("frequency", { ascending: true });
        
      if (error) {
        throw new Error(`Error fetching frequencies: ${error.message}`);
      }
      
      return data as FrequencyLibraryItem[];
    }
  });

  // Create unique lists of chakras and principles for filters
  const { chakras, principles } = useMemo(() => {
    if (!frequencies) return { chakras: [], principles: [] };
    
    const chakraSet = new Set<string>();
    const principleSet = new Set<string>();
    
    frequencies.forEach(freq => {
      if (freq.chakra) chakraSet.add(freq.chakra);
      if (freq.principle) principleSet.add(freq.principle);
    });
    
    return {
      chakras: Array.from(chakraSet).sort(),
      principles: Array.from(principleSet).sort()
    };
  }, [frequencies]);
  
  // Filter frequencies based on all filters and search
  const filteredFrequencies = useMemo(() => {
    if (!frequencies) return [];
    
    return frequencies.filter(freq => {
      // Search filter
      const searchMatch = !searchQuery || 
        freq.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        freq.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freq.frequency?.toString().includes(searchQuery) ||
        freq.chakra?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freq.principle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freq.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Chakra filter
      const chakraMatch = !chakraFilter || freq.chakra === chakraFilter;
      
      // Principle filter
      const principleMatch = !principleFilter || freq.principle === principleFilter;
      
      return searchMatch && chakraMatch && principleMatch;
    });
  }, [frequencies, searchQuery, chakraFilter, principleFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2">Loading frequencies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Error loading frequency library: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <p className="mt-2 text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <FrequencyFilters
        chakras={chakras}
        principles={principles}
        chakraFilter={chakraFilter}
        principleFilter={principleFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onChakraFilterChange={setChakraFilter}
        onPrincipleFilterChange={setPrincipleFilter}
      />
      
      {filteredFrequencies.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          No frequencies found. Try adjusting your search or filters.
        </p>
      ) : (
        <FrequencyLibraryGrid
          frequencies={filteredFrequencies}
          chakraFilter={chakraFilter}
          principleFilter={principleFilter}
        />
      )}
    </div>
  );
};

export default FrequencyLibrary;
