import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSavedFrequency } from "@/types/frequencies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import FrequencyCard from "./FrequencyCard";
import { Bookmark } from "lucide-react";

const SavedFrequenciesViewer = () => {
  const { user } = useAuth();

  // Fetch user's saved frequencies
  const { data: savedFrequencies, isLoading, error } = useQuery({
    queryKey: ["saved-frequencies", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_saved_frequencies")
        .select(`
          *,
          frequency:frequency_id(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as UserSavedFrequency[];
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Please sign in to view your saved frequencies.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading saved frequencies...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">Error loading saved frequencies: {(error as Error).message}</div>;
  }

  if (!savedFrequencies || savedFrequencies.length === 0) {
    return (
      <div className="text-center py-8">
        <Bookmark className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">You haven't saved any frequencies yet.</p>
        <p className="text-gray-400 text-sm">
          Browse the frequency library and save your favorites to access them quickly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedFrequencies.map(saved => (
            saved.frequency && (
              <FrequencyCard 
                key={saved.id} 
                frequency={saved.frequency} 
                savedId={saved.id} 
                notes={saved.notes} 
              />
            )
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SavedFrequenciesViewer;
