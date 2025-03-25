
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart } from "lucide-react";

const journeys = [
  {
    id: "journey-1",
    title: "Deep Delta Meditation",
    description: "A journey into profound relaxation with delta wave frequencies (0.5-4 Hz)",
    duration: "20 min",
    level: "All Levels",
    color: "from-blue-400 to-purple-600"
  },
  {
    id: "journey-2",
    title: "Throat Chakra Activation",
    description: "Open your expression with the 741 Hz frequency for the Throat Chakra",
    duration: "15 min",
    level: "Intermediate",
    color: "from-teal-400 to-blue-600"
  },
  {
    id: "journey-3",
    title: "Heart Coherence",
    description: "Align with the frequency of love at 528 Hz, the miracle tone",
    duration: "18 min",
    level: "Beginner",
    color: "from-green-400 to-emerald-600"
  }
];

const SoundJourneysSection: React.FC = () => {
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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Sound Journeys
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Experience the transformative power of sacred frequencies. Each journey is crafted to bring you into harmony with specific energy centers and states of consciousness.
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {journeys.map((journey) => (
            <motion.div key={journey.id} variants={itemVariants}>
              <Card className="overflow-hidden h-full border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
                <div className={`h-3 bg-gradient-to-r ${journey.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-2">{journey.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{journey.description}</p>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      </div>
                      <span className="text-xs text-gray-500">{journey.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      </div>
                      <span className="text-xs text-gray-500">{journey.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                    >
                      <Heart className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Play className="h-3 w-3 mr-1" /> Begin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="border-purple-200 hover:bg-purple-50 hover:text-purple-700"
          >
            Explore All Journeys
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SoundJourneysSection;
