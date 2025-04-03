import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarClock, Cloud, Moon, MoveUpRight, Sun } from "lucide-react";
import { format } from "date-fns";

export const DailyHoroscope: React.FC = () => {
  const { user } = useAuth();
  const [signData, setSignData] = useState<{ sun_sign: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSign, setSelectedSign] = useState<string>("");
  const [timeframe, setTimeframe] = useState<string>("daily");
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUserSignData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_astrology_data')
          .select('sun_sign')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.sun_sign) {
          setSignData(data);
          setSelectedSign(data.sun_sign);
        }
      } catch (error) {
        console.error("Error fetching sign data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserSignData();
  }, [user]);
  
  const horoscopeData = {
    daily: generateHoroscope(selectedSign, "daily"),
    weekly: generateHoroscope(selectedSign, "weekly"),
    monthly: generateHoroscope(selectedSign, "monthly")
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Astrological Guidance
        </h2>
        
        <div className="flex items-center gap-2">
          <Select value={selectedSign} onValueChange={setSelectedSign}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aries">Aries</SelectItem>
              <SelectItem value="Taurus">Taurus</SelectItem>
              <SelectItem value="Gemini">Gemini</SelectItem>
              <SelectItem value="Cancer">Cancer</SelectItem>
              <SelectItem value="Leo">Leo</SelectItem>
              <SelectItem value="Virgo">Virgo</SelectItem>
              <SelectItem value="Libra">Libra</SelectItem>
              <SelectItem value="Scorpio">Scorpio</SelectItem>
              <SelectItem value="Sagittarius">Sagittarius</SelectItem>
              <SelectItem value="Capricorn">Capricorn</SelectItem>
              <SelectItem value="Aquarius">Aquarius</SelectItem>
              <SelectItem value="Pisces">Pisces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={timeframe} onValueChange={setTimeframe}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Daily</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Weekly</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>Monthly</span>
          </TabsTrigger>
        </TabsList>
        
        {Object.entries(horoscopeData).map(([period, data]) => (
          <TabsContent key={period} value={period} className="mt-0">
            <Card className="border-indigo-100 dark:border-indigo-900/20">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedSign} {period.charAt(0).toUpperCase() + period.slice(1)} Horoscope
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarClock className="h-3 w-3" />
                      <span>{format(new Date(), "MMMM d, yyyy")}</span>
                    </CardDescription>
                  </div>
                  <div className="text-3xl">{getZodiacSymbol(selectedSign)}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Overview</h3>
                  <p className="text-muted-foreground">{data.overview}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Love & Relationships</h4>
                      <p className="text-sm text-muted-foreground">{data.love}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Career & Money</h4>
                      <p className="text-sm text-muted-foreground">{data.career}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Health & Wellness</h4>
                      <p className="text-sm text-muted-foreground">{data.health}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Affirmation</h4>
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg text-center italic">
                      "{data.affirmation}"
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Suggested Sound Journey</h4>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <MoveUpRight className="h-4 w-4" />
                      <span>Start Your {selectedSign} Sound Journey</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper function to generate horoscope content
function generateHoroscope(sign: string, period: string) {
  const baseHoroscopes: Record<string, any> = {
    "Aries": {
      daily: {
        overview: "Today is all about initiative and new beginnings. Your natural leadership is highlighted, and others will look to you for direction.",
        love: "Be direct about your feelings, but avoid being too impulsive in romantic matters.",
        career: "An opportunity to take charge of a project presents itself. Your confidence will carry you through.",
        health: "Channel excess energy into physical activity to avoid restlessness.",
        affirmation: "I courageously take action and lead with confidence."
      },
      weekly: {
        overview: "This week brings a surge of creative energy and drive. You'll find yourself motivated to tackle long-standing projects.",
        love: "Your passionate nature is heightened, making this an excellent time for romantic pursuits.",
        career: "Focus on independent projects where you can showcase your innovative thinking.",
        health: "Balance high-intensity activities with adequate rest to prevent burnout.",
        affirmation: "I balance my fiery energy with patience and strategic action."
      },
      monthly: {
        overview: "This month emphasizes personal growth and self-discovery. Long-term goals come into focus, and you'll find clarity on your path forward.",
        love: "Relationships deepen through honest communication and shared experiences.",
        career: "Your pioneering spirit leads to recognition from superiors. Don't be afraid to propose bold ideas.",
        health: "Establish a sustainable fitness routine that you can maintain throughout the month.",
        affirmation: "I am the architect of my destiny, creating with boldness and clarity."
      }
    },
    // Simplified for brevity - in a real app, we'd have entries for all signs
  };
  
  // If we have predefined content for this sign, use it
  if (baseHoroscopes[sign] && baseHoroscopes[sign][period]) {
    return baseHoroscopes[sign][period];
  }
  
  // Otherwise generate generic content
  return {
    overview: `This ${period} brings important shifts in energy for ${sign}. Pay attention to your intuition as it will guide you through any challenges.`,
    love: `Your relationships benefit from open communication. Express your needs clearly and listen actively to others.`,
    career: `Focus on long-term goals rather than immediate results. Your patience will be rewarded.`,
    health: `Take time for self-care and restoration. Balance is key to maintaining your energy.`,
    affirmation: `I trust the rhythm of life and flow with the cosmic energies that support my highest good.`
  };
}

function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    "Aries": "♈",
    "Taurus": "♉",
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
  };
  
  return symbols[sign] || "★";
}
