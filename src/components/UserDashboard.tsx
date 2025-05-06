
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import JourneyActivitySection from '@/components/dashboard/JourneyActivitySection';
import RecommendationsPanel from '@/components/guidance/RecommendationsPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, BookOpen, Activity, LineChart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LightbearerStatsCard from './dashboard/LightbearerStatsCard';
import DailyPracticeButton from './daily-practice/DailyPracticeButton';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Welcome, {user?.email?.split('@')[0] || 'Sacred Shifter'}
            </CardTitle>
            <DailyPracticeButton />
          </div>
          <CardDescription>
            Track your sacred journey, visualize your frequency shifts, and explore your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-4 flex items-center">
              <User className="h-10 w-10 text-purple-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-white">Profile</h3>
                <p className="text-xs text-gray-400">Sacred Shifter</p>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 flex items-center">
              <Calendar className="h-10 w-10 text-purple-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-white">Journey Entries</h3>
                <p className="text-xs text-gray-400">View your progress</p>
              </div>
            </div>
            <Link to="/sacred-blueprint" className="bg-black/30 rounded-lg p-4 flex items-center hover:bg-black/40 transition-colors">
              <BookOpen className="h-10 w-10 text-purple-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-white">Sacred Blueprint</h3>
                <p className="text-xs text-gray-400">Explore your blueprint</p>
              </div>
            </Link>
            <Link to="/cosmic-blueprint" className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 flex items-center hover:from-purple-900/40 hover:to-indigo-900/40 transition-colors">
              <Sparkles className="h-10 w-10 text-indigo-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-white">Cosmic Blueprint</h3>
                <p className="text-xs text-gray-400">Explore your cosmic identity</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JourneyActivitySection />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <LightbearerStatsCard />
          <RecommendationsPanel />
          
          <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-purple-400" />
                Vibrational Progress
              </CardTitle>
              <CardDescription>Track your frequency evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full h-32 flex items-center justify-center border border-dashed border-gray-700 rounded-md bg-black/40 mb-4">
                  <p className="text-sm text-gray-500">Frequency tracking coming soon</p>
                </div>
                <Tabs defaultValue="week" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
