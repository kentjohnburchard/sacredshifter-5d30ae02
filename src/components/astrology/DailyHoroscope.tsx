
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Define the local type
interface UserSign {
  sun_sign?: string;
}

export const DailyHoroscope: React.FC = () => {
  const { user } = useAuth();
  const [userSign, setUserSign] = useState<UserSign>({ sun_sign: undefined });
  const [horoscope, setHoroscope] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (user) {
      const fetchUserSign = async () => {
        try {
          const { data, error } = await supabase
            .from('user_astrology_data' as any)
            .select('sun_sign')
            .eq('user_id', user.id)
            .single();
            
          if (data && !error) {
            setUserSign(data as UserSign);
            
            // Generate horoscope based on sun sign (this would ideally come from an API)
            if (data.sun_sign) {
              generateHoroscope(data.sun_sign);
            } else {
              setHoroscope("Complete your astrological profile to see your daily horoscope.");
              setLoading(false);
            }
          } else {
            setHoroscope("Complete your astrological profile to see your daily horoscope.");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user sign:", error);
          setHoroscope("Unable to load your horoscope at this time.");
          setLoading(false);
        }
      };
      
      fetchUserSign();
    } else {
      setHoroscope("Sign in to view your personalized daily horoscope.");
      setLoading(false);
    }
  }, [user]);
  
  const generateHoroscope = (sign: string) => {
    // In a real app, this would call an API
    const horoscopes: {[key: string]: string} = {
      "Aries": "Today's energy brings exciting opportunities for growth. Trust your instincts and lead with courage.",
      "Taurus": "Focus on stability and self-care today. Small pleasures will bring great satisfaction.",
      "Gemini": "Your communication skills shine today. Meaningful conversations lead to valuable insights.",
      "Cancer": "Emotional clarity arrives with the moon's influence. Nurture your inner world and closest relationships.",
      "Leo": "Creative energy surrounds you today. Express yourself boldly and inspire those around you.",
      "Virgo": "Details matter today. Your analytical mind helps solve a long-standing problem.",
      "Libra": "Harmony in relationships comes easily today. Balance your needs with those of others.",
      "Scorpio": "Transformation is underway. Release what no longer serves you and embrace your power.",
      "Sagittarius": "Adventure calls today. Expand your horizons through learning or exploration.",
      "Capricorn": "Progress toward goals accelerates today. Your discipline brings tangible results.",
      "Aquarius": "Innovation flows easily today. Your unique perspective offers solutions others miss.",
      "Pisces": "Intuition is heightened today. Trust the guidance of your inner voice and creative impulses."
    };
    
    setHoroscope(horoscopes[sign] || "Your cosmic guidance is being written in the stars.");
    setLoading(false);
  };

  return (
    <Card className="overflow-hidden border border-purple-100/50 dark:border-purple-900/20">
      <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardTitle className="text-center text-2xl">
          Daily Cosmic Guidance
          {userSign.sun_sign && <span className="block text-lg text-indigo-600/80 mt-1">{userSign.sun_sign}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <p className="text-lg leading-relaxed">{horoscope}</p>
        )}
      </CardContent>
    </Card>
  );
};
