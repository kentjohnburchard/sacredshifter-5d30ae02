
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HermeticJourneyDetail, HermeticWisdomLibrary } from "@/components/hermetic-wisdom";
import { hermeticJourneys, HermeticJourney } from "@/data/hermeticJourneys";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Library, Music, Headphones } from "lucide-react";

const HermeticWisdom = () => {
  const [selectedJourney, setSelectedJourney] = useState<HermeticJourney | null>(null);
  const { journeyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (journeyId) {
      const journey = hermeticJourneys.find(j => j.id === journeyId);
      if (journey) {
        setSelectedJourney(journey);
      } else {
        navigate("/hermetic-wisdom");
      }
    } else {
      setSelectedJourney(null);
    }
  }, [journeyId, navigate]);

  const handleBack = () => {
    setSelectedJourney(null);
    navigate("/hermetic-wisdom");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {selectedJourney ? (
          <HermeticJourneyDetail journey={selectedJourney} onBack={handleBack} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Hermetic Wisdom
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
                Explore the seven Hermetic Principles, their vibrational frequencies, 
                and how they relate to your spiritual journey and consciousness expansion.
              </p>
            </div>
            
            <Tabs defaultValue="principles" className="w-full">
              <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="principles">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Principles
                </TabsTrigger>
                <TabsTrigger value="journeys">
                  <Music className="h-4 w-4 mr-2" />
                  Journeys
                </TabsTrigger>
                <TabsTrigger value="library">
                  <Headphones className="h-4 w-4 mr-2" />
                  Sound Library
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="principles" className="space-y-6">
                <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      The Seven Hermetic Principles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      The Hermetic principles are seven ancient laws that govern reality as described in The Kybalion, 
                      based on the teachings of Hermes Trismegistus. These universal principles explain the nature of 
                      energy, consciousness, and cosmic order.
                    </p>
                    
                    <div className="space-y-6">
                      {hermeticJourneys.map((journey) => (
                        <div key={journey.id} className="border-l-4 border-purple-400 pl-4 py-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800">{journey.principle}</h3>
                            <span className="text-sm text-purple-600">{journey.frequency}Hz • {journey.chakra} Chakra</span>
                          </div>
                          <p className="text-gray-600 italic mt-1">"{journey.affirmation}"</p>
                          <p className="mt-2 text-gray-700">{journey.guidedPrompt}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Library className="h-5 w-5 text-purple-600" />
                      Scientific Context & Sacred Geometry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      The ancient Hermetic principles find surprising parallels in modern science. 
                      From quantum physics to systems theory, these ancient laws seem to anticipate 
                      discoveries made thousands of years later.
                    </p>

                    <div>
                      <h3 className="font-medium text-lg text-gray-800">Frequency Relationships</h3>
                      <p className="text-gray-700">
                        Each Hermetic principle resonates with a specific Solfeggio frequency, which corresponds 
                        to a particular chakra energy center in the body. These frequencies have been found to affect 
                        consciousness and physiology in specific ways:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                        <li><strong>963Hz (Crown):</strong> Connection to higher consciousness, spiritual awakening</li>
                        <li><strong>852Hz (Third Eye):</strong> Intuition, inner wisdom, pattern recognition</li>
                        <li><strong>741Hz (Throat):</strong> Expression, manifestation, cause-effect awareness</li>
                        <li><strong>639Hz (Heart):</strong> Harmony, connection, balance of opposites</li>
                        <li><strong>528Hz (Solar Plexus):</strong> Transformation, miracle tone, DNA repair</li>
                        <li><strong>417Hz (Sacral):</strong> Change, breaking patterns, creativity</li>
                        <li><strong>396Hz (Root):</strong> Grounding, security, foundation</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg text-gray-800">Scientific Parallels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-800">Quantum Physics</h4>
                          <p className="text-gray-700">
                            The observer effect in quantum physics echoes the Hermetic principle of Mentalism, 
                            where consciousness affects reality.
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-800">Fractal Mathematics</h4>
                          <p className="text-gray-700">
                            Self-similar patterns across different scales demonstrate the principle of Correspondence, 
                            "As above, so below."
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-800">Wave Theory</h4>
                          <p className="text-gray-700">
                            Everything from light to matter exhibits wave-particle duality, 
                            illustrating the principle of Vibration.
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-800">Systems Theory</h4>
                          <p className="text-gray-700">
                            Dynamic equilibrium in complex systems demonstrates the 
                            principles of Polarity and Rhythm working together.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journeys">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hermeticJourneys.map((journey) => (
                    <Card 
                      key={journey.id} 
                      className="border border-purple-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/hermetic-wisdom/${journey.id}`)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${getColorForChakra(journey.chakra)}`}></div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">{journey.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-purple-600 font-medium">{journey.frequency}Hz</span>
                          <span className="text-xs text-gray-500">·</span>
                          <span className="text-sm text-gray-600">{journey.chakra} Chakra</span>
                        </div>
                        <p className="italic text-gray-600 mb-4">"{journey.affirmation}"</p>
                        <p className="text-sm text-gray-700">{journey.audioDescription}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="library">
                <HermeticWisdomLibrary />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

// Helper function to get color for chakra
const getColorForChakra = (chakra: string): string => {
  switch (chakra) {
    case "Root":
      return "from-red-500 to-red-600";
    case "Sacral":
      return "from-orange-400 to-orange-500";
    case "Solar Plexus":
      return "from-yellow-400 to-yellow-500";
    case "Heart":
      return "from-green-400 to-green-500";
    case "Throat":
      return "from-blue-400 to-blue-500";
    case "Third Eye":
      return "from-indigo-400 to-indigo-500";
    case "Crown":
      return "from-purple-400 to-violet-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

export default HermeticWisdom;
