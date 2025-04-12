
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Star, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Astrology: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [activeTab, setActiveTab] = useState("zodiac");
  
  const zodiacSigns = [
    { name: "Aries", element: "Fire", planet: "Mars", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", element: "Earth", planet: "Venus", dates: "Apr 20 - May 20" },
    { name: "Gemini", element: "Air", planet: "Mercury", dates: "May 21 - Jun 20" },
    { name: "Cancer", element: "Water", planet: "Moon", dates: "Jun 21 - Jul 22" },
    { name: "Leo", element: "Fire", planet: "Sun", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", element: "Earth", planet: "Mercury", dates: "Aug 23 - Sep 22" },
  ];
  
  const planets = [
    { name: "Sun", meaning: "Identity & Vitality", frequency: "126.22 Hz" },
    { name: "Moon", meaning: "Emotions & Subconscious", frequency: "210.42 Hz" },
    { name: "Mercury", meaning: "Communication & Intellect", frequency: "141.27 Hz" },
    { name: "Venus", meaning: "Love & Harmony", frequency: "221.23 Hz" },
    { name: "Mars", meaning: "Action & Courage", frequency: "144.72 Hz" },
    { name: "Jupiter", meaning: "Expansion & Growth", frequency: "183.58 Hz" },
  ];
  
  return (
    <Layout pageTitle="Astrology" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className={`${liftTheVeil ? 'text-pink-500' : 'text-yellow-500'}`} />
          Sacred Astrology
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-white/10 mb-6">
            <TabsTrigger value="zodiac" className="data-[state=active]:bg-purple-800/50">
              <Star className="h-4 w-4 mr-2" />
              Zodiac Signs
            </TabsTrigger>
            <TabsTrigger value="planets" className="data-[state=active]:bg-purple-800/50">
              <Globe className="h-4 w-4 mr-2" />
              Planets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="zodiac" className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-6">
              <p className="mb-4">
                Explore the sacred wisdom of the zodiac and discover how celestial alignments influence your energy, 
                frequency resonance, and spiritual journey. Each zodiac sign vibrates at a unique frequency that 
                shapes your core essence.
              </p>
              
              {liftTheVeil ? (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
                >
                  With the veil lifted, you can perceive the subtle cosmic threads that connect your essence to the 
                  stars. The zodiac is not merely symbolic but a direct energy channel from the cosmic intelligence.
                </motion.p>
              ) : (
                <p className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  Each zodiac sign represents a unique vibrational pattern that resonates with specific aspects of your 
                  being, influencing your gifts, challenges, and spiritual path.
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zodiacSigns.map((sign) => (
                <Card 
                  key={sign.name} 
                  className={`border transition-all bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/30`}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{sign.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Element:</span>
                        <p className="text-white">{sign.element}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Planet:</span>
                        <p className="text-white">{sign.planet}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Dates:</span>
                        <p className="text-white">{sign.dates}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="planets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">Planetary Frequencies</h2>
                  <p className="mb-4">
                    Each celestial body vibrates at a unique frequency, influencing different aspects of our consciousness 
                    and spiritual development. Discover how these cosmic vibrations shape your energetic signature.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {planets.map((planet) => (
                    <Card 
                      key={planet.name} 
                      className="bg-black/40 backdrop-blur-sm border border-white/10"
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">{planet.name}</h3>
                          <p className="text-gray-300 text-sm">{planet.meaning}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full ${liftTheVeil ? 'bg-pink-900/40 text-pink-300 border border-pink-500/30' : 'bg-purple-900/40 text-purple-300 border border-purple-500/30'}`}>
                          {planet.frequency}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md rounded-lg flex flex-col items-center justify-center p-4 relative min-h-[400px]">
                <SacredGeometryVisualizer 
                  defaultShape="flower-of-life" 
                  size="lg" 
                  showControls={true}
                  className="absolute inset-0 w-full h-full"
                  chakra="third-eye"
                  isVisible={true}
                />
                
                <div className="z-10 text-center p-4">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-flex items-center justify-center relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-lg"></div>
                    <div className="relative flex gap-2">
                      <Sun className="h-10 w-10 text-yellow-400" />
                      <Moon className="h-10 w-10 text-blue-300" />
                    </div>
                  </motion.div>
                  
                  <h2 className="mt-6 text-xl font-medium text-white">Celestial Harmony</h2>
                  <p className="mt-2 text-gray-200 max-w-md">
                    The sacred geometry patterns reflect the harmonious cosmic dance
                    of planetary movements that influence our spiritual journey.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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

export default Astrology;
