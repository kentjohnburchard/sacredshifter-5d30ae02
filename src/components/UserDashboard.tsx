
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Music, Clock, Heart, Calendar, ArrowRight, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Intention {
  id: string;
  intention: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [journalCount, setJournalCount] = useState(6);
  const [journeysCount, setJourneysCount] = useState(0);
  const [hoursListened, setHoursListened] = useState(0);
  const [dayStreak, setDayStreak] = useState(1);
  const [intentions, setIntentions] = useState<{ text: string, date: string }[]>([
    { text: "I am aligned with my highest purpose today", date: "8/4/2025" }
  ]);

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
        if (timelineEntries?.length) {
          setJournalCount(timelineEntries.length);
        }

        // Fetch music generations (as a replacement for sound journeys)
        const { data: musicData, error: musicError } = await supabase
          .from('music_generations')
          .select('id')
          .eq('user_id', user.id);
          
        if (musicError) throw musicError;
        if (musicData?.length) {
          setJourneysCount(musicData.length);
          // Calculate listening time from music generations
          setHoursListened(Math.round((musicData.length) * 5 / 60 * 10) / 10);
        }
        
        // Get user's intentions
        const { data: intentionData, error: intentionError } = await supabase
          .from('user_intentions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (intentionError) {
          console.error("Error fetching intentions:", intentionError);
        } else if (intentionData && intentionData.length > 0) {
          // Transform the data to match our display format
          const formattedIntentions = intentionData.map((item: any) => ({
            text: item.intention,
            date: new Date(item.created_at).toLocaleDateString()
          }));
          setIntentions(formattedIntentions);
        }
        
      } catch (error) {
        console.error("Error fetching user stats:", error);
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
      
      {/* Stats Overview - Formatted to match the screenshot */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <CheckCircle className="text-purple-600" size={18} />
              <span className="text-sm font-medium text-gray-600">Journal Entries</span>
            </div>
            <div className="text-3xl font-bold mb-1">{journalCount}</div>
            <p className="text-xs text-gray-500">Reflections of your inner journey</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <Music className="text-purple-600" size={18} />
              <span className="text-sm font-medium text-gray-600">Sound Journeys</span>
            </div>
            <div className="text-3xl font-bold mb-1">{journeysCount}</div>
            <p className="text-xs text-gray-500">Vibrational experiences completed</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <Clock className="text-purple-600" size={18} />
              <span className="text-sm font-medium text-gray-600">Hours Listened</span>
            </div>
            <div className="text-3xl font-bold mb-1">{hoursListened}</div>
            <p className="text-xs text-gray-500">Time in sacred sound space</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <Heart className="text-purple-600" size={18} />
              <span className="text-sm font-medium text-gray-600">Day Streak</span>
            </div>
            <div className="text-3xl font-bold mb-1">{dayStreak}</div>
            <p className="text-xs text-gray-500">Consistent spiritual practice</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Intentions */}
      <Card className="border rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
            <CardTitle className="text-xl font-medium">Recent Intentions</CardTitle>
          </div>
          <Link to="/intentions">
            <Button variant="ghost" size="sm" className="text-purple-600">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-3">
            {intentions.map((intention, idx) => (
              <div key={idx} className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-800">{intention.text}</p>
                <p className="text-xs text-gray-500 mt-1">Set on {intention.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Energy Check */}
        <Link to="/energy-check">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Heart className="text-purple-600 mr-2" size={20} />
                <h3 className="text-lg font-medium">Energy Check</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Check in with your vibrational state and receive a personalized frequency match.
              </p>
              <Button variant="ghost" size="sm" className="text-purple-600">
                Start Check <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        {/* Frequency Library */}
        <Link to="/frequency-library">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Music className="text-purple-600 mr-2" size={20} />
                <h3 className="text-lg font-medium">Frequency Library</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Explore healing frequencies for different purposes and intentions.
              </p>
              <Button variant="ghost" size="sm" className="text-purple-600">
                Browse Library <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
        
        {/* Timeline */}
        <Link to="/timeline">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-purple-600 mr-2" size={20} />
                <h3 className="text-lg font-medium">Timeline</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                View your spiritual journey and track your progress over time.
              </p>
              <Button variant="ghost" size="sm" className="text-purple-600">
                View Timeline <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Vibrational Journey */}
      <Card className="border rounded-lg">
        <CardHeader className="flex items-center p-6">
          <CardTitle className="text-xl font-medium flex items-center">
            <Activity className="mr-2 h-5 w-5 text-green-500" />
            Your Vibrational Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="h-60 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-500">
              Vibrational patterns visualization coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
