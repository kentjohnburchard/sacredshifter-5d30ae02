
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, Sparkles, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { hermeticPrinciples } from '@/data/hermeticPrinciples';
import { HermeticPrincipleCard, HermeticWisdomLibrary, VisualVibrationViewer } from '@/components/hermetic-wisdom';
import { useNavigate } from 'react-router-dom';
import { CosmicContainer } from '@/components/sacred-geometry';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

const HermeticWisdom: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [activeTab, setActiveTab] = useState("principles");
  const navigate = useNavigate();
  const { playAudio } = useGlobalAudioPlayer();
  
  // Map principles to icons for the cards
  const principleIcons = {
    "mentalism": Sparkles,
    "correspondence": Info,
    "vibration": Sparkles,
    "polarity": Info,
    "rhythm": Sparkles,
    "cause_effect": Info,
    "gender": Sparkles,
  };
  
  // Handle principle card click
  const handlePrincipleClick = (principle: typeof hermeticPrinciples.mentalism) => {
    // If there's a frequency associated with this principle, play it
    if (principle.frequency) {
      playAudio({
        title: `${principle.name} - ${principle.frequency}Hz`,
        source: `/sounds/focus-ambient.mp3`, // This is a placeholder, ideally would use principle-specific audio
      });
    }
  };
  
  return (
    <Layout pageTitle="Hermetic Wisdom" theme="cosmic">
      <div className="container mx-auto py-6 px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Unlock the Laws of the Universe
        </motion.h2>
        
        <motion.p
          className="text-xl text-center text-white/80 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore the Seven Hermetic Principles and align your consciousness through wisdom, frequency, and sacred visuals.
        </motion.p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-white/10 mb-6 mx-auto">
            <TabsTrigger value="principles" className="data-[state=active]:bg-purple-800/50">
              <BookOpen className="h-4 w-4 mr-2" />
              Principles
            </TabsTrigger>
            <TabsTrigger value="sound-library" className="data-[state=active]:bg-purple-800/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Sound Library
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="principles" className="space-y-8">
            <CosmicContainer className="p-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {Object.values(hermeticPrinciples).map((principle) => {
                  const IconComponent = principleIcons[principle.id] || BookOpen;
                  return (
                    <motion.div
                      key={principle.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <HermeticPrincipleCard
                        id={principle.id}
                        title={principle.name}
                        quote={principle.principle}
                        description={principle.description}
                        affirmation={`I embody the principle of ${principle.name}`}
                        frequency={principle.frequency || 0}
                        frequencyName={principle.chakra || "Universal"}
                        animation="fadeIn"
                        color={getColorForPrinciple(principle.id)}
                        tag={principle.element || ""}
                        icon={IconComponent}
                        onClick={() => handlePrincipleClick(principle)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
              
              <div className="mt-12">
                <VisualVibrationViewer />
              </div>
            </CosmicContainer>
          </TabsContent>
          
          <TabsContent value="sound-library">
            <CosmicContainer className="p-6">
              <HermeticWisdomLibrary />
            </CosmicContainer>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Helper function to get gradient colors for principles
const getColorForPrinciple = (id: string): string => {
  switch (id) {
    case "mentalism":
      return "from-purple-500 to-indigo-500";
    case "correspondence":
      return "from-indigo-500 to-blue-500";
    case "vibration":
      return "from-blue-500 to-cyan-500";
    case "polarity":
      return "from-green-500 to-emerald-500";
    case "rhythm":
      return "from-yellow-500 to-amber-500";
    case "cause_effect":
      return "from-orange-500 to-red-500";
    case "gender":
      return "from-red-500 to-pink-500";
    default:
      return "from-purple-500 to-blue-500";
  }
};

export default HermeticWisdom;
