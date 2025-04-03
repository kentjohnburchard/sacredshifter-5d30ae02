
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { supabase } from "@/integrations/supabase/client";
import { formatDuration } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

export const JourneyTemplatesGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: frequencies, isLoading, error } = useQuery({
    queryKey: ["frequency-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frequency_library")
        .select("*")
        .order("frequency");

      if (error) throw error;
      return data as FrequencyLibraryItem[];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-2 bg-gray-200" />
            <CardContent className="p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="bg-gray-50 px-5 py-3">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading frequency journeys. Please try again later.
      </div>
    );
  }

  if (!frequencies || frequencies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No frequency journey templates are available at this time.
      </div>
    );
  }

  // Function to get color gradient based on chakra
  const getChakraGradient = (chakra: string) => {
    switch (chakra.toLowerCase()) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {frequencies.map((frequency) => (
        <Card key={frequency.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className={`h-2 bg-gradient-to-r ${getChakraGradient(frequency.chakra)}`} />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{frequency.title}</h3>
                <p className="text-sm text-indigo-600 font-medium">{frequency.frequency} Hz</p>
              </div>
              <Badge className="bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 border-indigo-200">
                {frequency.chakra} Chakra
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mt-3 line-clamp-3">{frequency.description}</p>
            
            {frequency.tags && frequency.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {frequency.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
                {frequency.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    +{frequency.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            {frequency.length && (
              <div className="mt-3 text-xs text-gray-500 flex items-center">
                <span className="inline-block">Duration: {formatDuration(frequency.length)}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 px-5 py-3">
            <Button 
              onClick={() => navigate(`/journey/${frequency.frequency}`)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              Start Journey
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default JourneyTemplatesGrid;
