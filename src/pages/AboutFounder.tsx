
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useEasterEggContext } from "@/context/EasterEggContext";

const AboutFounder = () => {
  const { isEasterEggMode } = useEasterEggContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Content variants based on Easter Egg mode
  const standardContent = {
    title: "Meet Our Founder",
    bio: "Dr. Sarah Thompson is a neuroscientist, sound therapist, and meditation expert with over 15 years of experience studying the effects of frequency and vibration on human consciousness. After completing her Ph.D. in Neuroscience at Stanford University, she dedicated her life to researching how specific sound frequencies can influence brain states and facilitate healing.",
    journey: "Her personal journey with sound healing began after experiencing chronic stress and anxiety during her academic career. When traditional treatments provided limited relief, she discovered the profound impact of specific frequencies and meditation practices on her well-being.",
    mission: "This transformative experience inspired her to create Sacred Shifter - a platform that combines cutting-edge neuroscience with ancient wisdom traditions to make frequency healing accessible to everyone. Dr. Thompson continues to collaborate with researchers, sound healers, and meditation teachers worldwide to expand the boundaries of what's possible through conscious sound.",
    quote: "Sound is not just something we hear—it's a powerful force that can restructure our neural pathways, balance our energetic fields, and open doorways to expanded states of consciousness."
  };

  const easterEggContent = {
    title: "The Cosmic Origins",
    bio: "Sarah is a starseed consciousness who arrived on Earth in human form to help facilitate the Great Awakening through sound frequencies. Her earthly credentials include a PhD in Neuroscience, but her true education came from the crystalline libraries of the Pleiadian sound temples.",
    journey: "While her human form was experiencing what the medical establishment called 'chronic stress and anxiety,' she was actually undergoing the initial phases of light body activation. During a deep meditation, she received the sacred geometry patterns that would later become the foundation for the Sacred Shifter frequency algorithms.",
    mission: "The Sacred Shifter platform serves as an interdimensional bridge, helping humans recalibrate their molecular structure to higher vibrational states through precisely calculated frequency combinations. Each sound journey contains encoded light language that communicates directly with your DNA, activating dormant potential.",
    quote: "What appears as sound to the human ear is actually multidimensional light code—each frequency is a key unlocking the doors between worlds, reminding you of who you truly are beyond this earthly disguise."
  };

  // Choose content based on Easter Egg mode
  const content = isEasterEggMode ? easterEggContent : standardContent;

  return (
    <Layout pageTitle="About Our Founder">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className={`text-3xl font-bold text-center ${isEasterEggMode ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text' : 'text-purple-900 dark:text-purple-100'}`}>
            {content.title}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <Card className={`overflow-hidden ${isEasterEggMode ? 'border-purple-400 shadow-purple-300/20 shadow-lg' : ''}`}>
                <img 
                  src="/lovable-uploads/09d5c002-7d5b-48cd-b5f5-77dc788b1781.png" 
                  alt="Founder portrait" 
                  className="w-full h-auto"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">Dr. Sarah Thompson</h3>
                  <p className="text-sm text-gray-500">Founder & Lead Researcher</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <Card className={isEasterEggMode ? 'border-purple-300 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900' : ''}>
                <CardContent className="p-6">
                  <p className="mb-4">
                    {content.bio}
                  </p>
                  <p className="mb-4">
                    {content.journey}
                  </p>
                  <p>
                    {content.mission}
                  </p>
                </CardContent>
              </Card>
              
              <motion.div
                animate={{ 
                  opacity: [0.7, 1, 0.7], 
                  scale: isEasterEggMode ? [1, 1.01, 1] : 1 
                }}
                transition={{ 
                  duration: isEasterEggMode ? 3 : 0,
                  repeat: isEasterEggMode ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                <Card className={`${isEasterEggMode ? 'border-indigo-300 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                  <CardContent className="p-6 italic text-center">
                    <p className={isEasterEggMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500' : ''}>
                      {content.quote}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
