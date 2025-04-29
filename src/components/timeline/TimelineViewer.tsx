
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen,
  Tag,
  ArrowRight,
  Edit,
  Music,
  Filter,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import EditEntryDialog from "./EditEntryDialog";
import TimelineEntryCard, { TimelineEntryProps } from "./TimelineEntryCard";
import FiltersBar from "./FiltersBar";
import ToggleView from "./ToggleView";
import SpiralView from "./SpiralView";
import { Badge } from "@/components/ui/badge";

type ViewMode = 'vertical' | 'spiral';

interface TimelineEntry {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  tag: string | null;
  tags?: string[];
  journal?: string;
  session_id?: string | null;
  frequency?: number | null;
  chakra?: string | null;
  visual_type?: string | null;
  intention?: string | null;
  created_at: string;
  updated_at: string;
  entry_type?: 'journal' | 'journey' | 'music' | 'intention';
}

interface MusicGeneration {
  id: string;
  music_url: string;
  frequency: number;
  session_id?: string | null;
}

const TimelineViewer: React.FC = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [musicGenerations, setMusicGenerations] = useState<Record<string, MusicGeneration>>({});
  const [loading, setLoading] = useState(true);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeFrequencyFilter, setActiveFrequencyFilter] = useState<string>("all");
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uniqueFrequencies, setUniqueFrequencies] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract all unique tags from the entries
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    
    entries.forEach(entry => {
      if (entry.tag) {
        tagSet.add(entry.tag);
      }
      
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet);
  }, [entries]);

  const processJournalEntries = (rawEntries: any[]): TimelineEntry[] => {
    return rawEntries.map(entry => ({
      ...entry,
      tags: entry.tags || [],
      journal: entry.notes || '',
      session_id: entry.session_id || undefined,
      // Determine entry type based on available fields
      entry_type: entry.session_id ? 'journey' : 
                 entry.frequency && entry.frequency > 0 ? 'music' : 
                 entry.intention ? 'intention' : 'journal'
    }));
  };

  const fetchTimelineEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching timeline entries for user:", user.id);
      
      // Fetch timeline snapshots
      const { data: entriesData, error: entriesError } = await supabase
        .from("timeline_snapshots")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (entriesError) {
        console.error("Error fetching timeline entries:", entriesError);
        toast.error("Failed to load timeline entries");
        return;
      }

      console.log("Timeline entries fetched:", entriesData?.length || 0);
      const processedEntries = processJournalEntries(entriesData || []);

      // Extract unique frequencies
      const frequencies = new Set<number>();
      processedEntries.forEach(entry => {
        if (entry.frequency) {
          frequencies.add(entry.frequency);
        }
      });
      setUniqueFrequencies(frequencies);
      setEntries(processedEntries);

      // Fetch music generation data for entries with frequencies
      const frequenciesWithData = processedEntries
        .filter(e => e.frequency)
        .map(e => e.frequency as number);
        
      if (frequenciesWithData.length > 0) {
        fetchMusicGenerations(frequenciesWithData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading your timeline");
    } finally {
      setLoading(false);
    }
  };

  const fetchMusicGenerations = async (frequencies: number[]) => {
    if (!frequencies.length || !user?.id) return;
    
    try {
      console.log("Fetching music generations for frequencies:", frequencies);
      const { data, error } = await supabase
        .from("music_generations")
        .select("id, music_url, frequency, user_id")
        .eq("user_id", user.id)
        .in("frequency", frequencies)
        .not("music_url", "is", null);

      if (error) {
        console.error("Error fetching music generations:", error);
        return;
      }

      console.log("Music generations fetched:", data?.length || 0);

      const musicMap: Record<string, MusicGeneration> = {};
      
      if (data && Array.isArray(data)) {
        entries.forEach(entry => {
          if (entry.frequency) {
            const matchingMusic = data.find(item => 
              Math.abs(item.frequency - entry.frequency) < 0.1 &&
              item.music_url
            );
            
            if (matchingMusic) {
              musicMap[entry.id] = {
                id: matchingMusic.id,
                music_url: matchingMusic.music_url,
                frequency: matchingMusic.frequency
              };
            }
          }
        });
      }

      setMusicGenerations(musicMap);
    } catch (error) {
      console.error("Error fetching music data:", error);
    }
  };

  useEffect(() => {
    fetchTimelineEntries();
  }, [user]);

  // Filter entries based on active filters
  const filteredEntries = useMemo(() => {
    let filtered = entries;
    
    // Filter by tag
    if (activeTagFilter) {
      filtered = filtered.filter(entry => 
        entry.tag === activeTagFilter || 
        (entry.tags && entry.tags.includes(activeTagFilter))
      );
    }
    
    // Filter by frequency
    if (activeFrequencyFilter !== "all") {
      const frequencyValue = parseFloat(activeFrequencyFilter);
      filtered = filtered.filter(entry => entry.frequency === frequencyValue);
    }
    
    // Filter by type
    if (activeTypeFilter) {
      filtered = filtered.filter(entry => entry.entry_type === activeTypeFilter);
    }
    
    return filtered;
  }, [entries, activeTagFilter, activeFrequencyFilter, activeTypeFilter]);

  const handleRevisitJourney = (entry: TimelineEntry) => {
    if (entry.frequency) {
      navigate(`/journey/${entry.frequency}`);
    } else {
      navigate("/music-generation");
      toast.success("Ready to create a new frequency journey");
    }
  };

  const handleEditEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setIsEditDialogOpen(true);
    }
  };

  // Map entries to the TimelineEntryProps format
  const entryProps: TimelineEntryProps[] = useMemo(() => {
    return filteredEntries.map(entry => ({
      id: entry.id,
      title: entry.title,
      created_at: entry.created_at,
      notes: entry.notes,
      type: entry.entry_type || 'journal',
      tag: entry.tag,
      tags: entry.tags,
      frequency: entry.frequency,
      chakra: entry.chakra,
      audioUrl: entry.id in musicGenerations ? musicGenerations[entry.id].music_url : null,
      onEdit: handleEditEntry,
      onAction: (id: string) => handleRevisitJourney(entries.find(e => e.id === id) as TimelineEntry),
      actionLabel: "Revisit Journey"
    }));
  }, [filteredEntries, musicGenerations]);

  // Analyze user patterns and generate insights
  const journalInsights = useMemo(() => {
    if (entries.length < 3) return [];
    
    const themes: Record<string, number> = {
      healing: 0,
      transformation: 0,
      clarity: 0,
      energy: 0,
      balance: 0,
      chakra: 0,
      meditation: 0,
      spiritual: 0,
      peace: 0,
    };
    
    entries.forEach(entry => {
      if (entry.notes) {
        const lowerNotes = entry.notes.toLowerCase();
        Object.keys(themes).forEach(theme => {
          if (lowerNotes.includes(theme)) {
            themes[theme]++;
          }
        });
      }
    });
    
    const sortedThemes = Object.entries(themes)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([theme]) => theme);
    
    const insights: string[] = [];
    if (sortedThemes.length > 0) {
      insights.push(
        `Your sacred journey often focuses on ${sortedThemes.join(" and ")}.`
      );
    }
    
    if (themes.chakra > 0) {
      insights.push("You've been exploring chakra alignment in your practice.");
    }
    
    if (uniqueFrequencies.size > 0) {
      const mostFrequentHz = Array.from(uniqueFrequencies)[0];
      const entriesWithFrequency = entries.filter(e => e.frequency === mostFrequentHz).length;
      
      if (entriesWithFrequency > 1) {
        insights.push(`Your spirit resonates with ${mostFrequentHz}Hz frequency (${entriesWithFrequency} entries).`);
      }
    }
    
    return insights;
  }, [entries, uniqueFrequencies]);

  if (!user) {
    return (
      <Card className="border border-gray-700 bg-gray-900/50 shadow-lg">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Sacred Timeline
          </h3>
          <p className="text-gray-400 mb-4">Sign in to view your cosmic evolution timeline</p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Begin Your Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Your Cosmic Timeline
        </h2>
      </div>

      {journalInsights.length > 0 && (
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4 text-purple-200">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sacred Journey Insights
          </h3>
          <ul className="space-y-1 text-sm">
            {journalInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!loading && (
        <>
          <FiltersBar 
            tags={allTags}
            frequencies={Array.from(uniqueFrequencies)}
            onTagFilter={setActiveTagFilter}
            onFrequencyFilter={setActiveFrequencyFilter}
            onTypeFilter={setActiveTypeFilter}
            activeTagFilter={activeTagFilter}
            activeFrequencyFilter={activeFrequencyFilter}
            activeTypeFilter={activeTypeFilter}
          />
          
          <ToggleView 
            viewMode={viewMode}
            onViewChange={setViewMode}
          />
        </>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-48 bg-gray-800/50 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-800/30 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-800/30 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="border border-gray-700 bg-gray-900/50 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-medium mb-4 text-gray-200">
              No Timeline Entries Yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              {activeTagFilter || activeFrequencyFilter !== "all" || activeTypeFilter
                ? `No entries found with the current filters. Try adjusting your filters or clear them to see all entries.` 
                : "Your cosmic journey timeline will appear here after you save moments from your sacred experiences."}
            </p>
            {(activeTagFilter || activeFrequencyFilter !== "all" || activeTypeFilter) && (
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveTagFilter(null);
                    setActiveFrequencyFilter("all");
                    setActiveTypeFilter(null);
                  }}
                  className="border-purple-500/30 text-purple-200"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            
            <div className="mt-8 p-6 border border-purple-500/20 rounded-lg bg-purple-950/20 max-w-md mx-auto">
              <h4 className="text-lg font-medium mb-3 text-purple-200">Begin Your Sacred Timeline</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Capture soul-aligned moments by:
              </p>
              <ul className="text-sm text-left space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <span>Completing frequency journeys in the Sound Explorer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <span>Setting intentions and reflecting on your experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <span>Creating frequency-aligned music and meditations</span>
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/music-generation")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full"
              >
                Start a Frequency Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'vertical' ? (
            <motion.div 
              key="vertical"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {entryProps.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TimelineEntryCard {...entry} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="spiral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SpiralView entries={entryProps} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <EditEntryDialog
        entry={editingEntry}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEntryUpdated={fetchTimelineEntries}
      />
    </div>
  );
};

export default TimelineViewer;
