
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const chakras = [
  {
    id: "root",
    name: "Root Chakra",
    sanskrit: "Muladhara",
    color: "bg-red-500",
    frequency: "396 Hz",
    description: "Grounding, security, stability",
    location: "Base of spine",
    affirmation: "I am safe and secure in my body"
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    color: "bg-orange-500",
    frequency: "417 Hz",
    description: "Creativity, emotions, sensuality",
    location: "Lower abdomen",
    affirmation: "I honor my feelings and embrace pleasure"
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    sanskrit: "Manipura",
    color: "bg-yellow-500",
    frequency: "528 Hz",
    description: "Personal power, will, confidence",
    location: "Upper abdomen",
    affirmation: "I am confident and empowered"
  },
  {
    id: "heart",
    name: "Heart Chakra",
    sanskrit: "Anahata",
    color: "bg-green-500",
    frequency: "639 Hz",
    description: "Love, compassion, harmony",
    location: "Center of chest",
    affirmation: "I give and receive love freely"
  },
  {
    id: "throat",
    name: "Throat Chakra",
    sanskrit: "Vishuddha",
    color: "bg-blue-500",
    frequency: "741 Hz",
    description: "Communication, expression, truth",
    location: "Throat",
    affirmation: "I speak my truth with clarity"
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    sanskrit: "Ajna",
    color: "bg-indigo-500",
    frequency: "852 Hz",
    description: "Intuition, insight, vision",
    location: "Between eyebrows",
    affirmation: "I trust my intuition and inner wisdom"
  },
  {
    id: "crown",
    name: "Crown Chakra",
    sanskrit: "Sahasrara",
    color: "bg-purple-500",
    frequency: "963 Hz",
    description: "Consciousness, spirituality, connection",
    location: "Top of head",
    affirmation: "I am connected to divine wisdom"
  }
];

const ChakraAlignmentSection: React.FC = () => {
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);

  const handleSelectChakra = (chakraId: string) => {
    setSelectedChakra(chakraId === selectedChakra ? null : chakraId);
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Chakra details card - Shown first on mobile */}
        {selectedChakra && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            {chakras.filter(chakra => chakra.id === selectedChakra).map(chakra => (
              <Card key={chakra.id} className="border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                <div className={`h-2 ${chakra.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-medium">{chakra.name}</h3>
                      <p className="text-sm text-gray-500">{chakra.sanskrit} · {chakra.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${chakra.color}`}></div>
                      <span className="text-sm font-medium">{chakra.frequency}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{chakra.description}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm italic text-center">"{chakra.affirmation}"</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button className={`${chakra.color.replace('bg-', 'bg-')} hover:opacity-90 text-white`}>
                      <Play className="h-4 w-4 mr-2" /> 
                      Play {chakra.name} Frequency
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
        
        {/* Chakra selection visualization */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Chakra points visualization */}
          <div className="relative w-[280px] h-[500px] sm:w-[320px] sm:h-[600px] order-2 md:order-1">
            {/* Human body silhouette */}
            <div className="absolute inset-0 bg-gray-200/50 rounded-full w-32 h-32 mx-auto mt-12"></div>
            
            {/* Chakra points */}
            {chakras.map((chakra, index) => {
              // Calculate position based on index
              const top = 75 + index * (450 / (chakras.length - 1));
              
              return (
                <motion.button
                  key={chakra.id}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: selectedChakra === chakra.id ? [1, 1.2, 1] : 1,
                    boxShadow: selectedChakra === chakra.id ? "0 0 15px 5px rgba(255,255,255,0.7)" : "none"
                  }}
                  transition={{ duration: 2, repeat: selectedChakra === chakra.id ? Infinity : 0 }}
                  onClick={() => handleSelectChakra(chakra.id)}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${chakra.color} z-10`}
                  style={{ top: `${top}px` }}
                >
                  <span className="sr-only">{chakra.name}</span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Chakra list (on larger screens) */}
          <div className="order-1 md:order-2 w-full md:w-auto">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 max-w-xs">
              {chakras.map((chakra) => (
                <button
                  key={chakra.id}
                  onClick={() => handleSelectChakra(chakra.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    selectedChakra === chakra.id
                      ? `${chakra.color.replace('bg-', 'bg-')} text-white`
                      : 'bg-white/80 hover:bg-white'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${chakra.color}`}></div>
                  <span className="text-sm font-medium">{chakra.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Instructions when no chakra is selected */}
        {!selectedChakra && (
          <div className="text-center text-gray-500 mt-8">
            <p>Select a chakra point to explore</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChakraAlignmentSection;
