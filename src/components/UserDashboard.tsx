
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Music, PlayCircle, Calendar, BarChart2, Headphones, RefreshCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

type JournalEntry = {
  id: string;
  title: string;
  notes: string | null;
  tag: string | null;
  created_at: string;
};

type MusicGeneration = {
  id: string;
  title: string | null;
  intention: string;
  frequency: number;
  audio_url?: string | null; 
  music_url?: string | null; 
  created_at: string | null;
};

const JournalCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  return (
    <Card className="overflow-hidden h-full border border-purple-100 dark:border-purple-900/50 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{entry.title}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {new Date(entry.created_at).toLocaleDateString()}
          </span>
        </div>
        {entry.tag && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full">
            {entry.tag}
          </span>
        )}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {entry.notes ? (
          entry.notes.length > 100 ? `${entry.notes.substring(0, 100)}...` : entry.notes
        ) : (
          <span className="italic">No content</span>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
};

const SoundJourneyCard: React.FC<{ generation: MusicGeneration }> = ({ generation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Get the appropriate audio URL (handle both audio_url and music_url properties)
  const audioUrl = generation.audio_url || generation.music_url;

  return (
    <Card className="overflow-hidden h-full border border-indigo-100 dark:border-indigo-900/50 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{generation.title || "Untitled Journey"}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {generation.created_at ? new Date(generation.created_at).toLocaleDateString() : "Date unknown"}
          </span>
        </div>
        <CardDescription className="text-xs">
          Frequency: {generation.frequency} Hz - {generation.intention}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {audioUrl ? (
          <div className="mt-2">
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <>
                  <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></span>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  <span>Play</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Audio not available</p>
        )}
      </CardContent>
    </Card>
  );
};

const UserStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="border border-purple-100 dark:border-purple-900/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Journal Entries</p>
        </CardContent>
      </Card>
      <Card className="border border-indigo-100 dark:border-indigo-900/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Music className="h-8 w-8 text-indigo-600 mb-2" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">Sound Journeys</p>
        </CardContent>
      </Card>
      <Card className="border border-violet-100 dark:border-violet-900/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Clock className="h-8 w-8 text-violet-600 mb-2" />
          <p className="text-2xl font-bold">5.2</p>
          <p className="text-xs text-muted-foreground">Hours Listened</p>
        </CardContent>
      </Card>
      <Card className="border border-blue-100 dark:border-blue-900/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Calendar className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">28</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </CardContent>
      </Card>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [soundJourneys, setSoundJourneys] = useState<MusicGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for manual refreshing

  useEffect(() => {
    if (user) {
      fetchUserContent();
    } else {
      setLoading(false);
    }
  }, [user, refreshKey]); // Adding refreshKey to dependencies

  const fetchUserContent = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching dashboard data for user:", user?.id);
      
      // Explicitly add user_id to the query to ensure we only get entries for the current user
      const { data: journalData, error: journalError } = await supabase
        .from('timeline_snapshots')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (journalError) {
        console.error("Error fetching journal entries:", journalError);
        throw journalError;
      }
      
      const { data: musicData, error: musicError } = await supabase
        .from('music_generations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (musicError) {
        console.error("Error fetching music data:", musicError);
        throw musicError;
      }
      
      console.log("Journal entries fetched:", journalData?.length || 0, journalData);
      setJournalEntries(journalData || []);
      
      // Map the music_generations data to MusicGeneration type
      const formattedMusicData = (musicData || []).map(item => ({
        id: item.id,
        title: item.title,
        intention: item.intention || "",
        frequency: item.frequency || 0,
        music_url: item.music_url,
        created_at: item.created_at
      }));
      
      setSoundJourneys(formattedMusicData);
      console.log("Music generations fetched:", formattedMusicData.length || 0);
    } catch (error: any) {
      console.error("Error fetching user content:", error.message);
      toast.error("Failed to load your content");
    } finally {
      setLoading(false);
    }
  };
  
  // Add a function to manually refresh the data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>
            Please sign in to view your dashboard
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => window.location.href = "/auth"}
            className="w-full"
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Soul Journey Dashboard
          </h2>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
        
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemAnimation}>
            <UserStats />
          </motion.div>
        </motion.div>
      </div>
      
      <Separator />
      
      <div>
        <Tabs defaultValue="journal">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Frequency Journal</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Sound Journeys</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="journal">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : journalEntries.length > 0 ? (
              <motion.div 
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {journalEntries.map((entry) => (
                  <motion.div key={entry.id} variants={itemAnimation}>
                    <JournalCard entry={entry} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Journal Entries Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your spiritual journey by recording your thoughts and experiences.
                </p>
                <Button>Create Journal Entry</Button>
              </div>
            )}
            
            {journalEntries.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline">View All Journal Entries</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="music">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : soundJourneys.length > 0 ? (
              <motion.div 
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {soundJourneys.map((journey) => (
                  <motion.div key={journey.id} variants={itemAnimation}>
                    <SoundJourneyCard generation={journey} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Sound Journeys Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first sound journey to start your healing experience.
                </p>
                <Button>Create Sound Journey</Button>
              </div>
            )}
            
            {soundJourneys.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline">View All Sound Journeys</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                We're working on providing insights and analytics for your spiritual journey.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
