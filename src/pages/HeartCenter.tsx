
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';

const HeartCenter: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [activeFrequency, setActiveFrequency] = useState<string | null>(null);
  
  const heartFrequencies = [
    { name: "Love", frequency: "639 Hz", description: "Connects relationships and fosters harmony" },
    { name: "Healing", frequency: "528 Hz", description: "DNA repair and transformation" },
    { name: "Compassion", frequency: "174 Hz", description: "Pain reduction and energy circulation" },
    { name: "Forgiveness", frequency: "963 Hz", description: "Awakens intuition and higher consciousness" }
  ];
  
  return (
    <Layout pageTitle="Heart Center" theme="cosmic">
      <div className="container mx-auto py-6 relative">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="text-pink-500" />
          Heart Center
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
              <p className="mb-4">
                Welcome to the Heart Center, a sacred space for cultivating love, compassion, and emotional healing.
                Here you can access heart-centered practices and frequencies designed to open and balance
                your heart chakra.
              </p>
              
              {liftTheVeil ? (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
                >
                  With the veil lifted, you can sense the deeper resonance of the heart frequencies. 
                  Feel how they awaken the dormant connections between all beings, revealing the unity 
                  that transcends separation.
                </motion.p>
              ) : (
                <p className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  The heart chakra, known as Anahata, vibrates at frequencies that promote compassion, 
                  unconditional love, and emotional balance when in harmony.
                </p>
              )}
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Heart Frequencies</h2>
              <div className="grid grid-cols-2 gap-4">
                {heartFrequencies.map((item) => (
                  <Card 
                    key={item.name} 
                    className={`border transition-all cursor-pointer ${
                      activeFrequency === item.name 
                        ? (liftTheVeil ? 'border-pink-500 bg-pink-900/30' : 'border-purple-500 bg-purple-900/30')
                        : 'bg-black/30 border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setActiveFrequency(activeFrequency === item.name ? null : item.name)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-lg">{item.name}</span>
                        <span className={`text-sm ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`}>
                          {item.frequency}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-gray-300">
                      {item.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/dashboard">
                <Button 
                  variant="outline"
                  className={`${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
                >
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-lg flex flex-col items-center justify-center p-4 relative min-h-[400px]">
            <SacredGeometryVisualizer 
              defaultShape="flower-of-life" 
              size="lg" 
              showControls={true}
              className="absolute inset-0 w-full h-full"
              chakra="heart"
              isVisible={true}
            />
            
            <div className="z-10 text-center p-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full"
              >
                <Heart className={`h-16 w-16 ${liftTheVeil ? 'text-pink-500' : 'text-pink-600'}`} />
              </motion.div>
              
              <h2 className="mt-4 text-xl font-medium text-white">Heart Chakra Activation</h2>
              <p className="mt-2 text-gray-200 max-w-md">
                The sacred geometry above represents the infinite nature of love and connection
                that radiates from the heart center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HeartCenter;
