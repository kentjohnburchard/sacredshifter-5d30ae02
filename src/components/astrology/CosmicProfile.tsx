import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchDailyHoroscope, AztroResponse } from "@/utils/astro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Clock, Hash, Droplet, Palette, Heart } from "lucide-react";
import { toast } from "sonner";

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const CosmicProfile: React.FC = () => {
  const { user } = useAuth();
  const [userSign, setUserSign] = useState<string>("Leo");
  const [horoscope, setHoroscope] = useState<AztroResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSignData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_astrology_data')
        .select('sun_sign')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching user sign:", error);
        throw error;
      }
      
      if (data && data.sun_sign) {
        setUserSign(data.sun_sign);
      }
    } catch (error) {
      console.error("Error fetching user sign:", error);
      toast.error("Unable to load your profile data");
    }
  };

  useEffect(() => {
    fetchUserSignData();
  }, [user]);

  useEffect(() => {
    const getHoroscope = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDailyHoroscope(userSign.toLowerCase());
        setHoroscope(data);
        setFetchComplete(true);
      } catch (error) {
        console.error("Error fetching horoscope:", error);
        setError("Unable to fetch cosmic insights. Please try again later.");
        toast.error("Cosmic insights temporarily unavailable");
      } finally {
        setLoading(false);
      }
    };

    getHoroscope();
  }, [userSign]);

  const handleSignChange = (value: string) => {
    setUserSign(value);
    setFetchComplete(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200/20 via-indigo-100/10 to-transparent"></div>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <Card className="overflow-hidden border-purple-100 dark:border-purple-900/20 backdrop-blur-sm bg-white/80 dark:bg-black/40">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl md:text-3xl font-light">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-medium">
                Cosmic Insights
              </span>
            </CardTitle>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardDescription className="text-sm md:text-base">
              Daily guidance from the celestial plane
            </CardDescription>
            
            <Select value={userSign} onValueChange={handleSignChange}>
              <SelectTrigger className="w-[130px] bg-white/50 dark:bg-black/30 border-purple-100 dark:border-purple-900/30">
                <SelectValue placeholder="Select Sign" />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-16">
              {error}
            </div>
          ) : fetchComplete && horoscope ? (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <motion.div variants={item} className="text-center">
                <h3 className="text-lg md:text-xl font-medium text-indigo-800 dark:text-indigo-300">
                  {userSign} • {horoscope?.date_range}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {horoscope?.current_date}
                </p>
              </motion.div>

              <motion.div variants={item} className="text-center">
                <p className="text-lg leading-relaxed">{horoscope?.description}</p>
              </motion.div>
              
              <motion.div variants={item}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg flex items-center">
                    <Droplet className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Today's Mood</p>
                      <p className="font-medium">{horoscope?.mood}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg flex items-center">
                    <Palette className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lucky Color</p>
                      <p className="font-medium">{horoscope?.color}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg flex items-center">
                    <Heart className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Compatibility</p>
                      <p className="font-medium">{horoscope?.compatibility}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg flex items-center">
                    <Hash className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lucky Number</p>
                      <p className="font-medium">{horoscope?.lucky_number}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg flex items-center col-span-1 md:col-span-1">
                    <Clock className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lucky Time</p>
                      <p className="font-medium">{horoscope?.lucky_time}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="mt-6 p-4 border border-purple-100 dark:border-purple-800/30 rounded-lg bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" /> 
                    <span>Recommended Frequency</span>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Based on your cosmic alignment today, try meditating with {userSign === "Cancer" || userSign === "Scorpio" || userSign === "Pisces" ? "432 Hz for emotional harmony" : 
                    userSign === "Taurus" || userSign === "Virgo" || userSign === "Capricorn" ? "639 Hz for grounding and connection" : 
                    userSign === "Gemini" || userSign === "Libra" || userSign === "Aquarius" ? "528 Hz for mental clarity" : 
                    "396 Hz for protection and courage"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              No cosmic insights available at the moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
