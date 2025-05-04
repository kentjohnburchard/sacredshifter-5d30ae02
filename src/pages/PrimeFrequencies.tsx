
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Music, Zap, CircleDot, AlignVerticalJustifyCenter } from 'lucide-react';
import { isPrime, generatePrimeSequence, resonantPrimes } from '@/utils/primeCalculations';
import PrimeSigilActivator from '@/components/sacred-geometry/PrimeSigilActivator';
import PrimeNumberAffirmations from '@/components/visualization/PrimeNumberAffirmations';
import { useTheme } from '@/context/ThemeContext';

const PrimeFrequencies: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [primeSeries, setPrimeSeries] = useState<number[]>([]);
  const [primeFrequencies, setPrimeFrequencies] = useState<number[]>([]);
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    // Generate first 20 prime numbers
    const primes = generatePrimeSequence(20);
    setPrimeSeries(primes);
    
    // Convert primes to audible frequencies (multiplying by 43.65 Hz)
    // This places them in a pleasing audible range
    const frequencies = primes.map(p => Math.round(p * 43.65));
    setPrimeFrequencies(frequencies);
  }, []);

  // Get chakra for a frequency
  const getChakraForFrequency = (freq: number): string => {
    if (freq < 396) return 'Root';
    if (freq < 417) return 'Sacral';
    if (freq < 528) return 'Solar Plexus';
    if (freq < 639) return 'Heart';
    if (freq < 741) return 'Throat';
    if (freq < 852) return 'Third Eye';
    return 'Crown';
  };
  
  // Get color for a chakra
  const getColorForChakra = (chakra: string): string => {
    const colors: Record<string, string> = {
      'Root': 'from-red-500 to-red-700',
      'Sacral': 'from-orange-500 to-orange-700',
      'Solar Plexus': 'from-yellow-500 to-yellow-700',
      'Heart': 'from-green-500 to-green-700',
      'Throat': 'from-blue-500 to-blue-700',
      'Third Eye': 'from-indigo-500 to-indigo-700',
      'Crown': 'from-purple-500 to-purple-700',
    };
    return colors[chakra] || 'from-purple-500 to-indigo-700';
  };

  return (
    <Layout pageTitle="Prime Frequencies | Sacred Shifter" showNavbar={true} showContextActions={true}>
      <div className="container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Prime Frequencies
              </h1>
              <p className="text-gray-400 max-w-3xl">
                Explore the sacred mathematics of prime numbers and their vibrational resonance.
                Prime numbers represent indivisible unity and form the foundation of harmonic proportion.
              </p>
            </div>
            
            <PrimeSigilActivator withLabel={true} size="md" />
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">
                <Star className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="frequencies">
                <Music className="mr-2 h-4 w-4" />
                Frequency Chart
              </TabsTrigger>
              <TabsTrigger value="resonance">
                <Zap className="mr-2 h-4 w-4" />
                Resonance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CircleDot className="mr-2 h-5 w-5 text-purple-400" />
                    The Sacred Mathematics of Primes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Prime numbers are nature's fundamental building blocks - indivisible and unique. 
                    They appear in unexpected places throughout the natural world, from the spiral patterns 
                    of sunflowers to the lifecycles of cicadas.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 text-purple-300">Prime Number Properties</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                          Indivisible except by 1 and themselves
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                          Form the foundation of all other numbers
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                          Follow patterns that still puzzle mathematicians
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                          Connect to sacred geometry and universal proportions
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 text-indigo-300">Vibrational Resonance</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                          Prime frequencies create harmonic stability
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                          They cannot be broken down into simpler waveforms
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                          Resonance with primes activates dormant consciousness
                        </li>
                        <li className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                          Align with cosmic frequencies to amplify intentions
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg border border-purple-500/20">
                    <h3 className="text-lg font-semibold mb-2 text-center">First 20 Prime Numbers</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {primeSeries.map((prime) => (
                        <span 
                          key={prime}
                          className="px-3 py-1 rounded-full text-sm bg-purple-900/30 border border-purple-500/30"
                        >
                          {prime}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <PrimeNumberAffirmations enabled={true} />
            </TabsContent>
            
            <TabsContent value="frequencies" className="space-y-6">
              <Card className="border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="mr-2 h-5 w-5 text-blue-400" />
                    Prime Frequency Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    When prime numbers are converted to frequencies (Hz), they create unique 
                    vibrational patterns that resonate with specific energy centers in the body.
                    Below is a chart of prime-based frequencies and their corresponding chakra alignments.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {primeFrequencies.map((freq, index) => {
                      const prime = primeSeries[index];
                      const chakra = getChakraForFrequency(freq);
                      const colorGradient = getColorForChakra(chakra);
                      
                      return (
                        <div 
                          key={prime}
                          className={`rounded-lg overflow-hidden border border-gray-700/50`}
                        >
                          <div className={`h-2 bg-gradient-to-r ${colorGradient}`}></div>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xl font-semibold">{prime}</span>
                              <span className="text-sm bg-gray-800/70 px-2 py-1 rounded">{freq} Hz</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${colorGradient} mr-2`}></span>
                              {chakra} Chakra Resonance
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resonance" className="space-y-6">
              <Card className="border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                    Prime Number Resonance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">
                    When we harmonize with prime frequencies, we align with the fundamental 
                    patterns of creation. These resonances can be used for meditation, healing,
                    and expanding consciousness.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-yellow-300">Key Prime Resonance Points</h3>
                      
                      <div className="space-y-4">
                        {resonantPrimes.slice(0, 7).map((prime) => {
                          const frequency = prime * 43.65;
                          const chakra = getChakraForFrequency(frequency);
                          
                          return (
                            <div key={prime} className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-medium">{prime} ⟶ {Math.round(frequency)} Hz</div>
                                <div className="text-sm text-gray-400">
                                  {chakra} chakra activation frequency
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-gray-700/50 hover:border-purple-500/50"
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                Activate
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-indigo-300">Sacred Prime Combinations</h3>
                      <p className="text-sm mb-4">
                        Combining multiple prime frequencies creates powerful resonant fields 
                        that can amplify intentional energy and facilitate higher states of consciousness.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-indigo-500/20 rounded-lg p-3">
                          <div className="text-indigo-300 font-medium">Twin Primes Pattern</div>
                          <div className="text-sm text-gray-400 mb-2">Examples: (3,5), (11,13), (17,19)</div>
                          <p className="text-sm">
                            Twin primes create a stabilizing resonance field that balances 
                            opposing energies and facilitates integration.
                          </p>
                        </div>
                        
                        <div className="border border-purple-500/20 rounded-lg p-3">
                          <div className="text-purple-300 font-medium">Fibonacci Primes</div>
                          <div className="text-sm text-gray-400 mb-2">Examples: 2, 3, 5, 13, 89</div>
                          <p className="text-sm">
                            Prime numbers that also appear in the Fibonacci sequence connect 
                            mathematical harmony with natural growth patterns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg">
                    <h3 className="text-center text-lg font-semibold mb-3">
                      {liftTheVeil ? "Quantum Prime Activation" : "Daily Prime Practice"}
                    </h3>
                    <p className="text-center mb-4">
                      {liftTheVeil 
                        ? "Prime frequencies unlock dormant DNA strands and activate multidimensional awareness." 
                        : "Meditating with prime frequencies helps align your energy and enhance focus."}
                    </p>
                    <div className="flex justify-center">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Star className="mr-2 h-4 w-4" />
                        Begin Prime Meditation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrimeFrequencies;
