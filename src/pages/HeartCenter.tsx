
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, SendHorizonal, Camera, Music } from "lucide-react";
import MirrorPortal from "@/components/heart-center/MirrorPortal";
import SoulHug from "@/components/heart-center/SoulHug";
import HeartFrequencyPlaylists from "@/components/heart-center/HeartFrequencyPlaylists";
import GlobalWatermark from "@/components/GlobalWatermark";
import Header from "@/components/navigation/Header";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";

const HeartCenter: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { randomQuote } = useLoveQuotes();
  const [activeTab, setActiveTab] = useState("mirror");

  // Gradient based on consciousness mode
  const bgGradient = preferences.consciousness_mode === "kent" 
    ? "bg-gradient-to-b from-rose-400 via-fuchsia-500 to-indigo-500"
    : "bg-gradient-to-b from-rose-100 via-pink-100 to-purple-100";

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Heart Center
            </motion.h1>
            
            <motion.p
              className="mt-3 text-lg text-purple-800 dark:text-purple-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Access, cultivate, and radiate love through sacred vibration
            </motion.p>
            
            {randomQuote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-6 p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-pink-200 max-w-2xl mx-auto"
              >
                <p className="italic text-purple-900 dark:text-purple-100">"{randomQuote.text}"</p>
                {randomQuote.topic && (
                  <p className="text-sm mt-2 text-pink-600 font-medium">{randomQuote.topic}</p>
                )}
              </motion.div>
            )}
          </div>
          
          <Tabs 
            defaultValue="mirror" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full bg-white/50 backdrop-blur-sm border border-pink-200 rounded-xl mb-8">
              <TabsTrigger value="mirror" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-l-lg">
                <Camera className="h-4 w-4 mr-2" />
                Mirror Portal
              </TabsTrigger>
              <TabsTrigger value="soulhug" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                <SendHorizonal className="h-4 w-4 mr-2" />
                Soul Hug
              </TabsTrigger>
              <TabsTrigger value="playlist" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-r-lg">
                <Music className="h-4 w-4 mr-2" />
                Heart Frequencies
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 border border-pink-100"
            >
              <TabsContent value="mirror" className="mt-0">
                <MirrorPortal />
              </TabsContent>
              
              <TabsContent value="soulhug" className="mt-0">
                <SoulHug />
              </TabsContent>
              
              <TabsContent value="playlist" className="mt-0">
                <HeartFrequencyPlaylists />
              </TabsContent>
            </motion.div>
          </Tabs>
          
          {/* Love Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 p-6 rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 shadow-md border border-pink-200 flex flex-col md:flex-row items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-purple-900">Love Dashboard</h3>
              <p className="text-purple-700 mt-1">Track your heart-centered journey and impact</p>
            </div>
            <Button 
              variant="default" 
              className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => navigate("/heart-dashboard")}
            >
              <Heart className="mr-2 h-4 w-4" />
              View Love Stats
            </Button>
          </motion.div>
        </motion.div>
      </main>
      
      <GlobalWatermark />
    </div>
  );
};

export default HeartCenter;
