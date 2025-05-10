
import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChakraTag, CHAKRA_COLORS } from '@/types/chakras';
import { PlusCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import our new circle components
import AmbientBackground from '@/components/circle/AmbientBackground';
import CircleFeed from '@/components/circle/CircleFeed';
import GuideCard from '@/components/circle/GuideCard';
import VibeOrb from '@/components/circle/VibeOrb';

// Mock data for guided resonance cards
const guidedResonanceCards = [
  {
    id: '1',
    title: 'Heart Opening Journey',
    type: 'journey' as const,
    description: 'Connect with your heart center through this guided meditation with 528Hz frequency',
    chakra: 'Heart' as ChakraTag,
    frequency: 528,
    audioUrl: '/frequencies/528hz.mp3',
    upvotes: 24,
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=500&auto=format&fit=crop',
    authorName: 'Cosmic Guide',
  },
  {
    id: '2',
    title: 'Theta Wave Resonance',
    type: 'tone' as const,
    description: 'Deep meditation frequency to access subconscious wisdom',
    chakra: 'Third Eye' as ChakraTag,
    frequency: 7.83,
    audioUrl: '/frequencies/theta.mp3',
    upvotes: 18,
    imageUrl: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'As Above, So Below',
    type: 'quote' as const,
    description: 'Hermetic wisdom from the Kybalion to contemplate during your spiritual practice',
    chakra: 'Crown' as ChakraTag,
    upvotes: 32,
    saved: true,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop',
    authorName: 'Hermetic Teachings',
  }
];

const SacredCirclePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeChakra, setActiveChakra] = useState<ChakraTag>('Heart');
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  
  // Increase ambient intensity when user interacts with the page
  useEffect(() => {
    const handleInteraction = () => {
      setAmbientIntensity(0.8);
      setTimeout(() => setAmbientIntensity(0.5), 3000);
    };
    
    window.addEventListener('click', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
    };
  }, []);
  
  // Handle guide card actions
  const handlePlayGuide = (id: string) => {
    console.log(`Playing guide: ${id}`);
    // Implement actual play functionality
  };
  
  const handleSaveGuide = (id: string) => {
    console.log(`Saving guide: ${id}`);
    // Implement actual save functionality
  };
  
  const handleShareGuide = (id: string) => {
    console.log(`Sharing guide: ${id}`);
    // Implement actual share functionality
  };
  
  return (
    <AppShell 
      pageTitle="Sacred Circle" 
      chakraColor={CHAKRA_COLORS[activeChakra]} // Dynamic color based on active chakra
    >
      {/* Ambient Background */}
      <AmbientBackground 
        activeChakra={activeChakra} 
        intensity={ambientIntensity}
        pulsing={true}
      />
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Sacred Circle
              </h1>
              <p className="text-white/70 max-w-xl">
                Connect with fellow lightbearers in this high-frequency space for spiritual communion, wisdom sharing, and collective resonance.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/circle")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Enter Full Circle
              </Button>
              <Button variant="outline" className="border-purple-500/30">
                <Info className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Circle Feed */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CircleFeed initialChakra={activeChakra} />
            </motion.div>
            
            {/* Sidebar Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Guided Resonance Cards */}
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white">Guided Resonance</h3>
                    <Button variant="ghost" size="sm">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {guidedResonanceCards.map((card) => (
                      <GuideCard 
                        key={card.id}
                        item={card}
                        onPlay={handlePlayGuide}
                        onSave={handleSaveGuide}
                        onShare={handleShareGuide}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Featured Circle Members */}
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Featured Lightbearers</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <VibeOrb 
                      user={{
                        id: '2',
                        name: 'Cosmic Guide',
                        currentVibe: 'Third Eye',
                        chakraAlignment: 'Third Eye',
                        currentFrequency: 852,
                        isActive: true
                      }}
                      size="sm"
                    />
                    <VibeOrb 
                      user={{
                        id: '4',
                        name: 'Harmony Celestia',
                        currentVibe: 'Crown',
                        chakraAlignment: 'Crown',
                        currentFrequency: 963,
                        isActive: true
                      }}
                      size="sm"
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Button variant="outline" size="sm" className="w-full">
                      Find More Lightbearers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SacredCirclePage;
