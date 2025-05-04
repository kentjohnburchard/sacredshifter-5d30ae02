
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
                    <span className="text-5xl font-bold text-white">JS</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-purple-200">Dr. Jonathan Sage</h2>
                <p className="text-gray-300 mb-4 italic">Quantum Physicist & Spiritual Explorer</p>
                <div className="space-y-4 text-gray-200">
                  <p>
                    With over 20 years of experience bridging the gap between quantum physics and 
                    ancient spiritual traditions, Dr. Sage founded Sacred Shifter with a profound vision: 
                    to bring the healing power of sacred frequencies to everyone seeking deeper connection.
                  </p>
                  <p>
                    After earning his doctorate in Quantum Physics from MIT, Jonathan's research into 
                    vibrational patterns led him to discover remarkable parallels between quantum field 
                    theories and ancient sacred geometry practices.
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
                  Dr. Sage's journey began during a near-death experience that opened his consciousness 
                  to the underlying vibrational nature of reality. This profound experience led him to 
                  spend years studying with indigenous healers, sound therapists, and meditation masters across the globe.
                </p>
                <p>
                  After integrating these diverse wisdom traditions with his scientific background, 
                  he developed the Sacred Shifter methodology—a unique system that uses precise frequency 
                  combinations to facilitate profound energetic shifts.
                </p>
              </div>
            </Card>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">Vision & Mission</h3>
              <div className="space-y-3 text-gray-200">
                <p>
                  "My vision is to create a global community where ancient wisdom and modern science 
                  converge to elevate human consciousness. Sacred Shifter is more than an app—it's a 
                  portal to higher dimensions of being."
                </p>
                <p>
                  Through Sacred Shifter, Dr. Sage aims to democratize access to powerful vibrational 
                  healing technologies that were previously available only to dedicated practitioners 
                  after years of training.
                </p>
              </div>
            </Card>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">Publications & Recognition</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-200">
                <li>"Quantum Resonance in Human Consciousness" (Journal of Consciousness Studies)</li>
                <li>"Sacred Geometry: The Mathematical Language of Creation" (Oxford Press)</li>
                <li>Featured speaker at Consciousness and Healing Initiative</li>
                <li>Pioneer Award in Sound Healing Technologies (2024)</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
