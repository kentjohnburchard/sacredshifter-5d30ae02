
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, ArrowRight, Info, Zap } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';

const HermeticWisdom: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [activeTab, setActiveTab] = useState("principles");
  
  const hermeticPrinciples = [
    {
      name: "Mentalism",
      description: "The All is Mind; The Universe is Mental.",
      details: "This principle explains that everything in the universe exists within the mind of THE ALL. Mental transmutation is the art of changing and transforming our own mental states and conditions.",
      frequency: "639 Hz",
      chakra: "Third Eye"
    },
    {
      name: "Correspondence",
      description: "As above, so below; as below, so above.",
      details: "This principle embodies the truth that there is always a correspondence between the laws and phenomena of the various planes of being and life. Understanding this enables us to reason intelligently from the known to the unknown.",
      frequency: "528 Hz",
      chakra: "Heart"
    },
    {
      name: "Vibration",
      description: "Nothing rests; everything moves; everything vibrates.",
      details: "This principle explains that the differences between manifestations of matter, energy, mind, and spirit result largely from varying rates of vibration. The higher the vibration, the higher the position in the scale.",
      frequency: "396 Hz",
      chakra: "Root"
    }
  ];
  
  return (
    <Layout pageTitle="Hermetic Wisdom" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className={`${liftTheVeil ? 'text-pink-500' : 'text-indigo-400'}`} />
          Hermetic Wisdom
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-white/10 mb-6">
            <TabsTrigger value="principles" className="data-[state=active]:bg-purple-800/50">
              <BookOpen className="h-4 w-4 mr-2" />
              Principles
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-purple-800/50">
              <Zap className="h-4 w-4 mr-2" />
              Daily Practice
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="principles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-6">
                  <p className="mb-4">
                    Experience the vibrational essence of the Seven Hermetic Principles through sound frequencies 
                    and fractal visuals aligned with chakra energy centers. These ancient principles form the foundation 
                    of all esoteric and spiritual wisdom traditions.
                  </p>
                  
                  {liftTheVeil ? (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
                    >
                      With the veil lifted, you can perceive how the Hermetic principles are not merely philosophical 
                      concepts but living energies that form the very fabric of reality. They are the operating system 
                      of consciousness itself.
                    </motion.p>
                  ) : (
                    <p className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                      The Hermetic principles provide a framework for understanding the fundamental laws that govern 
                      both the inner and outer worlds, enabling conscious creation and spiritual evolution.
                    </p>
                  )}
                </div>
                
                <div className="space-y-4">
                  {hermeticPrinciples.map((principle) => (
                    <Card 
                      key={principle.name} 
                      className="bg-black/40 backdrop-blur-sm border border-white/10"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{principle.name}</span>
                          <div className={`px-3 py-1 text-sm rounded-full ${liftTheVeil ? 'bg-pink-900/40 text-pink-300 border border-pink-500/30' : 'bg-purple-900/40 text-purple-300 border border-purple-500/30'}`}>
                            {principle.frequency}
                          </div>
                        </CardTitle>
                        <CardDescription className="text-white/80">{principle.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm">{principle.details}</p>
                        <div className="flex items-center mt-3">
                          <Info className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-400 text-sm">Resonates with the {principle.chakra} Chakra</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md rounded-lg flex flex-col items-center justify-center p-4 relative min-h-[500px]">
                <SacredGeometryVisualizer 
                  defaultShape="flower-of-life" 
                  size="lg" 
                  showControls={true}
                  className="absolute inset-0 w-full h-full"
                  isVisible={true}
                />
                
                <div className="z-10 text-center p-4">
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="inline-block p-8 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-lg"></div>
                    <BookOpen className={`h-16 w-16 ${liftTheVeil ? 'text-pink-400' : 'text-indigo-400'}`} />
                  </motion.div>
                  
                  <h2 className="mt-6 text-xl font-medium text-white">Sacred Geometry</h2>
                  <p className="mt-2 text-gray-200 max-w-md">
                    The geometric patterns above represent the mathematical principles that underlie 
                    the structure of reality as described in Hermetic teachings.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">Daily Hermetic Practices</h2>
              <p>
                Integrate these practices into your daily routine to embody the Hermetic principles
                and transform your consciousness through practical application.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle>Morning Contemplation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    Begin your day by contemplating one Hermetic principle. Reflect on how it might 
                    manifest in your experiences throughout the day ahead.
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Practice:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Sit in a comfortable position and take three deep breaths</li>
                      <li>Recite the principle aloud three times</li>
                      <li>Visualize how this principle operates in your life</li>
                      <li>Set an intention to observe this principle in action today</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle>Evening Reflection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    End your day by reviewing your experiences through the lens of the Hermetic principles.
                    Note synchronicities and insights that arose.
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Practice:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Write in a journal about moments when you observed the principles at work</li>
                      <li>Note any challenges in applying the wisdom</li>
                      <li>Contemplate how you might deepen your understanding tomorrow</li>
                      <li>Express gratitude for the wisdom gained</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className={`p-6 rounded-lg border mt-4 transition-all duration-500 ${
              liftTheVeil 
                ? "bg-pink-900/20 border-pink-500/30 text-pink-100" 
                : "bg-purple-900/20 border-purple-500/30 text-purple-100"
            }`}>
              <div className="flex items-start">
                <div className="bg-black/30 p-3 rounded-full mr-4">
                  <Zap className={`h-6 w-6 ${liftTheVeil ? "text-pink-400" : "text-purple-400"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Weekly Integration Challenge</h3>
                  <p className="mb-3">
                    Choose one principle each week and deliberately create experiences that allow you to 
                    embody its wisdom. Notice how your perception shifts as you integrate the principle 
                    into your consciousness.
                  </p>
                  <Link to="/shift-perception">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 mt-2"
                    >
                      <span>Explore Perception Shifting</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
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

export default HermeticWisdom;
