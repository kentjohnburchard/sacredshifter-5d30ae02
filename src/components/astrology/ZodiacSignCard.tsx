
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface ZodiacSignCardProps {
  sign: string;
}

export const ZodiacSignCard: React.FC<ZodiacSignCardProps> = ({ sign }) => {
  const getSignDetails = (sign: string) => {
    const details: Record<string, any> = {
      "Aries": {
        symbol: "♈",
        element: "Fire",
        color: "red",
        frequency: 396,
        description: "Energetic and dynamic sound journey to ignite your passion and courage."
      },
      "Taurus": {
        symbol: "♉",
        element: "Earth",
        color: "green",
        frequency: 417,
        description: "Grounding frequencies to connect with stability and sensuality."
      },
      "Gemini": {
        symbol: "♊",
        element: "Air",
        color: "yellow",
        frequency: 528,
        description: "Dual-tone journey to enhance communication and mental agility."
      },
      "Cancer": {
        symbol: "♋",
        element: "Water",
        color: "silver",
        frequency: 639,
        description: "Flowing melodies to nurture emotional healing and intuition."
      },
      "Leo": {
        symbol: "♌",
        element: "Fire",
        color: "gold",
        frequency: 741,
        description: "Majestic frequencies to amplify your confidence and creative expression."
      },
      "Virgo": {
        symbol: "♍",
        element: "Earth",
        color: "brown",
        frequency: 174,
        description: "Precise tones to enhance analytical skills and purification."
      },
      "Libra": {
        symbol: "♎",
        element: "Air",
        color: "blue",
        frequency: 285,
        description: "Harmonizing frequencies for balance, beauty, and relationship healing."
      },
      "Scorpio": {
        symbol: "♏",
        element: "Water",
        color: "maroon",
        frequency: 396,
        description: "Intense transformative sounds to unlock your deepest power."
      },
      "Sagittarius": {
        symbol: "♐",
        element: "Fire",
        color: "purple",
        frequency: 528,
        description: "Expansive frequencies to inspire adventure and philosophical insight."
      },
      "Capricorn": {
        symbol: "♑",
        element: "Earth",
        color: "black",
        frequency: 174,
        description: "Structured soundscape for ambition, discipline, and manifestation."
      },
      "Aquarius": {
        symbol: "♒",
        element: "Air",
        color: "electric-blue",
        frequency: 852,
        description: "Innovative frequencies to stimulate revolutionary thinking and community."
      },
      "Pisces": {
        symbol: "♓",
        element: "Water",
        color: "sea-green",
        frequency: 639,
        description: "Mystical tones to deepen spiritual connection and compassion."
      }
    };
    
    return details[sign] || {
      symbol: "★",
      element: "Universal",
      color: "purple",
      frequency: 528,
      description: "Harmonizing frequencies for balance and healing."
    };
  };
  
  const details = getSignDetails(sign);
  
  const getElementColor = (element: string) => {
    switch (element) {
      case "Fire": return "from-red-400 to-orange-400";
      case "Earth": return "from-green-400 to-emerald-400";
      case "Air": return "from-blue-400 to-cyan-400";
      case "Water": return "from-indigo-400 to-blue-400";
      default: return "from-purple-400 to-violet-400";
    }
  };
  
  const bgGradient = getElementColor(details.element);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all group">
      <CardHeader className={`p-4 bg-gradient-to-r ${bgGradient} text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{sign}</h3>
          <span className="text-2xl">{details.symbol}</span>
        </div>
        <p className="text-xs opacity-90">{details.element} Element</p>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{details.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-medium">Frequency:</span>
          <span className="text-xs">{details.frequency} Hz</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full gap-2 group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <PlayCircle className="h-4 w-4" />
          <span>Play Journey</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
