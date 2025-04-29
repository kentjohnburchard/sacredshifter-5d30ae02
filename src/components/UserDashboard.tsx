import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, Music, Clock, Heart, Calendar, ArrowRight, Lightbulb, Activity 
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoveDashboard from "@/components/heart-center/LoveDashboard";
import SacredIdentityCard from "@/components/dashboard/SacredIdentityCard";
import LightbearerStatsCard from "@/components/dashboard/LightbearerStatsCard";

interface Intention {
  id: string;
  intention: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [journalCount, setJournalCount] = useState(0);
  const [journeysCount, setJourneysCount] = useState(0);
  const [hoursListened, setHoursListened] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);
  const [activeTab, setActiveTab] = useState("main");
  const [intentions, setIntentions] = useState<{ text: string, date: string }[]>([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        const { data: timelineEntries, error: timelineError } = await supabase
          .from('timeline_snapshots')
          .select('id')
          .eq('user_id', user.id);
          
        if (timelineError) throw timelineError;
        if (timelineEntries) {
          setJournalCount(timelineEntries.length);
        }

        const { data: musicJourneyData, error: journeyError } = await supabase
          .from('sessions')
          .select('id')
          .eq('user_id', user.id);
          
        if (journeyError) throw journeyError;
        if (musicJourneyData) {
          const journeysCount = musicJourneyData.length;
          setJourneysCount(journeysCount);
        }

        const { data: musicData, error: musicError } = await supabase
          .from('music_generations')
          .select('id')
          .eq('user_id', user.id);
          
        if (musicError) throw musicError;
        
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('id, created_at, updated_at')
          .eq('user_id', user.id);
          
        if (sessionError) throw sessionError;
        
        let totalListeningMinutes = 0;
        
        if (musicData) {
          totalListeningMinutes += musicData.length * 5;
        }
        
        if (sessionData) {
          sessionData.forEach((session: any) => {
            if (session.created_at && session.updated_at) {
              const startTime = new Date(session.created_at).getTime();
              const endTime = new Date(session.updated_at).getTime();
              const durationMinutes = (endTime - startTime) / (1000 * 60);
              
              if (durationMinutes >= 1 && durationMinutes <= 120) {
                totalListeningMinutes += durationMinutes;
              } else {
                totalListeningMinutes += 10;
              }
            } else {
              totalListeningMinutes += 10;
            }
          });
        }
        
        setHoursListened(Math.round(totalListeningMinutes / 60 * 10) / 10);
        
        const { data: intentionData, error: intentionError } = await supabase
          .from('user_intentions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (intentionError) {
          console.error("Error fetching intentions:", intentionError);
        } else if (intentionData && intentionData.length > 0) {
          const formattedIntentions = intentionData.map((item: any) => ({
            text: item.intention,
            date: new Date(item.created_at).toLocaleDateString()
          }));
          setIntentions(formattedIntentions);
        }
        
        const { data: activityData, error: activityError } = await supabase
          .from('timeline_snapshots')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!activityError && activityData && activityData.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const activityDays = new Set();
          activityData.forEach((item: any) => {
            const activityDate = new Date(item.created_at);
            activityDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 3600 * 24));
            if (daysDiff >= 0 && daysDiff < 7) {
              activityDays.add(daysDiff);
            }
          });
          
          setDayStreak(activityDays.size);
        }
        
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast.error("Failed to load user statistics");
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Soul Journey Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your spiritual home. Track your journey and continue your practice.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="main">Main Dashboard</TabsTrigger>
          <TabsTrigger value="heart">Heart Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-0 space-y-8">
          {/* Sacred Identity and Lightbearer Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SacredIdentityCard />
            <LightbearerStatsCard />
          </div>
          
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
                {intentions.length > 0 ? (
                  intentions.map((intention, idx) => (
                    <div key={idx} className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-gray-800">{intention.text}</p>
                      <p className="text-xs text-gray-500 mt-1">Set on {intention.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No intentions set yet</p>
                    <Link to="/intentions">
                      <Button variant="outline" size="sm" className="mt-2">
                        Set Your First Intention
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
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
            
            <Link to="/music-library">
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
        </TabsContent>

        <TabsContent value="heart" className="mt-0">
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              Heart Center Dashboard
            </h2>
            <LoveDashboard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
