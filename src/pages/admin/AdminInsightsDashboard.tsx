
import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, BarChart, Activity, FileText, Heart, Users, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { ChakraTag } from '@/types/chakras';
import { toast } from 'sonner';

const AdminInsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('completions');
  
  // Sample data states (would be populated from API calls)
  const [journeyStats, setJourneyStats] = useState<{
    totalStarts: number;
    totalCompletions: number;
    popularJourney: string;
    averageCompletionTime: string;
  }>({
    totalStarts: 0,
    totalCompletions: 0,
    popularJourney: '',
    averageCompletionTime: ''
  });
  
  const [chakraData, setChakraData] = useState<Record<ChakraTag, number>>({} as Record<ChakraTag, number>);
  const [lightbearerStats, setLightbearerStats] = useState<{
    totalUsers: number;
    averageLevel: number;
    levelDistribution: Record<number, number>;
  }>({
    totalUsers: 0,
    averageLevel: 0,
    levelDistribution: {}
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      // Check if user has admin privileges
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();
          
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(!!data);
          }
        } catch (err) {
          console.error('Failed to check admin status:', err);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
    
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);
  
  const fetchDashboardData = async () => {
    // In a real implementation, these would be separate API calls to fetch real data
    
    // Fetch journey stats
    setJourneyStats({
      totalStarts: 1254,
      totalCompletions: 876,
      popularJourney: 'Heart Chakra Activation',
      averageCompletionTime: '18 minutes'
    });
    
    // Fetch chakra engagement data
    setChakraData({
      'Root': 32,
      'Sacral': 28,
      'Solar Plexus': 19,
      'Heart': 38,
      'Throat': 25,
      'Third Eye': 31,
      'Crown': 24,
      'Transpersonal': 12
    });
    
    // Fetch lightbearer progression data
    setLightbearerStats({
      totalUsers: 1876,
      averageLevel: 3.2,
      levelDistribution: {
        1: 45,
        2: 24,
        3: 15,
        4: 8,
        5: 5,
        6: 2,
        7: 1
      }
    });
  };
  
  const handleExport = (dataType: string) => {
    // In a real implementation, this would generate and download the appropriate export
    toast.success(`Exporting ${dataType} data...`);
  };
  
  if (loading) {
    return (
      <PageLayout title="Admin Dashboard">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!isAdmin) {
    return (
      <PageLayout title="Admin Access Required">
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>
                You need administrative privileges to access this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Please contact an administrator if you believe you should have access.</p>
              <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Admin Insights Dashboard">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Admin Insights Dashboard
            </h1>
            <p className="text-muted-foreground">Comprehensive analytics for Sacred Shifter</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => handleExport('dashboard')}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                Journey Starts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{journeyStats.totalStarts.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm">Most popular: {journeyStats.popularJourney}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="mr-2 h-5 w-5 text-purple-500" />
                Journey Completions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{journeyStats.totalCompletions.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm">
                {Math.round((journeyStats.totalCompletions / journeyStats.totalStarts) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-500" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{lightbearerStats.totalUsers.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm">Avg. Lightbearer Level: {lightbearerStats.averageLevel}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="journey-analytics">
          <TabsList className="mb-4">
            <TabsTrigger value="journey-analytics">Journey Analytics</TabsTrigger>
            <TabsTrigger value="chakra-heatmap">Chakra Heatmap</TabsTrigger>
            <TabsTrigger value="lightbearer-progression">Lightbearer Progression</TabsTrigger>
            <TabsTrigger value="prompt-performance">Prompt Performance</TabsTrigger>
            <TabsTrigger value="reflections-analysis">Reflections Analysis</TabsTrigger>
            <TabsTrigger value="timeline-metrics">Timeline Metrics</TabsTrigger>
          </TabsList>
          
          {/* Journey Analytics Tab */}
          <TabsContent value="journey-analytics">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Journey Analytics</CardTitle>
                    <CardDescription>Performance metrics for all journeys</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[180px]">
                        <BarChart className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completions">Completion Rate</SelectItem>
                        <SelectItem value="duration">Average Duration</SelectItem>
                        <SelectItem value="dropoff">Drop-off Points</SelectItem>
                        <SelectItem value="ratings">User Ratings</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={() => handleExport('journey-analytics')}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Mock journey data - would be populated from API */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Heart Chakra Activation</span>
                      <span className="text-sm">86% Completion</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Third Eye Awakening</span>
                      <span className="text-sm">72% Completion</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Root Stability Protocol</span>
                      <span className="text-sm">68% Completion</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Crown Connection</span>
                      <span className="text-sm">63% Completion</span>
                    </div>
                    <Progress value={63} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Throat Chakra Voice Activation</span>
                      <span className="text-sm">59% Completion</span>
                    </div>
                    <Progress value={59} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Journey Completion Trends</h3>
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    {/* This would be replaced with a real chart component */}
                    <p className="text-muted-foreground">Journey completion trend visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Chakra Heatmap Tab */}
          <TabsContent value="chakra-heatmap">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Chakra Engagement Heatmap</CardTitle>
                    <CardDescription>User engagement across chakra energies</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleExport('chakra-heatmap')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chakra engagement bars */}
                  {Object.entries(chakraData).map(([chakra, value]) => (
                    <div key={chakra}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{chakra}</span>
                        <span className="text-sm">{value}% Engagement</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Chakra Activation Timeline</h3>
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    {/* This would be replaced with a real chart component */}
                    <p className="text-muted-foreground">Chakra activation timeline visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Lightbearer Progression Tab */}
          <TabsContent value="lightbearer-progression">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Lightbearer Progression</CardTitle>
                    <CardDescription>User achievement and progression stats</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleExport('lightbearer-data')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Level Distribution</h3>
                    <div className="space-y-4">
                      {Object.entries(lightbearerStats.levelDistribution).map(([level, percentage]) => (
                        <div key={level}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Level {level}</span>
                            <span className="text-sm">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Lightbearer Insights</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="text-3xl font-bold">{lightbearerStats.averageLevel}</div>
                        <div className="text-sm text-muted-foreground">Average Level</div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="text-3xl font-bold">42%</div>
                        <div className="text-sm text-muted-foreground">Monthly Growth</div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="text-3xl font-bold">Heart</div>
                        <div className="text-sm text-muted-foreground">Top Chakra</div>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="text-3xl font-bold">18</div>
                        <div className="text-sm text-muted-foreground">Avg. Days to Level Up</div>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Progression Timeline</h3>
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    {/* This would be replaced with a real chart component */}
                    <p className="text-muted-foreground">Lightbearer progression visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Prompt Performance Tab */}
          <TabsContent value="prompt-performance">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Prompt Performance</CardTitle>
                    <CardDescription>Engagement metrics for all prompts</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleExport('prompt-data')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-2 px-2">Prompt</th>
                        <th className="text-center py-2 px-2">Journey</th>
                        <th className="text-center py-2 px-2">Impressions</th>
                        <th className="text-center py-2 px-2">Engagement</th>
                        <th className="text-center py-2 px-2">Dismiss %</th>
                        <th className="text-center py-2 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {/* Sample prompt data - would come from API */}
                      <tr>
                        <td className="py-3 px-2">Set your heart chakra intention</td>
                        <td className="py-3 px-2 text-center">Heart Activation</td>
                        <td className="py-3 px-2 text-center">1,248</td>
                        <td className="py-3 px-2 text-center">86%</td>
                        <td className="py-3 px-2 text-center">14%</td>
                        <td className="py-3 px-2 text-center">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2">Focus on your third eye</td>
                        <td className="py-3 px-2 text-center">Third Eye Opening</td>
                        <td className="py-3 px-2 text-center">876</td>
                        <td className="py-3 px-2 text-center">72%</td>
                        <td className="py-3 px-2 text-center">28%</td>
                        <td className="py-3 px-2 text-center">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2">Breathe into your root</td>
                        <td className="py-3 px-2 text-center">Root Grounding</td>
                        <td className="py-3 px-2 text-center">654</td>
                        <td className="py-3 px-2 text-center">68%</td>
                        <td className="py-3 px-2 text-center">32%</td>
                        <td className="py-3 px-2 text-center">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2">Connect to cosmic energy</td>
                        <td className="py-3 px-2 text-center">Crown Connection</td>
                        <td className="py-3 px-2 text-center">542</td>
                        <td className="py-3 px-2 text-center">78%</td>
                        <td className="py-3 px-2 text-center">22%</td>
                        <td className="py-3 px-2 text-center">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Prompt Engagement Trends</h3>
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    {/* This would be replaced with a real chart component */}
                    <p className="text-muted-foreground">Prompt engagement visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reflection Analysis Tab */}
          <TabsContent value="reflections-analysis">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Reflection Analysis</CardTitle>
                    <CardDescription>Journal entry and reflection insights</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleExport('reflections-data')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Total Reflections</h3>
                    <div className="text-3xl font-bold">2,456</div>
                    <div className="text-sm text-muted-foreground mt-1">+18% from last month</div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Avg. Length</h3>
                    <div className="text-3xl font-bold">142</div>
                    <div className="text-sm text-muted-foreground mt-1">words per entry</div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Dominant Sentiment</h3>
                    <div className="text-3xl font-bold">Positive</div>
                    <div className="text-sm text-muted-foreground mt-1">76% of entries</div>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Top Themes in Reflections</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-base">Growth</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Healing</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Peace</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Energy</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Balance</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Love</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Transformation</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Insight</Badge>
                    <Badge variant="outline" className="px-3 py-1 text-base">Clarity</Badge>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Recent Anonymized Reflections</h3>
                  <div className="space-y-4">
                    {/* Sample anonymized reflection entries - would come from API */}
                    <Card className="p-4">
                      <p className="italic text-sm mb-2">
                        "I felt a deep connection to my heart center during this journey. The frequencies seemed to resonate perfectly with what I needed today."
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Heart Journey • 2 days ago</span>
                        <span>Anonymous User</span>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <p className="italic text-sm mb-2">
                        "At first I was skeptical about the crown chakra meditation, but halfway through I started feeling a tingling sensation at the top of my head. This is transformative!"
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Crown Connection • 3 days ago</span>
                        <span>Anonymous User</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Timeline Metrics Tab */}
          <TabsContent value="timeline-metrics">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Timeline Metrics</CardTitle>
                    <CardDescription>User actions and journey timeline analysis</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleExport('timeline-data')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Total Actions</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">24,872</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Avg/User</h3>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">14.2</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Peak Time</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">8:00 PM</div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Peak Day</h3>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold mt-2">Sunday</div>
                  </Card>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium mb-4">Top Events by Journey</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-2">Journey</th>
                          <th className="text-center py-2">Event</th>
                          <th className="text-right py-2">Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {/* Sample timeline data - would come from API */}
                        <tr>
                          <td className="py-2">Heart Activation</td>
                          <td className="py-2 text-center">sound_play</td>
                          <td className="py-2 text-right">1,248</td>
                        </tr>
                        <tr>
                          <td className="py-2">Third Eye Opening</td>
                          <td className="py-2 text-center">spiral_toggle</td>
                          <td className="py-2 text-right">876</td>
                        </tr>
                        <tr>
                          <td className="py-2">Root Grounding</td>
                          <td className="py-2 text-center">intention_set</td>
                          <td className="py-2 text-right">654</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-medium mb-4">Daily Activity Distribution</h3>
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    {/* This would be replaced with a real chart component */}
                    <p className="text-muted-foreground">Daily activity timeline visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminInsightsDashboard;
