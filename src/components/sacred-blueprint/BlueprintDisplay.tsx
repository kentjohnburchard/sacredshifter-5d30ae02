
import React from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlueprintChart } from './BlueprintChart';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles, Music, BarChart3, Flame, Droplet, Wind, Mountain } from 'lucide-react';

interface BlueprintDisplayProps {
  blueprint: SacredBlueprint;
}

export const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint }) => {
  const { kentMode } = useTheme();
  
  const getElementIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fire':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'water':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'air':
        return <Wind className="h-5 w-5 text-sky-500" />;
      case 'earth':
        return <Mountain className="h-5 w-5 text-green-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Find the strongest and weakest chakras
  const chakras = blueprint.chakra_signature;
  let strongestChakra = Object.keys(chakras).reduce((a, b) => 
    chakras[a].strength > chakras[b].strength ? a : b);
  
  let weakestChakra = Object.keys(chakras).reduce((a, b) => 
    chakras[a].strength < chakras[b].strength ? a : b);

  const formatChakraName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className={`border-0 shadow-md overflow-hidden ${kentMode ? 'bg-purple-950/30' : 'bg-white/70'} backdrop-blur-md`}>
          <CardHeader className={`${kentMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-50 to-indigo-50'}`}>
            <CardTitle className={`text-center text-2xl ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
              Your Sacred Blueprint
            </CardTitle>
            <CardDescription className="text-center">
              Your unique vibrational signature and energetic identity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8">
              <BlueprintChart blueprint={blueprint} className="max-w-md mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Core Frequency */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium flex items-center ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    <Sparkles className={`mr-2 h-5 w-5 ${kentMode ? 'text-pink-400' : 'text-indigo-600'}`} />
                    Core Frequency
                  </h3>
                  <p className={`text-2xl font-bold mt-1 ${kentMode ? 'text-pink-300' : 'text-indigo-700'}`}>
                    {blueprint.core_frequency} - {blueprint.frequency_value}Hz
                  </p>
                  <p className={`mt-1 ${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    You are "{blueprint.energetic_archetype}"
                  </p>
                </div>
                
                {/* Elemental Resonance */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium flex items-center ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    {getElementIcon(blueprint.elemental_resonance)}
                    <span className="ml-2">Elemental Resonance</span>
                  </h3>
                  <p className={`text-xl font-bold mt-1 ${kentMode ? 'text-pink-300' : 'text-indigo-700'}`}>
                    {blueprint.elemental_resonance.charAt(0).toUpperCase() + blueprint.elemental_resonance.slice(1)}
                  </p>
                  <p className={`mt-1 ${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your spirit flows with the qualities of {blueprint.elemental_resonance}
                  </p>
                </div>
                
                {/* Chakra Signature */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium flex items-center ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    <BarChart3 className={`mr-2 h-5 w-5 ${kentMode ? 'text-pink-400' : 'text-indigo-600'}`} />
                    Chakra Signature
                  </h3>
                  <p className={`text-xl font-bold mt-1 ${kentMode ? 'text-pink-300' : 'text-indigo-700'}`}>
                    {formatChakraName(strongestChakra)} & {formatChakraName(weakestChakra)}
                  </p>
                  <p className={`mt-1 ${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your strongest energy flows through your {formatChakraName(strongestChakra)} Chakra
                  </p>
                </div>
                
                {/* Emotional Profile */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    Emotional Profile
                  </h3>
                  <p className={`text-xl font-bold mt-1 ${kentMode ? 'text-pink-300' : 'text-indigo-700'}`}>
                    {blueprint.emotional_profile}
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Musical Key */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium flex items-center ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    <Music className={`mr-2 h-5 w-5 ${kentMode ? 'text-pink-400' : 'text-indigo-600'}`} />
                    Musical Key
                  </h3>
                  <p className={`text-xl font-bold mt-1 ${kentMode ? 'text-pink-300' : 'text-indigo-700'}`}>
                    {blueprint.musical_key}
                  </p>
                  <p className={`mt-1 ${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your soul resonates with the tones of {blueprint.musical_key}
                  </p>
                </div>
                
                {/* Shadow Frequencies */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/30' : 'bg-indigo-50'}`}>
                  <h3 className={`font-medium ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    Shadow Frequencies
                  </h3>
                  <div className="mt-2 space-y-2">
                    {blueprint.shadow_frequencies.map((freq, index) => (
                      <p key={index} className={`${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {freq}
                      </p>
                    ))}
                  </div>
                  <p className={`mt-2 text-sm italic ${kentMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    These frequencies invite you into deeper integration
                  </p>
                </div>
                
                {/* Sacred Blueprint Text */}
                <div className={`p-4 rounded-lg ${kentMode ? 'bg-purple-900/20 border border-purple-800/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100'}`}>
                  <h3 className={`font-medium mb-2 ${kentMode ? 'text-white' : 'text-indigo-900'}`}>
                    Your Sacred Story
                  </h3>
                  <p className={`whitespace-pre-line text-sm ${kentMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {blueprint.blueprint_text}
                  </p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.p 
        variants={itemVariants} 
        className="text-center text-sm italic opacity-75"
      >
        This is your now—not your forever. You are the artist of your frequency.
      </motion.p>
    </motion.div>
  );
};

export default BlueprintDisplay;
