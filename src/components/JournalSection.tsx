
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define the JournalEntry type to match our database structure
type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  tag: string | null;
  created_at: string;
};

const JournalSection: React.FC = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchJournalEntries = async () => {
    try {
      // Use a more specific type cast to PostgrestQueryBuilder
      const { data, error } = await (supabase
        .from('timeline_snapshots') as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching journal entries:", error);
        return;
      }
      
      setEntries(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your journal entry");
      return;
    }
    
    if (!user) {
      toast.error("Please sign in to save journal entries");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use a more specific type cast to PostgrestQueryBuilder
      const { error } = await (supabase
        .from('timeline_snapshots') as any)
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            notes: notes.trim() || null,
            tag: tag.trim() || null
          }
        ]);
        
      if (error) {
        console.error("Error saving journal entry:", error);
        toast.error("Failed to save journal entry");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Journal entry saved");
      setTitle("");
      setNotes("");
      setTag("");
      fetchJournalEntries();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-center">
          <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Journey Journal</h3>
          <p className="text-gray-600 mb-4">Sign in to track your healing journey and save journal entries</p>
          <Button 
            onClick={() => window.location.href = "/auth"}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            Sign In to Journal
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Journey Journal</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Today's insight"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="tag">Tag (optional)</Label>
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Insight, Breakthrough, Pattern"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Journal Entry</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write about your experience, insights, or feelings..."
                className="w-full min-h-[120px]"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                {isSubmitting ? "Saving..." : "Save Journal Entry"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading journal entries...</p>
        </div>
      ) : entries.length > 0 ? (
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Recent Entries</h3>
            
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {entry.tag && (
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {entry.tag}
                      </span>
                    </div>
                  )}
                  
                  {entry.notes && (
                    <p className="mt-2 text-gray-600 text-sm">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No journal entries yet. Start tracking your journey!</p>
        </div>
      )}
    </div>
  );
};

export default JournalSection;
