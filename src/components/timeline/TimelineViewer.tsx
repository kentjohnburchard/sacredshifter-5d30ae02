
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Calendar, BookOpen, Tag, ArrowRight, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";

interface TimelineEntry {
  id: string;
  title: string;
  notes: string | null;
  tag: string | null;
  tags: string[] | null;
  journal: string | null;
  created_at: string;
  session_id: string | null;
}

const TimelineViewer: React.FC = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract all unique tags from entries
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    
    entries.forEach(entry => {
      // Handle both 'tag' string and 'tags' array
      if (entry.tag) {
        tagSet.add(entry.tag);
      }
      
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet);
  }, [entries]);

  const fetchTimelineEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("timeline_snapshots")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching timeline entries:", error);
        toast.error("Failed to load timeline entries");
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while loading your timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineEntries();
  }, [user]);

  const handleFilterByTag = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter(null); // Clear the filter if already active
    } else {
      setActiveFilter(tag); // Set the new filter
    }
  };

  const filteredEntries = activeFilter 
    ? entries.filter(entry => 
        entry.tag === activeFilter || 
        (entry.tags && entry.tags.includes(activeFilter))
      )
    : entries;

  const handleRevisitJourney = (entry: TimelineEntry) => {
    // Navigate to music generation page with the session frequency
    navigate("/music-generation");
    toast.success("Ready to revisit your frequency journey");
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
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center mr-1">Filter:</span>
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
              {activeFilter 
                ? `No entries found with the tag "${activeFilter}". Try another filter or clear the current one.` 
                : "Your frequency journey timeline will appear here after you save moments from your sessions."}
            </p>
            {activeFilter && (
              <Button 
                variant="outline"
                onClick={() => setActiveFilter(null)}
                className="mt-2"
              >
                Clear Filter
              </Button>
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
                  
                  <div className="flex flex-wrap gap-2">
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
                              // Display full journal text
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
                      onClick={() => {
                        // Navigate to edit page or show edit modal
                        toast.info("Edit functionality coming soon!");
                      }}
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
    </div>
  );
};

export default TimelineViewer;
