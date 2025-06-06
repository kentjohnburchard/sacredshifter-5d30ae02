
import React, { useState, useEffect } from "react";
import { AstrologyDashboard, UserBirthDataForm, ZodiacSignCard, DailyHoroscope, PlanetaryTransits } from "@/components/astrology";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AstrologyPage: React.FC = () => {
  const { user } = useAuth();
  const [userHasBirthData, setUserHasBirthData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Check if user has birth data
  useEffect(() => {
    if (user) {
      const checkUserBirthData = async () => {
        const { data, error } = await supabase
          .from('user_astrology_data' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (data && !error) {
          setUserHasBirthData(true);
        }
      };
      
      checkUserBirthData();
    }
  }, [user]);
  
  const handleBirthDataSubmitted = () => {
    setUserHasBirthData(true);
    toast.success("Birth data saved successfully!");
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">
            🌀 The Sacred Signature
          </span>
        </h1>
        <p className="text-indigo-600/70 max-w-2xl mx-auto text-lg">
          Every star, every planet, every vibration = your divine stamp.
        </p>
      </div>
      
      {!userHasBirthData && user ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-purple-100 dark:border-purple-900/20 overflow-hidden shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
              <CardTitle>Complete Your Astrological Profile</CardTitle>
              <CardDescription>
                Enter your birth details to unlock personalized cosmic insights
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <UserBirthDataForm onSubmitSuccess={handleBirthDataSubmitted} />
            </CardContent>
          </Card>
        </motion.div>
      ) : !user ? (
        <Card className="text-center p-6">
          <CardTitle className="mb-4">Sign in to access your cosmic profile</CardTitle>
          <CardDescription>
            Create an account or sign in to view your personalized astrological insights.
          </CardDescription>
        </Card>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Astro Profile</TabsTrigger>
            <TabsTrigger value="horoscope">Daily Guidance</TabsTrigger>
            <TabsTrigger value="transits">Cosmic Transits</TabsTrigger>
            <TabsTrigger value="journeys">Sound Journeys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <AstrologyDashboard />
          </TabsContent>
          
          <TabsContent value="horoscope" className="mt-0">
            <DailyHoroscope />
          </TabsContent>
          
          <TabsContent value="transits" className="mt-0">
            <PlanetaryTransits />
          </TabsContent>
          
          <TabsContent value="journeys" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((sign) => (
                <ZodiacSignCard key={sign} sign={sign} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AstrologyPage;
