import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import chakraData, { ChakraData } from "@/data/chakraData";
import ChakraDetailModal from "./chakras/ChakraDetailModal";

interface ChakraDetailData {
  name: string;
  sanskritName: string;
  frequency: number;
  description: string;
  element: string;
  location: string;
  associations?: string;
  color?: string;
  id?: string;
}

const ChakraAlignmentSection: React.FC = () => {
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChakra, setActiveChakra] = useState<ChakraDetailData | null>(null);
  
  useEffect(() => {
    if (selectedChakra) {
      const chakra = chakraData.find(c => c.id === selectedChakra);
      if (chakra) {
        const detailData: ChakraDetailData = {
          name: chakra.name,
          sanskritName: chakra.sanskrit,
          frequency: chakra.frequency,
          description: chakra.valesWisdom || chakra.emotionalThemes.join(", "),
          element: chakra.element,
          location: chakra.location,
          associations: chakra.emotionalThemes.join(", "),
          color: chakra.color,
        };
        setActiveChakra(detailData);
        setIsModalOpen(true);
      }
    } else {
      setActiveChakra(null);
    }
  }, [selectedChakra]);

  const handleSelectChakra = (chakraId: string) => {
    if (chakraId === selectedChakra) {
      if (!isModalOpen) {
        setIsModalOpen(true);
      }
    } else {
      setSelectedChakra(chakraId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4 text-center">Chakra System</h3>
              <div className="relative w-full h-[400px] flex justify-center">
                <div className="absolute h-full w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-red-500 rounded-full"></div>
                
                {chakraData.map((chakra, index) => {
                  const top = 10 + index * (380 / (chakraData.length - 1));
                  const isSelected = selectedChakra === chakra.id;
                  
                  return (
                    <motion.button
                      key={chakra.id}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: isSelected ? [1, 1.2, 1] : 1,
                        boxShadow: isSelected ? `0 0 15px 5px rgba(255,255,255,0.7)` : "none"
                      }}
                      transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                      onClick={() => handleSelectChakra(chakra.id)}
                      className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${chakra.color} z-10`}
                      style={{ top: `${top}px` }}
                    >
                      <span className="sr-only">{chakra.name}</span>
                      <span className="absolute left-8 top-0 whitespace-nowrap text-sm font-medium">
                        {chakra.name}
                      </span>
                      <span className="absolute -left-16 top-0 whitespace-nowrap text-xs text-gray-500">
                        {chakra.frequency} Hz
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3">
            {selectedChakra ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {chakraData.filter(chakra => chakra.id === selectedChakra).map(chakra => (
                    <Card key={chakra.id} className="border border-gray-200 overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${chakra.gradient}`}></div>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-medium">{chakra.name}</h3>
                            <p className="text-sm text-gray-500">{chakra.sanskrit} · {chakra.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${chakra.color}`}></div>
                            <span className="text-sm font-medium">{chakra.frequency} Hz</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {chakra.element} element • {chakra.emotionalThemes.join(", ")}
                        </p>
                        
                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                          <p className="text-sm italic text-center">"{chakra.affirmation}"</p>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            className="text-gray-700 border-gray-300"
                            onClick={() => setIsModalOpen(true)}
                          >
                            View Details
                          </Button>
                          
                          <Button className={`bg-gradient-to-r ${chakra.gradient} hover:opacity-90 text-white`}>
                            <Play className="h-4 w-4 mr-2" /> 
                            Experience {chakra.name}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card className="border border-gray-200 h-full flex items-center justify-center">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-medium mb-2 text-gray-700">Select a Chakra</h3>
                  <p className="text-gray-500">Click on a chakra point to view details and play frequencies</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <ChakraDetailModal 
        chakra={activeChakra} 
        isOpen={isModalOpen && activeChakra !== null}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ChakraAlignmentSection;
