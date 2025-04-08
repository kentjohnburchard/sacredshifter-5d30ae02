
import React from 'react';
import Layout from '@/components/Layout';
import HarmonicMapViewer from '@/components/harmonic-map/HarmonicMapViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Music, Sparkles, Compass } from 'lucide-react'; // Removed CircleInfo, using Info instead
import { teslaThreeSixNine } from '@/data/harmonicSequence';

const HarmonicMapPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center my-6">
            <h1 className="text-4xl font-light mb-4">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Harmonic Sequence Map
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the sacred geometry of harmonics, Hermetic principles, and Tesla's 3-6-9 pattern
              as they manifest in frequencies of creation.
            </p>
          </div>

          <Tabs defaultValue="map" className="w-full mb-12">
            <TabsList className="mb-6 w-full max-w-md mx-auto">
              <TabsTrigger value="map" className="w-1/3">
                <Compass className="h-4 w-4 mr-2" />
                Interactive Map
              </TabsTrigger>
              <TabsTrigger value="tesla" className="w-1/3">
                <Sparkles className="h-4 w-4 mr-2" />
                Tesla's 3-6-9
              </TabsTrigger>
              <TabsTrigger value="about" className="w-1/3">
                <Info className="h-4 w-4 mr-2" /> {/* Changed from CircleInfo to Info */}
                About Harmonics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map">
              <HarmonicMapViewer />
            </TabsContent>
            
            <TabsContent value="tesla">
              <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-purple-800 mb-4">
                    {teslaThreeSixNine.title}
                  </h2>
                  <p className="text-gray-700">
                    {teslaThreeSixNine.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {teslaThreeSixNine.principles.map(principle => (
                    <div 
                      key={principle.number}
                      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100 shadow-sm"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-3xl font-bold text-amber-600">
                          {principle.number}
                        </div>
                      </div>
                      <h3 className="text-xl font-medium text-center mb-3">{principle.title}</h3>
                      <p className="text-gray-700 text-sm mb-4">{principle.description}</p>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <div className="font-medium text-sm text-purple-800 mb-1">Applications:</div>
                        <p className="text-xs text-gray-600">{principle.applications}</p>
                      </div>
                      <div className="mt-4 text-center">
                        <button className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800">
                          <Music size={16} className="mr-1" />
                          Listen to {principle.frequencies[0]}Hz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center max-w-2xl mx-auto">
                  <h3 className="text-xl font-medium mb-3">The Vortex-Based Mathematics Connection</h3>
                  <p className="text-gray-700 mb-4">
                    Tesla's work influenced vortex mathematics, which shows how the 3-6-9 pattern reveals fundamental
                    energy flows in the universe. This pattern is reflected in the harmonic sequence and the way
                    energy organizes itself across different scales.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="italic text-gray-600">
                      "The day science begins to study non-physical phenomena, it will make more progress in one decade
                      than in all the previous centuries of its existence."
                      <span className="block mt-2 text-sm font-medium">— Nikola Tesla</span>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-purple-800">
                    The Sacred Science of Harmonics
                  </h2>
                </div>
                
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Harmonic Sequence</h3>
                      <p className="text-gray-700">
                        The harmonic sequence is a mathematical representation of the natural overtone series found in music and nature.
                        It follows simple whole-number ratios that create consonant and dissonant relationships.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-purple-600 font-medium mr-2">1:1</span>
                          <span>The fundamental frequency (unison/octave)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 font-medium mr-2">2:1</span>
                          <span>The octave - doubling the frequency</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 font-medium mr-2">3:2</span>
                          <span>The perfect fifth - creates harmony</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 font-medium mr-2">4:3</span>
                          <span>The perfect fourth - creates stability</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Sacred Geometry Connection</h3>
                      <p className="text-gray-700">
                        The harmonic sequence is deeply connected to sacred geometry and universal principles.
                        These mathematical relationships appear in nature, architecture, music, and throughout the cosmos.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-600 font-medium mr-2">Golden Ratio</span>
                          <span>Appears in the harmonic proportions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 font-medium mr-2">Fibonacci Sequence</span>
                          <span>Related to harmonics through growth patterns</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 font-medium mr-2">Platonic Solids</span>
                          <span>Geometric forms that relate to harmony</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-3 text-center">Healing Applications</h3>
                    <p className="text-gray-700 text-center mb-4">
                      These harmonic frequencies can be used for sound healing and vibrational therapy,
                      helping to restore balance and harmony in the body's energy systems.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-purple-800">Physical Healing</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Specific frequencies can assist with physical healing by promoting cellular resonance
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-purple-800">Emotional Balance</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Harmonic intervals help restore emotional equilibrium and release stagnant energy
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-purple-800">Mental Clarity</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Certain frequencies promote focus, concentration and mental clarity
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-purple-800">Spiritual Connection</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Higher harmonics facilitate meditation and spiritual awareness
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default HarmonicMapPage;
