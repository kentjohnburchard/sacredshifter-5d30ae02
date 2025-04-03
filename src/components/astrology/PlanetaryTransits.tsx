
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar } from "lucide-react";

export const PlanetaryTransits: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for transits - in a real app, this would be calculated based on current planetary positions
  const transits = [
    {
      planet: "Mercury",
      sign: "Gemini",
      startDate: "2025-04-01",
      endDate: "2025-04-20",
      description: "Communication flows easily. A good time for writing and learning.",
      impact: 75,
      isRetrograde: false,
      element: "Air"
    },
    {
      planet: "Venus",
      sign: "Taurus",
      startDate: "2025-03-15",
      endDate: "2025-04-10",
      description: "Harmonious energy for relationships and finances. Enjoy simple pleasures.",
      impact: 60,
      isRetrograde: false,
      element: "Earth"
    },
    {
      planet: "Mars",
      sign: "Aries",
      startDate: "2025-04-02",
      endDate: "2025-05-15",
      description: "Dynamic energy boosts your drive and motivation. Channel it productively.",
      impact: 80,
      isRetrograde: false,
      element: "Fire"
    },
    {
      planet: "Jupiter",
      sign: "Pisces",
      startDate: "2025-01-25",
      endDate: "2025-06-10",
      description: "Spiritual growth and creative inspiration. Trust your intuition.",
      impact: 65,
      isRetrograde: false,
      element: "Water"
    }
  ];
  
  const getPlanetColor = (element: string, isRetrograde: boolean) => {
    if (isRetrograde) return "bg-purple-400";
    
    switch (element) {
      case "Fire": return "bg-red-500";
      case "Earth": return "bg-green-500";
      case "Air": return "bg-blue-400";
      case "Water": return "bg-blue-600";
      default: return "bg-indigo-500";
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (!user) {
    return (
      <Card className="overflow-hidden border border-purple-100/50 dark:border-purple-900/20">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardTitle>Current Cosmic Transits</CardTitle>
          <CardDescription>Sign in to see how planetary movements affect your energy</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center">Please sign in to view current planetary transits and their influence on your chart.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border border-purple-100/50 dark:border-purple-900/20">
      <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardTitle>Current Cosmic Transits</CardTitle>
        <CardDescription>Key planetary movements affecting your energy</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {transits.map((transit, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{transit.planet} in {transit.sign}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDate(transit.startDate)} - {formatDate(transit.endDate)}</span>
                    {transit.isRetrograde && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                        Retrograde
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{transit.element}</span>
                </div>
              </div>
              
              <p className="text-sm">{transit.description}</p>
              
              <div className="pt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Impact</span>
                  <span>{transit.impact}%</span>
                </div>
                <Progress 
                  value={transit.impact} 
                  className="h-1.5" 
                  className={getPlanetColor(transit.element, transit.isRetrograde)} 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
