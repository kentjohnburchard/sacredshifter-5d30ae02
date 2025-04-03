
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ElementalProfileProps {
  dominantElement: string;
}

export const ElementalProfile: React.FC<ElementalProfileProps> = ({ dominantElement }) => {
  // Calculate elemental distribution based on dominant element
  const getElementalValues = () => {
    const baseValues = {
      Fire: 25,
      Earth: 25,
      Air: 25,
      Water: 25,
    };
    
    // Increase dominant element and redistribute
    const boost = 30;
    const reduction = boost / 3;
    
    return {
      Fire: baseValues.Fire + (dominantElement === "Fire" ? boost : -reduction),
      Earth: baseValues.Earth + (dominantElement === "Earth" ? boost : -reduction),
      Air: baseValues.Air + (dominantElement === "Air" ? boost : -reduction),
      Water: baseValues.Water + (dominantElement === "Water" ? boost : -reduction),
    };
  };
  
  const elements = getElementalValues();
  
  const getElementColor = (element: string) => {
    switch (element) {
      case "Fire": return "bg-red-500";
      case "Earth": return "bg-green-500";
      case "Air": return "bg-blue-300";
      case "Water": return "bg-blue-600";
      default: return "bg-gray-500";
    }
  };
  
  const getElementDescription = (element: string) => {
    switch (element) {
      case "Fire":
        return "Fire represents passion, energy, and creativity. You're drawn to transformation and change.";
      case "Earth":
        return "Earth represents stability, practicality, and reliability. You value security and tangible results.";
      case "Air":
        return "Air represents intellect, communication, and social connections. You thrive on ideas and information.";
      case "Water":
        return "Water represents emotions, intuition, and empathy. You're deeply attuned to feelings and subtle energies.";
      default:
        return "";
    }
  };
  
  const getRecommendedFrequencies = (element: string) => {
    switch (element) {
      case "Fire":
        return [396, 528, 741];
      case "Earth":
        return [174, 417, 639];
      case "Air":
        return [285, 528, 852];
      case "Water":
        return [174, 396, 639];
      default:
        return [528];
    }
  };
  
  return (
    <Card className="border-purple-100 dark:border-purple-900/20">
      <CardHeader>
        <CardTitle>Elemental Profile</CardTitle>
        <CardDescription>Your energetic composition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(elements).map(([element, value]) => (
            <div key={element} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{element}</span>
                <span>{Math.round(value)}%</span>
              </div>
              <Progress 
                value={value} 
                className="h-2" 
                indicatorClassName={getElementColor(element)} 
              />
            </div>
          ))}
        </div>
        
        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 space-y-3">
          <h4 className="font-medium">Your Dominant Element: {dominantElement}</h4>
          <p className="text-sm text-muted-foreground">{getElementDescription(dominantElement)}</p>
          
          <div className="pt-2">
            <h5 className="text-sm font-medium mb-2">Recommended Frequencies:</h5>
            <div className="flex flex-wrap gap-2">
              {getRecommendedFrequencies(dominantElement).map(freq => (
                <div key={freq} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs shadow-sm">
                  {freq} Hz
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
