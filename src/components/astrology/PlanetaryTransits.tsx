
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, AlertCircle, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PlanetaryTransits: React.FC = () => {
  const [view, setView] = useState("current");
  
  // Current transits (simplified for demo)
  const currentTransits = [
    {
      planet: "Mercury",
      sign: "Libra",
      retrograde: false,
      impact: "Communication flows smoothly in your relationships. Express your ideas with confidence.",
      intensity: 65
    },
    {
      planet: "Venus",
      sign: "Scorpio",
      retrograde: false,
      impact: "Deep emotional connections are highlighted. Passion and intensity characterize your relationships.",
      intensity: 78
    },
    {
      planet: "Mars",
      sign: "Capricorn",
      retrograde: false,
      impact: "Your ambition and drive are heightened. Channel your energy into structured, purposeful action.",
      intensity: 82
    },
    {
      planet: "Jupiter",
      sign: "Taurus",
      retrograde: false,
      impact: "Expansion in material resources and comfort. A good time for financial growth and stability.",
      intensity: 70
    },
    {
      planet: "Saturn",
      sign: "Pisces",
      retrograde: true,
      impact: "Review your spiritual practices and creative boundaries. Restructuring is necessary.",
      intensity: 88
    }
  ];
  
  // Upcoming significant transits
  const upcomingTransits = [
    {
      title: "Mercury Retrograde",
      date: "Begins in 12 days",
      impact: "Communication challenges may arise. Back up data and be clear in your messaging.",
      alert: true
    },
    {
      title: "Venus enters Sagittarius",
      date: "In 8 days",
      impact: "Relationships take on a more adventurous tone. Exploration and freedom in love are highlighted.",
      alert: false
    },
    {
      title: "Full Moon in Aries",
      date: "In 4 days",
      impact: "Emotional culmination around personal identity and self-expression. Breakthrough moments are possible.",
      alert: false
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Cosmic Alignments
      </h2>
      
      <Tabs value={view} onValueChange={setView}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">Current Transits</TabsTrigger>
          <TabsTrigger value="upcoming">Coming Soon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-0">
          {/* Mercury Retrograde Alert if applicable */}
          {currentTransits.some(t => t.planet === "Mercury" && t.retrograde) && (
            <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-500">Mercury Retrograde in Progress</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Communication misunderstandings are more likely during this period. 
                Double-check important messages and be patient with technology issues.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTransits.map((transit) => (
              <Card key={transit.planet} className={`border-${transit.retrograde ? 'amber' : 'indigo'}-100 dark:border-${transit.retrograde ? 'amber' : 'indigo'}-900/20`}>
                <CardHeader className={`pb-2 ${transit.retrograde ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-indigo-50 dark:bg-indigo-950/30'}`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{transit.planet} in {transit.sign}</CardTitle>
                    {transit.retrograde && (
                      <Badge variant="outline" className="border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-500">
                        Retrograde
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm mb-4">{transit.impact}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Impact Intensity</span>
                      <span>{transit.intensity}%</span>
                    </div>
                    <Progress 
                      value={transit.intensity} 
                      className="h-2" 
                      indicatorClassName={transit.retrograde ? 'bg-amber-500' : 'bg-indigo-500'} 
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`mt-4 w-full gap-2 ${
                      transit.retrograde 
                        ? 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800' 
                        : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                    }`}
                  >
                    <Play className="h-3 w-3" />
                    <span>Harmonizing Sound Journey</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6 border-purple-100 dark:border-purple-900/20">
            <CardHeader>
              <CardTitle>Navigating Current Transits</CardTitle>
              <CardDescription>Cosmic guidance for this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The current planetary alignments suggest a period of introspection balanced with practical action. 
                  With Saturn retrograde in Pisces, there's a call to review and restructure your spiritual practices 
                  and creative boundaries.
                </p>
                <p>
                  Meanwhile, Mars in Capricorn provides the disciplined energy needed to make concrete progress 
                  on your goals. This is an excellent time to channel your inspiration into structured efforts.
                </p>
                <div className="flex justify-center mt-4">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                    Get Personalized Transit Reading
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          <Card className="border-purple-100 dark:border-purple-900/20 mb-6">
            <CardHeader>
              <CardTitle>Upcoming Cosmic Events</CardTitle>
              <CardDescription>Prepare for these astrological shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTransits.map((transit, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    transit.alert 
                      ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' 
                      : 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{transit.title}</h3>
                      <Badge variant="outline" className={transit.alert 
                        ? 'border-amber-200 text-amber-700' 
                        : 'border-indigo-200 text-indigo-700'
                      }>
                        {transit.date}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transit.impact}</p>
                    
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`gap-2 ${
                          transit.alert 
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800' 
                            : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                        }`}
                      >
                        <InfoIcon className="h-3 w-3" />
                        <span>Preparation Guide</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/20">
            <InfoIcon className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-700 dark:text-purple-400">
              <p className="font-medium">Cosmic Calendar</p>
              <p className="text-sm">
                Set up notifications for important astrological events and receive personalized 
                guidance for navigating these cosmic shifts.
              </p>
              <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                Enable Notifications
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};
