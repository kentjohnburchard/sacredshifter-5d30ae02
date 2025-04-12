
import React from "react";
import Layout from "@/components/Layout";
import { Settings, Music, Sparkles, Heart, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const JourneyTemplates = () => {
  const { user } = useAuth();
  const { liftTheVeil } = useTheme();
  const isAdmin = user && user.email === "admin@example.com"; // You can adjust the admin check based on your auth logic
  
  const journeys = [
    {
      id: "inner-peace",
      title: "Inner Peace Journey",
      description: "A guided meditation journey to cultivate inner peace and tranquility.",
      duration: "15 min",
      frequency: "432 Hz",
      category: "Meditation",
      chakra: "Heart",
      icon: Heart
    },
    {
      id: "cosmic-awareness",
      title: "Cosmic Awareness",
      description: "Expand your consciousness and connect with universal wisdom.",
      duration: "20 min",
      frequency: "963 Hz",
      category: "Expansion",
      chakra: "Crown",
      icon: Sparkles
    },
    {
      id: "mental-clarity",
      title: "Mental Clarity",
      description: "Clear mental fog and enhance cognitive function.",
      duration: "12 min",
      frequency: "528 Hz",
      category: "Focus",
      chakra: "Third Eye",
      icon: Brain
    },
    {
      id: "harmonic-balance",
      title: "Harmonic Balance",
      description: "Restore equilibrium between mind, body, and spirit.",
      duration: "18 min",
      frequency: "639 Hz",
      category: "Healing",
      chakra: "Throat",
      icon: Music
    }
  ];
  
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
    <Layout 
      pageTitle="Sound Journeys & Sacred Meditation" 
      useBlueWaveBackground={false}
      theme="cosmic"
    >
      <div className="max-w-6xl mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Sound Journeys & Sacred Meditation</h1>
            <p className="text-base text-white">
              Explore our curated journeys and meditations designed to address specific healing needs. 
              Each experience combines frequencies, soundscapes, and guidance to support your path to wellness.
            </p>
          </div>
          
          {isAdmin && (
            <Link to="/admin/journey-audio-admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-white/40 hover:bg-white/10">
                <Settings className="h-4 w-4" />
                Manage Journey Audio
              </Button>
            </Link>
          )}
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-medium mb-3">About Sound Journeys</h2>
              <p className="text-gray-300">
                Sound journeys use specific frequencies, binaural beats, and guided meditation to help you reach 
                altered states of consciousness. Each journey is designed to target specific energy centers and 
                address particular aspects of well-being.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-3">How to Use</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Choose a journey that resonates with your current needs</li>
                <li>Find a quiet, comfortable space where you won't be disturbed</li>
                <li>Use headphones for the optimal binaural experience</li>
                <li>Allow yourself to fully immerse in the experience</li>
              </ol>
            </div>
          </div>
          
          {liftTheVeil && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
            >
              With the veil lifted, these journeys will access deeper dimensions of consciousness, 
              allowing for more profound healing and awakening experiences. The frequencies will 
              resonate more powerfully with your expanded awareness.
            </motion.div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Featured Journeys</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {journeys.map((journey) => (
            <motion.div key={journey.id} variants={item}>
              <Card className={`h-full flex flex-col bg-black/40 backdrop-blur-sm border ${
                liftTheVeil ? 'border-pink-500/30 hover:border-pink-500/50' : 'border-purple-500/30 hover:border-purple-500/50'
              } transition-all`}>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className={`${
                      liftTheVeil ? 'border-pink-500/30 text-pink-300' : 'border-purple-500/30 text-purple-300'
                    }`}>
                      {journey.category}
                    </Badge>
                    <span className="text-sm text-gray-400">{journey.duration}</span>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <journey.icon className={`h-5 w-5 ${
                      liftTheVeil ? 'text-pink-400' : 'text-purple-400'
                    }`} />
                    <span>{journey.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-300 text-sm">{journey.description}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      <span>{journey.frequency}</span>
                    </div>
                    <div>{journey.chakra} Chakra</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/journey-player/${journey.id}`} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:bg-white/10"
                    >
                      Start Journey
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="flex justify-center mt-8">
          <Link to="/dashboard">
            <Button 
              variant="outline"
              className={`${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
