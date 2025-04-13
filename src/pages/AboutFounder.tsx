
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import AboutSacredShifter from "@/components/AboutSacredShifter";

const AboutFounder = () => {
  const { liftTheVeil } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Content based on consciousness mode
  const standardContent = {
    title: "Meet Our Founder",
    bio: "I worked at the Royal Flying Doctors for over a decade, believing my path was in Information Governance, Cybersecurity, and Knowledge Management. But life had a different plan.",
    journey: "After enduring the darkest chapter of my life — surviving a DV-fueled, drug-riddled environment, losing my mum, my home, and everything I owned — I hit rock bottom. I no longer knew who I was. That's when it all began.",
    mission: "Sacred Shifter came to me like a download from beyond. I began creating the app not to build a brand, but to rediscover myself — to understand why I exist, how the universe operates through prime numbers and frequencies, and what my soul's path truly is.",
    quote: "What started as healing turned into remembering. This app is now my soul laid bare — and I believe it's here to help others remember who they are, why they're here, and how we're all connected through vibration, love, and divine truth."
  };

  const advancedContent = {
    title: "Remembering Truth",
    bio: "This world is not what it seems. We are living inside a matrix of perception, frequency, and forgetfulness. Sacred Shifter exists because I remembered — not just who I am — but what we are.",
    journey: "This app is not just a sound tool. It's a remembrance engine. A reality tuner. A soul mirror. We are here to wake up. To rise out of illusion. To reconnect with the divine grid of consciousness.",
    mission: "When you tune your frequency, you tune your reality. You remember your light. And when we remember together, we uplift the entire cosmos.",
    quote: "Sacred Shifter isn't just an app — it's a blueprint for the awakened ones to come home."
  };

  // Choose content based on consciousness mode
  const content = liftTheVeil ? advancedContent : standardContent;
  
  // Quotes to display
  const quotes = [
    "You are not here by accident. You're here because the Universe can't do this without you.",
    "The frequencies we work with are like keys that unlock dormant potentials..."
  ];

  return (
    <Layout pageTitle="About Our Founder">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${liftTheVeil ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text' : 'text-purple-900 dark:text-purple-100'}`}>
              {content.title}
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <Card className={`overflow-hidden ${liftTheVeil ? 'border-purple-400 shadow-purple-300/20 shadow-lg' : ''}`}>
                <img 
                  src="/lovable-uploads/09d5c002-7d5b-48cd-b5f5-77dc788b1781.png" 
                  alt="Kent Burchard - Founder" 
                  className={`w-full h-auto transition-all duration-1000 ${liftTheVeil ? 'filter saturate-110 brightness-105' : ''}`}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">Kent Burchard</h3>
                  <p className="text-sm text-gray-500">Founder & Sound Researcher</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <Card className={liftTheVeil ? 'border-purple-300 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900' : ''}>
                <CardContent className="p-6">
                  <p className="mb-4">
                    {content.bio}
                  </p>
                  <p className="mb-4">
                    {content.journey}
                  </p>
                  <p className="mb-4">
                    {content.mission}
                  </p>
                  <p>
                    {content.quote}
                  </p>
                </CardContent>
              </Card>
              
              <motion.div
                animate={{ 
                  opacity: [0.7, 1, 0.7], 
                  scale: liftTheVeil ? [1, 1.01, 1] : 1 
                }}
                transition={{ 
                  duration: liftTheVeil ? 3 : 0,
                  repeat: liftTheVeil ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                {liftTheVeil && (
                  <div className="text-right text-sm italic text-pink-400">
                    — Sacred Shifter: Remembering Truth
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Animated Quotes */}
          <div className="mt-16 space-y-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.2), duration: 0.8 }}
                className={`p-6 rounded-lg ${liftTheVeil 
                  ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-pink-500/20' 
                  : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20'}`}
              >
                <motion.p 
                  animate={{ 
                    textShadow: liftTheVeil 
                      ? ['0 0 3px rgba(236,72,153,0.3)', '0 0 7px rgba(236,72,153,0.5)', '0 0 3px rgba(236,72,153,0.3)']
                      : ['0 0 3px rgba(147,51,234,0.3)', '0 0 7px rgba(147,51,234,0.5)', '0 0 3px rgba(147,51,234,0.3)']
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                  className="text-center italic text-lg md:text-xl text-white"
                >
                  "{quote}"
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* About Sacred Shifter Component */}
          <div className="mt-16">
            <h2 className={`text-2xl font-bold mb-8 ${liftTheVeil ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text' : 'text-purple-900 dark:text-purple-100'}`}>
              About Sacred Shifter
            </h2>
            
            <AboutSacredShifter />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
