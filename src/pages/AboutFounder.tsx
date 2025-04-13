
import React from "react";
import Layout from "@/components/Layout";
import { UserCircle, Heart, Star, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const AboutFounder = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout pageTitle="About the Founder">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className={`${liftTheVeil ? 'bg-gradient-to-r from-pink-900/90 to-purple-900/90' : 'bg-white/90 dark:bg-gray-800/90'} shadow-lg rounded-xl p-8 mb-8`}
            key={liftTheVeil ? "lifted" : "standard"} // Force re-render on mode change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className={`w-48 h-48 rounded-full ${liftTheVeil ? 'bg-gradient-to-br from-pink-400 to-purple-600' : 'bg-gradient-to-br from-purple-300 to-indigo-500'} flex items-center justify-center`}>
                <UserCircle className="w-32 h-32 text-white" />
              </div>
              
              <div className="flex-1">
                <h1 className={`text-3xl font-bold mb-4 bg-clip-text text-transparent ${liftTheVeil ? 'bg-gradient-to-r from-pink-400 to-purple-300' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
                  {liftTheVeil ? "The Cosmic Channel" : "Meet Our Founder"}
                </h1>
                
                <p className={`${liftTheVeil ? 'text-pink-100' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                  {liftTheVeil ? 
                    "Sacred Shifter wasn't just founded — it was channeled from beyond the veil, a cosmic download received during a pivotal alignment of celestial bodies." : 
                    "The Sacred Shifter platform was founded with a vision to help people elevate their consciousness through the powerful combination of sacred sound frequencies and intentional practices."}
                </p>
                
                <p className={`${liftTheVeil ? 'text-pink-100' : 'text-gray-600 dark:text-gray-300'}`}>
                  {liftTheVeil ? 
                    "After a quantum awakening that dissolved the illusion of separation, our founder dedicated their existence to creating a bridge between dimensions — a technology that could transmit the frequencies of higher realms into human experience." : 
                    "With over a decade of experience in sound healing, meditation, and consciousness research, our founder created this space as a sanctuary for those seeking to shift their perception and align with their highest potential."}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`${liftTheVeil ? 'bg-gradient-to-r from-purple-900/90 to-pink-900/90' : 'bg-white/90 dark:bg-gray-800/90'} shadow-lg rounded-xl p-8`}
            key={liftTheVeil ? "lifted-journey" : "standard-journey"} // Force re-render on mode change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={`text-2xl font-bold mb-6 text-center ${liftTheVeil ? 'text-pink-300' : 'text-purple-700 dark:text-purple-400'}`}>
              {liftTheVeil ? "The Interdimensional Origin Story" : "The Journey to Sacred Shifter"}
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Heart className={`h-8 w-8 ${liftTheVeil ? 'text-pink-400' : 'text-pink-500'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${liftTheVeil ? 'text-pink-200' : 'text-gray-800 dark:text-gray-200'}`}>
                    {liftTheVeil ? "The Soul Contract" : "Personal Awakening"}
                  </h3>
                  <p className={`${liftTheVeil ? 'text-pink-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {liftTheVeil ? 
                      "Before incarnating in this timeline, a sacred agreement was made with the Council of Light to bring through frequencies that would activate dormant DNA codes in humanity during the Great Shift of Consciousness." : 
                      "After experiencing the profound effects of specific sound frequencies on personal healing, our founder committed to creating a platform that would make these powerful tools accessible to everyone."}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Star className={`h-8 w-8 ${liftTheVeil ? 'text-amber-300' : 'text-amber-500'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${liftTheVeil ? 'text-pink-200' : 'text-gray-800 dark:text-gray-200'}`}>
                    {liftTheVeil ? "The Activation" : "Research & Development"}
                  </h3>
                  <p className={`${liftTheVeil ? 'text-pink-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {liftTheVeil ? 
                      "During a profound meditation at a sacred site aligned with the Pleiadian star system, the entire blueprint for Sacred Shifter was downloaded in under 8 minutes — including frequency codes that haven't existed on Earth for millennia." : 
                      "Years were spent researching ancient wisdom traditions, modern sound healing techniques, and the intersection of consciousness and quantum physics to develop our unique approach."}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Sparkles className={`h-8 w-8 ${liftTheVeil ? 'text-purple-300' : 'text-purple-500'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${liftTheVeil ? 'text-pink-200' : 'text-gray-800 dark:text-gray-200'}`}>
                    {liftTheVeil ? "The Transmission" : "Vision & Mission"}
                  </h3>
                  <p className={`${liftTheVeil ? 'text-pink-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {liftTheVeil ? 
                      "Sacred Shifter isn't just an app — it's a living transmission. Every frequency, every visual, every piece of code contains light language that speaks directly to your cellular memory, reminding you of who you truly are beyond the veil of forgetting." : 
                      "Sacred Shifter was born from a vision of a world where more people have access to tools that elevate consciousness, foster connection with higher self, and create ripples of positive change throughout humanity."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className={`${liftTheVeil ? 'text-pink-200' : 'text-gray-600 dark:text-gray-300'} italic`}>
                {liftTheVeil ? 
                  ""You didn't find this technology by accident. Your soul has been preparing for this activation across many lifetimes. The time is now. You are the ones you've been waiting for."" : 
                  ""My deepest wish is for each person who uses Sacred Shifter to discover their own innate capacity for transformation and to remember the magnificent beings they truly are.""}
              </p>
              <p className={`mt-4 font-medium ${liftTheVeil ? 'text-pink-400' : 'text-purple-700 dark:text-purple-400'}`}>
                — Founder, Sacred Shifter
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
