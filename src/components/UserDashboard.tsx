
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Heart, LineChart, ArrowRight, Clock, HeartPulse, CheckCircle } from "lucide-react";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [journalCount, setJournalCount] = useState(0);
  const [journeysCount, setJourneysCount] = useState(0);
  const [hoursListened, setHoursListened] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);

  // Fetch user statistics from Supabase
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        // Fetch journal entries count
        const { data: journalEntries, error: journalError } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id);
          
        if (journalError) throw journalError;
        setJournalCount(journalEntries?.length || 0);

        // Fetch sound journeys count
        const { data: soundJourneys, error: journeysError } = await supabase
          .from('sound_journeys')
          .select('id')
          .eq('user_id', user.id);
          
        if (journeysError) throw journeysError;
        setJourneysCount(soundJourneys?.length || 0);
        
        // Fetch listening time (simplified calculation)
        const { data: listeningData, error: listeningError } = await supabase
          .from('listening_sessions')
          .select('duration')
          .eq('user_id', user.id);
          
        if (listeningError) throw listeningError;
        
        // Calculate total hours (assuming duration is stored in minutes)
        const totalMinutes = listeningData?.reduce((acc, session) => acc + (session.duration || 0), 0) || 0;
        setHoursListened(Math.round(totalMinutes / 60 * 10) / 10); // Round to 1 decimal place
        
        // Calculate day streak (simplified)
        const { data: streakData, error: streakError } = await supabase
          .rpc('calculate_user_streak', { user_id: user.id });
          
        if (streakError) {
          console.error("Error fetching streak:", streakError);
          setDayStreak(0);
        } else {
          setDayStreak(streakData || 0);
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
        
        <Link to="/journal-entry">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Document your spiritual experiences and track your growth over time.
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                New Entry <ArrowRight className="ml-1 h-4 w-4" />
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
