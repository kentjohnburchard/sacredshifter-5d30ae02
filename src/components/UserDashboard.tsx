
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Heart, LineChart, ArrowRight, Clock, HeartPulse, CheckCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

// Define the Intention interface to match our database schema
interface Intention {
  id: string;
  intention: string;
  title: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [journalCount, setJournalCount] = useState(0);
  const [journeysCount, setJourneysCount] = useState(0);
  const [hoursListened, setHoursListened] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);
  const [intentions, setIntentions] = useState<{ text: string, date: string }[]>([]);

  // Fetch user statistics from Supabase
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        // Fetch timeline entries (as a replacement for journal entries)
        const { data: timelineEntries, error: timelineError } = await supabase
          .from('timeline_snapshots')
          .select('id')
          .eq('user_id', user.id);
          
        if (timelineError) throw timelineError;
        setJournalCount(timelineEntries?.length || 0);

        // Fetch music generations (as a replacement for sound journeys)
        const { data: musicData, error: musicError } = await supabase
          .from('music_generations')
          .select('id')
          .eq('user_id', user.id);
          
        if (musicError) throw musicError;
        setJourneysCount(musicData?.length || 0);
        
        // Calculate listening time from music generations
        // Assuming each session is around 5 minutes
        setHoursListened(Math.round((musicData?.length || 0) * 5 / 60 * 10) / 10);
        
        // Get user's intentions
        const { data: intentionData, error: intentionError } = await supabase
          .from('user_intentions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (intentionError) {
          console.error("Error fetching intentions:", intentionError);
          return;
        }
        
        if (intentionData && intentionData.length > 0) {
          // Transform the data to match our display format
          const formattedIntentions = intentionData.map(item => ({
            text: item.intention,
            date: new Date(item.created_at).toLocaleDateString()
          }));
          setIntentions(formattedIntentions);
        }
        
        // Set streak to a random value between 1-7 for now 
        // In the future this should be calculated from actual user activity
        setDayStreak(Math.floor(Math.random() * 7) + 1);
        
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast.error("Error loading dashboard data");
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Dashboard header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Soul Journey Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your spiritual home. Track your journey and continue your practice.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journalCount}</div>
            <p className="text-xs text-muted-foreground">
              Reflections of your inner journey
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sound Journeys</CardTitle>
            <Music className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journeysCount}</div>
            <p className="text-xs text-muted-foreground">
              Vibrational experiences completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Listened</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoursListened}</div>
            <p className="text-xs text-muted-foreground">
              Time in sacred sound space
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
            <HeartPulse className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStreak}</div>
            <p className="text-xs text-muted-foreground">
              Consistent spiritual practice
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Intentions Display */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
            Recent Intentions
          </CardTitle>
          <Link to="/intentions">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {intentions.length > 0 ? (
            <div className="space-y-3">
              {intentions.map((intention, idx) => (
                <div key={idx} className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-100">
                  <p className="text-gray-700">{intention.text}</p>
                  <p className="text-xs text-gray-500 mt-1">Set on {intention.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No intentions set yet</p>
              <Link to="/intentions">
                <Button variant="outline" size="sm" className="mt-2">
                  Set Your First Intention
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/energy-check">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-purple-500" />
                Energy Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check in with your vibrational state and receive a personalized frequency match.
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                Start Check <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/frequency-library">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5 text-indigo-500" />
                Frequency Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore healing frequencies for different purposes and intentions.
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                Browse Library <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/timeline">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your spiritual journey and track your progress over time.
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                View Timeline <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Vibrational chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="mr-2 h-5 w-5 text-green-500" />
            Your Vibrational Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center bg-muted/20">
          <p className="text-center text-muted-foreground">
            Vibrational patterns visualization coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
