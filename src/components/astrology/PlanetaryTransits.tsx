
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const PlanetaryTransits: React.FC = () => {
  // Mock data for planets in transit
  const transits = [
    {
      planet: "Jupiter",
      sign: "Taurus",
      house: 2,
      aspect: "Trine",
      intensity: 85,
      influence: "Expansion and growth in finances and material resources",
      color: "bg-yellow-500"
    },
    {
      planet: "Saturn",
      sign: "Pisces",
      house: 12,
      aspect: "Square",
      intensity: 60,
      influence: "Discipline and structure in your subconscious mind",
      color: "bg-blue-800"
    },
    {
      planet: "Mars",
      sign: "Gemini",
      house: 3,
      aspect: "Conjunction",
      intensity: 75,
      influence: "Energizing your communication and learning abilities",
      color: "bg-red-600"
    },
    {
      planet: "Venus",
      sign: "Cancer",
      house: 4,
      aspect: "Sextile",
      intensity: 50,
      influence: "Harmony and pleasure in your home and family life",
      color: "bg-green-400"
    },
    {
      planet: "Mercury",
      sign: "Leo",
      house: 5,
      aspect: "Opposition",
      intensity: 65,
      influence: "Enhanced thinking and expression in creative pursuits",
      color: "bg-purple-500"
    }
  ];
  
  // Get the major transit (highest intensity)
  const majorTransit = [...transits].sort((a, b) => b.intensity - a.intensity)[0];
  
  // Get frequency recommendation based on transit
  const getRecommendedFrequency = (planet: string) => {
    const frequencies: Record<string, number> = {
      "Sun": 528,
      "Moon": 396,
      "Mercury": 285,
      "Venus": 639,
      "Mars": 741,
      "Jupiter": 417,
      "Saturn": 174,
      "Uranus": 852,
      "Neptune": 369,
      "Pluto": 963
    };
    
    return frequencies[planet] || 528;
  };
  
  return (
    <div className="grid gap-6">
      <Card className="border-purple-100 dark:border-purple-900/20">
        <CardHeader>
          <CardTitle>Current Planetary Transits</CardTitle>
          <CardDescription>How cosmic movements are influencing your energetic field</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {transits.map((transit) => (
            <div key={transit.planet} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{transit.planet} in {transit.sign}</h4>
                  <p className="text-sm text-muted-foreground">
                    House {transit.house} • {transit.aspect} aspect
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {transit.intensity}%
                </span>
              </div>
              
              <Progress 
                value={transit.intensity} 
                className={`h-2 ${transit.color}`}
              />
              
              <p className="text-sm text-muted-foreground">
                {transit.influence}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="border-purple-100 dark:border-purple-900/20 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/40">
        <CardHeader>
          <CardTitle>Major Transit: {majorTransit.planet} in {majorTransit.sign}</CardTitle>
          <CardDescription>Focus on this energy for optimal alignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              {majorTransit.planet} is currently in {majorTransit.sign}, creating a {majorTransit.aspect.toLowerCase()} aspect 
              that influences your {getOrdinal(majorTransit.house)} house of life. This transit is particularly 
              significant at {majorTransit.intensity}% intensity.
            </p>
            
            <div className="p-4 bg-white/80 dark:bg-gray-800/30 rounded-lg space-y-3">
              <h4 className="font-medium">Recommended Focus:</h4>
              <p className="text-sm">{majorTransit.influence}</p>
              
              <div>
                <h5 className="text-sm font-medium mb-2">Suggested Frequency:</h5>
                <div className="inline-block px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm shadow-sm">
                  {getRecommendedFrequency(majorTransit.planet)} Hz
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get ordinal number
function getOrdinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
