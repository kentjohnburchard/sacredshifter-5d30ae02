
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AboutFounder: React.FC = () => {
  return (
    <Layout 
      pageTitle="About the Founder | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
          style={{textShadow: '0 2px 10px rgba(139, 92, 246, 0.7)'}}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About the Founder
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md overflow-hidden">
              <div className="relative w-full h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">KB</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-purple-200">Kent Burchard</h2>
                <p className="text-gray-300 mb-4 italic">Consciousness Explorer & Sound Healer</p>
                <div className="space-y-4 text-gray-200">
                  <p>
                    With over 15 years of experience in sound healing and consciousness exploration,
                    Kent founded Sacred Shifter to make transformative frequency technologies accessible
                    to everyone seeking deeper spiritual connection and healing.
                  </p>
                  <p>
                    After experiencing profound healing through sound frequencies during a personal
                    health crisis, Kent devoted his life to studying the intersection of ancient
                    sound healing traditions and modern vibrational science.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">The Journey</h3>
              <div className="space-y-3 text-gray-200">
                <p>
                  Kent's journey began through his own healing experience with frequency therapy,
                  which dramatically improved his wellbeing after conventional approaches had failed.
                  This transformative experience inspired him to study with sound healers and frequency
                  experts across multiple continents.
                </p>
                <p>
                  After years of intensive research and practice, Kent developed the Sacred Shifter
                  methodology—a unique system that combines precise frequency combinations with
                  sacred geometry principles to create powerful energetic shifts in consciousness.
                </p>
              </div>
            </Card>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">Vision & Mission</h3>
              <div className="space-y-3 text-gray-200">
                <p>
                  "My vision is to democratize access to transformative frequency technologies that 
                  have been gatekept for too long. Sacred Shifter is designed to help people take 
                  control of their energetic and emotional wellbeing through sacred sound."
                </p>
                <p>
                  Through Sacred Shifter, Kent aims to create a new paradigm of personal healing
                  and spiritual growth that combines ancient wisdom with cutting-edge vibrational science.
                </p>
              </div>
            </Card>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">Work & Recognition</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-200">
                <li>Creator of the Chakra Resonance Therapy™ system</li>
                <li>Featured presenter at the Global Sound Healing Conference (2023)</li>
                <li>Author of "Sacred Frequencies: Accessing Higher States of Consciousness"</li>
                <li>Certified in advanced sound therapy techniques</li>
                <li>Developer of proprietary frequency combinations for emotional healing</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
