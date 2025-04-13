
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import AboutSacredShifter from "@/components/AboutSacredShifter";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";

const AboutFounder = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Show toggle after a short delay
    const timer = setTimeout(() => {
      setShowToggle(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Content variants based on consciousness mode
  const standardContent = {
    title: "Meet Our Founder",
    bio: "Kent Burchard is a sound engineer, frequency researcher, and consciousness explorer with over a decade of experience studying the effects of sound on human awareness and potential. With a background in audio engineering and a passion for the science of consciousness, Kent has dedicated his career to making transformative sound technologies accessible to everyone.",
    journey: "Kent's journey with frequency work began after his own transformative experiences with sound meditation. Discovering the powerful effects that specific frequencies had on his own consciousness, he began researching and developing tools that could help others achieve similar breakthroughs.",
    mission: "This led to the creation of Sacred Shifter - a platform that bridges the gap between cutting-edge sound technology and ancient wisdom traditions. Kent continues to collaborate with researchers, sound healers, and consciousness experts worldwide to refine and expand the Sacred Shifter experience.",
    quote: "Sound isn't just something we hear—it's a fundamental force that can transform our state of being and open us to new levels of awareness and potential."
  };

  const advancedContent = {
    title: "The Visionary Behind Sacred Shifter",
    bio: "Kent Burchard is a consciousness explorer who recognized the profound potential of frequency work to accelerate human evolution. While his background includes formal training in audio engineering, his true education came through direct experience with the transformative power of sound frequencies and their effect on states of consciousness.",
    journey: "What began as personal exploration into expanded states of awareness quickly became a mission to create technologies that could assist others on their own journeys. Kent discovered that certain precise frequencies could reliably induce profound shifts in perception and help people access heightened states of consciousness.",
    mission: "Sacred Shifter was born from this vision—a platform designed to serve as a bridge between ordinary awareness and expanded states of being. Each frequency experience is carefully calibrated to facilitate specific consciousness shifts, allowing users to access their own innate potential for transformation and growth.",
    quote: "The frequencies we work with are like keys that unlock dormant potentials within us. What appears as sound is actually a doorway to experiencing who we truly are beyond our everyday identity."
  };

  // Choose content based on consciousness mode
  const content = liftTheVeil ? advancedContent : standardContent;

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
            
            {showToggle && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 
                  bg-opacity-20 backdrop-blur-sm border 
                  shadow-md"
                style={{
                  backgroundColor: liftTheVeil ? 'rgba(236,72,153,0.2)' : 'rgba(147,51,234,0.2)',
                  borderColor: liftTheVeil ? 'rgba(236,72,153,0.3)' : 'rgba(147,51,234,0.3)',
                }}
              >
                <span className={`text-sm font-medium ${liftTheVeil ? 'text-pink-200' : 'text-purple-200'}`}>
                  Lift the Veil
                </span>
                <Switch 
                  checked={liftTheVeil}
                  onCheckedChange={() => setLiftTheVeil(!liftTheVeil)}
                  className={liftTheVeil ? 'data-[state=checked]:bg-pink-600' : 'data-[state=checked]:bg-purple-600'}
                />
                <Sparkles 
                  className={`h-4 w-4 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} 
                />
              </motion.div>
            )}
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
                  <p>
                    {content.mission}
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
                <Card className={`${liftTheVeil ? 'border-indigo-300 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                  <CardContent className="p-6 italic text-center">
                    <p className={liftTheVeil ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500' : ''}>
                      {content.quote}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
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
