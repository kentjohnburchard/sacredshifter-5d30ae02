import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Heart, Send, MessageCircle, Calendar, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface LoveStats {
  hugsReceived: number;
  hugsSent: number;
  totalMirrorSessions: number;
  intentionsSet: number;
  favoritePlaylist: string;
  totalListeningTime: number; // in minutes
  streakDays: number;
}

const LoveDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LoveStats>({
    hugsReceived: 0,
    hugsSent: 0,
    totalMirrorSessions: 0,
    intentionsSet: 0,
    favoritePlaylist: "Love Codes",
    totalListeningTime: 0,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);
  
  const calculateLoveLevel = () => {
    const totalActions = 
      stats.hugsReceived + 
      stats.hugsSent + 
      stats.totalMirrorSessions + 
      stats.intentionsSet + 
      Math.floor(stats.totalListeningTime / 30); // Count 30 min as an action
      
    if (totalActions >= 50) return { level: 5, name: "Love Guardian" };
    if (totalActions >= 30) return { level: 4, name: "Heart Alchemist" };
    if (totalActions >= 15) return { level: 3, name: "Soul Nurturer" };
    if (totalActions >= 5) return { level: 2, name: "Heart Explorer" };
    return { level: 1, name: "Love Initiate" };
  };
  
  const loveLevel = calculateLoveLevel();
  const progressPercent = (loveLevel.level / 5) * 100;
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data: hugsData, error: hugsError } = await supabase
          .from('soul_hugs')
          .select('sender_id, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
          
        if (hugsError) throw hugsError;
        
        const { data: mirrorData, error: mirrorError } = await supabase
          .from('mirror_moments')
          .select('id')
          .eq('user_id', user.id);
          
        if (mirrorError) throw mirrorError;
        
        const { data: intentionsData, error: intentionsError } = await supabase
          .from('user_intentions')
          .select('id')
          .eq('user_id', user.id);
          
        if (intentionsError) throw intentionsError;
        
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('id, created_at, updated_at')
          .eq('user_id', user.id);
          
        if (sessionError) throw sessionError;
        
        let totalMinutes = 0;
        
        if (sessionData && sessionData.length > 0) {
          sessionData.forEach((session: any) => {
            if (session.created_at && session.updated_at) {
              const startTime = new Date(session.created_at).getTime();
              const endTime = new Date(session.updated_at).getTime();
              const durationMinutes = (endTime - startTime) / (1000 * 60);
              
              if (durationMinutes >= 1 && durationMinutes <= 120) {
                totalMinutes += durationMinutes;
              } else {
                totalMinutes += 5;
              }
            } else {
              totalMinutes += 5;
            }
          });
        }
        
        const { data: recentActivity, error: recentError } = await supabase
          .from('timeline_snapshots')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        let streakCount = 0;
        if (!recentError && recentActivity && recentActivity.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const activityDays = new Set();
          recentActivity.forEach((item: any) => {
            const activityDate = new Date(item.created_at);
            activityDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 3600 * 24));
            if (daysDiff >= 0 && daysDiff < 7) {
              activityDays.add(daysDiff);
            }
          });
          
          streakCount = activityDays.size;
        }
        
        const { data: frequencyData, error: frequencyError } = await supabase
          .from('sessions')
          .select('frequency_id')
          .eq('user_id', user.id);
          
        let favoritePlaylist = "Love Codes";
        
        if (!frequencyError && frequencyData && frequencyData.length > 0) {
          const frequencyCounts = frequencyData.reduce((acc: any, item: any) => {
            if (item.frequency_id) {
              acc[item.frequency_id] = (acc[item.frequency_id] || 0) + 1;
            }
            return acc;
          }, {});
          
          let maxCount = 0;
          let mostUsedFrequencyId = null;
          
          for (const [freqId, count] of Object.entries(frequencyCounts)) {
            if (Number(count) > maxCount) {
              maxCount = Number(count);
              mostUsedFrequencyId = freqId;
            }
          }
          
          if (mostUsedFrequencyId) {
            const { data: freqData } = await supabase
              .from('frequency_library')
              .select('title')
              .eq('id', mostUsedFrequencyId)
              .single();
              
            if (freqData) {
              favoritePlaylist = freqData.title;
            }
          }
        }
        
        setStats({
          hugsReceived: hugsData?.filter((hug: any) => hug.recipient_id === user.id).length || 0,
          hugsSent: hugsData?.filter((hug: any) => hug.sender_id === user.id).length || 0,
          totalMirrorSessions: mirrorData?.length || 0,
          intentionsSet: intentionsData?.length || 0,
          favoritePlaylist: favoritePlaylist,
          totalListeningTime: totalMinutes,
          streakDays: streakCount
        });
        
      } catch (error) {
        console.error("Error fetching love stats:", error);
        setStats({
          hugsReceived: 0,
          hugsSent: 0,
          totalMirrorSessions: 0,
          intentionsSet: 0,
          favoritePlaylist: "Love Codes",
          totalListeningTime: 0,
          streakDays: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-3" />
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Love Level: {loveLevel.level}</h2>
              <p className="text-pink-600 font-medium">{loveLevel.name}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full mt-2 md:mt-0">
              <Heart className={`h-8 w-8 ${loveLevel.level >= 3 ? 'text-pink-600' : 'text-pink-400'}`} />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-purple-800 mb-1">
              <span>Current Level</span>
              <span>Next Level: {loveLevel.level < 5 ? loveLevel.level + 1 : 'Max'}</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-purple-600" />
          </div>
          
          <p className="text-sm text-purple-700 mt-2">
            {loveLevel.level < 5 
              ? `Continue your heart journey to reach the next level!` 
              : `You've reached the highest level of heart mastery!`}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-pink-50 p-2 rounded-full mb-3">
              <Send className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.hugsSent}</p>
            <p className="text-sm text-purple-700">Hugs Sent</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-pink-50 p-2 rounded-full mb-3">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.hugsReceived}</p>
            <p className="text-sm text-purple-700">Hugs Received</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-pink-50 p-2 rounded-full mb-3">
              <Sparkles className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.totalMirrorSessions}</p>
            <p className="text-sm text-purple-700">Mirror Sessions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-pink-50 p-2 rounded-full mb-3">
              <MessageCircle className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.intentionsSet}</p>
            <p className="text-sm text-purple-700">Intentions Set</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-purple-900 flex items-center mb-3">
              <Clock className="h-4 w-4 mr-2 text-pink-500" />
              Listening Stats
            </h3>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-700">Total Listening Time</span>
                <span className="text-purple-900 font-medium">{Math.floor(stats.totalListeningTime / 60)}h {stats.totalListeningTime % 60}m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Favorite Playlist</span>
                <span className="text-purple-900 font-medium">{stats.favoritePlaylist}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 backdrop-blur-sm border-pink-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-purple-900 flex items-center mb-3">
              <Calendar className="h-4 w-4 mr-2 text-pink-500" />
              Heart Practice
            </h3>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-700">Current Streak</span>
                <span className="text-purple-900 font-medium">{stats.streakDays} days</span>
              </div>
              <div className="flex items-center mt-2 space-x-1">
                {[...Array(7)].map((_, index) => (
                  <div 
                    key={index}
                    className={`h-3 w-3 rounded-full ${
                      index < stats.streakDays 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                        : 'bg-pink-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm border-pink-200 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-purple-900">Share the Love</h3>
            <p className="text-purple-700">Invite others to join your heart-centered journey</p>
          </div>
          
          <Button
            variant="default"
            className="bg-gradient-to-r from-pink-500 to-purple-600"
            onClick={() => {
              navigator.clipboard.writeText("https://sacredshifter.app/heart");
              alert("Link copied to clipboard!");
            }}
          >
            <Heart className="mr-2 h-4 w-4" />
            Share Sacred Shifter
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default LoveDashboard;
