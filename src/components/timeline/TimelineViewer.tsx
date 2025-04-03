import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  BookOpen,
  Tag,
  ArrowRight,
  Edit,
  Music,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import EditEntryDialog from "./EditEntryDialog";
import AudioPreview from "./AudioPreview";

interface TimelineEntry {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  tag: string;
  tags?: string[];
  journal?: string;
  session_id?: string;
  frequency?: number;
  chakra?: string;
  visual_type?: string;
  intention?: string;
  created_at: string;
  updated_at: string;
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uniqueFrequencies, setUniqueFrequencies] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  const allTags = React.useMemo(() => {
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
      session_id: entry.session_id || undefined
    }));
  };

  const fetchTimelineEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
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

      const processedEntries = processJournalEntries(entriesData);

      const frequencies = new Set<number>();
      processedEntries.forEach(entry => {
        if (entry.frequency) {
          frequencies.add(entry.frequency);
        }
      });
      setUniqueFrequencies(frequencies);

      setEntries(processedEntries);

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
      const { data, error } = await supabase
        .from("music_generations")
        .select("id, music_url, frequency, user_id")
        .eq("user_id", user.id)
        .not("music_url", "is", null);

      if (error) {
        console.error("Error fetching music generations:", error);
        return;
      }

      const musicMap: Record<string, MusicGeneration> = {};
      
      if (data && Array.isArray(data)) {
        entries.forEach(entry => {
          if (entry.frequency) {
            const matchingMusic = data.find(item => 
              item.frequency === entry.frequency && 
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

  const handleFilterByTag = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter(null);
    } else {
      setActiveFilter(tag);
    }
  };

  const handleFilterByFrequency = (value: string) => {
    setFrequencyFilter(value);
  };

  const filteredEntries = React.useMemo(() => {
    let filtered = activeFilter 
      ? entries.filter(entry => 
          entry.tag === activeFilter || 
          (entry.tags && entry.tags.includes(activeFilter))
        )
      : entries;
    
    if (frequencyFilter !== "all") {
      const frequencyValue = parseFloat(frequencyFilter);
      filtered = filtered.filter(entry => entry.frequency === frequencyValue);
    }
    
    return filtered;
  }, [entries, activeFilter, frequencyFilter]);

  const handleRevisitJourney = (entry: TimelineEntry) => {
    if (entry.frequency) {
      navigate(`/journey/${entry.frequency}`);
    } else {
      navigate("/music-generation");
      toast.success("Ready to create a new frequency journey");
    }
  };

  const handleEditEntry = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const truncateText = (text: string | null, maxLength: number = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const journalInsights = React.useMemo(() => {
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
      if (entry.journal) {
        const lowerJournal = entry.journal.toLowerCase();
        Object.keys(themes).forEach(theme => {
          if (lowerJournal.includes(theme)) {
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
        `Most of your saved moments relate to ${sortedThemes.join(" and ")}.`
      );
    }
    
    if (themes.chakra > 0) {
      insights.push("Want to revisit your chakra alignment work?");
    }
    
    if (uniqueFrequencies.size > 0) {
      const mostFrequentHz = Array.from(uniqueFrequencies)[0];
      insights.push(`You've created ${entries.filter(e => e.frequency === mostFrequentHz).length} entries with ${mostFrequentHz}Hz frequency.`);
    }
    
    return insights;
  }, [entries, uniqueFrequencies]);

  if (!user) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Frequency Timeline
          </h3>
          <p className="text-gray-600 mb-4">Sign in to view your frequency journey timeline</p>
          <Button 
            onClick={() => navigate("/auth")}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            Sign In to View Timeline
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          My Frequency Timeline
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {uniqueFrequencies.size > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                value={frequencyFilter}
                onValueChange={handleFilterByFrequency}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  {Array.from(uniqueFrequencies).map(freq => (
                    <SelectItem key={freq} value={String(freq)}>
                      {freq}Hz
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 self-center">Tags:</span>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={activeFilter === tag ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeFilter === tag 
                      ? "bg-purple-500 hover:bg-purple-600" 
                      : "hover:bg-purple-100"
                  }`}
                  onClick={() => handleFilterByTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {journalInsights.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-purple-700">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Insights from Your Journey
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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading your timeline...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-medium mb-4 text-gray-700">
              No Timeline Entries Yet
            </h3>
            <p className="text-gray-600 mb-4">
              {activeFilter || frequencyFilter !== "all"
                ? `No entries found with the current filters. Try another filter or clear current filters.` 
                : "Your frequency journey timeline will appear here after you save moments from your sessions."}
            </p>
            {(activeFilter || frequencyFilter !== "all") && (
              <div className="flex gap-2 justify-center">
                {activeFilter && (
                  <Button 
                    variant="outline"
                    onClick={() => setActiveFilter(null)}
                    className="mt-2"
                  >
                    Clear Tag Filter
                  </Button>
                )}
                {frequencyFilter !== "all" && (
                  <Button 
                    variant="outline"
                    onClick={() => setFrequencyFilter("all")}
                    className="mt-2"
                  >
                    Clear Frequency Filter
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map(entry => (
            <Card key={entry.id} className="border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-gray-800">{entry.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(entry.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {entry.frequency && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {entry.frequency}Hz
                      </Badge>
                    )}
                    
                    {entry.tag && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                        {entry.tag}
                      </Badge>
                    )}
                    
                    {entry.tags && Array.isArray(entry.tags) && entry.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-gray-600">
                    {entry.notes && (
                      <p className="mb-2">{truncateText(entry.notes)}</p>
                    )}
                    
                    {entry.journal && (
                      <div className="mt-4">
                        <div className="flex items-center text-purple-700 text-sm mb-2">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>Journal Entry</span>
                        </div>
                        <p className="text-gray-600">{truncateText(entry.journal)}</p>
                        {entry.journal.length > 150 && (
                          <button 
                            className="text-purple-600 text-sm mt-2 hover:underline focus:outline-none"
                            onClick={() => {
                              toast(entry.title, {
                                description: entry.journal,
                                duration: 10000,
                              });
                            }}
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {musicGenerations[entry.id] && (
                    <AudioPreview 
                      audioUrl={musicGenerations[entry.id].music_url} 
                      title={entry.title}
                    />
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={() => handleRevisitJourney(entry)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Revisit Journey
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => handleEditEntry(entry)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
