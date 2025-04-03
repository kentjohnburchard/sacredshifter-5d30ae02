
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Sparkles, CircleOff, Music4, Layers, MessageSquare, Circle, Compass, Info } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import { motion } from "framer-motion";
import { hermeticJourneys, HermeticJourney } from "@/data/hermeticJourneys";
import { HermeticJourneyDetail, HermeticWisdomDrop } from "@/components/hermetic-wisdom";

const hermetic = [
  {
    id: "mentalism",
    title: "Mentalism",
    quote: "The All is Mind; the Universe is Mental.",
    description: "Your thoughts shape reality. Every session is a co-creation.",
    affirmation: "My thoughts are the source of my power.",
    frequency: healingFrequencies.find(f => f.frequency === 963) || healingFrequencies[5], // Crown Chakra
    animation: "Radiant energy grid expanding from the crown",
    tag: "hermetic_mentalism",
    icon: Sparkles,
    color: "from-indigo-300 to-purple-600"
  },
  {
    id: "correspondence",
    title: "Correspondence",
    quote: "As above, so below; as within, so without.",
    description: "Your outer world reflects your inner truth.",
    affirmation: "I shift my world by shifting within.",
    frequency: healingFrequencies.find(f => f.frequency === 852) || healingFrequencies[4], // Third Eye Chakra
    animation: "Fractal mirrors + kaleidoscopic symmetry",
    tag: "hermetic_correspondence",
    icon: Layers,
    color: "from-indigo-400 to-purple-700"
  },
  {
    id: "vibration",
    title: "Vibration",
    quote: "Nothing rests; everything moves; everything vibrates.",
    description: "Everything is frequency—choose yours consciously.",
    affirmation: "I align with the frequency of my highest self.",
    frequency: healingFrequencies.find(f => f.frequency === 528) || healingFrequencies[1], // Heart Chakra
    animation: "Golden solar pulses with resonant wave trails",
    tag: "hermetic_vibration",
    icon: Music4,
    color: "from-amber-300 to-yellow-600"
  },
  {
    id: "polarity",
    title: "Polarity",
    quote: "Everything is Dual; everything has poles.",
    description: "Embrace both joy and shadow; both are teachers.",
    affirmation: "I find harmony within all contrasts.",
    frequency: healingFrequencies.find(f => f.frequency === 639) || healingFrequencies[2], // Heart Chakra
    animation: "Yin-yang orbiting spheres + pulsing gradients",
    tag: "hermetic_polarity",
    icon: CircleOff,
    color: "from-green-300 to-teal-600"
  },
  {
    id: "rhythm",
    title: "Rhythm",
    quote: "Everything flows, out and in.",
    description: "Trust the cycles of your life and healing.",
    affirmation: "I ride the rhythm of life with grace.",
    frequency: healingFrequencies.find(f => f.frequency === 417) || healingFrequencies[8], // Sacral Chakra
    animation: "Tidal waves, rhythmic swaying lights",
    tag: "hermetic_rhythm",
    icon: Circle,
    color: "from-orange-300 to-orange-600"
  },
  {
    id: "cause-effect",
    title: "Cause & Effect",
    quote: "Every Cause has its Effect.",
    description: "You are a creator. Your vibration sets reality in motion.",
    affirmation: "I act with conscious intent.",
    frequency: healingFrequencies.find(f => f.frequency === 741) || healingFrequencies[3], // Throat Chakra
    animation: "Ripple-to-manifestation pulse effect",
    tag: "hermetic_cause_effect",
    icon: MessageSquare,
    color: "from-blue-300 to-blue-600"
  },
  {
    id: "gender",
    title: "Gender",
    quote: "Gender is in everything; Masculine and Feminine exist in all.",
    description: "Inner balance leads to divine creation.",
    affirmation: "I embody both stillness and flow.",
    frequency: healingFrequencies.find(f => f.frequency === 396) || healingFrequencies[7], // Root Chakra
    animation: "Dual-flow energy currents interweaving",
    tag: "hermetic_gender",
    icon: Compass,
    color: "from-red-300 to-red-600"
  }
];

const HermeticWisdom = () => {
  const navigate = useNavigate();
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<HermeticJourney | null>(null);

  const handleExplore = (tag: string) => {
    // Find the corresponding journey for the principle
    const journey = hermeticJourneys.find(j => j.tag === tag);
    if (journey) {
      setSelectedJourney(journey);
      setSelectedPrinciple(journey.principle);
    } else {
      console.log(`No journey found for tag: ${tag}`);
    }
  };

  const handleBack = () => {
    setSelectedJourney(null);
    setSelectedPrinciple(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {selectedJourney ? (
          <div className="mb-8">
            <HermeticJourneyDetail journey={selectedJourney} onBack={handleBack} />
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light mb-4">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Hermetic Wisdom Hub
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These 7 principles come from the ancient teachings of Hermes Trismegistus, as written in the Kybalion. 
                They form the foundation of vibrational alignment, intention, and spiritual transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hermetic.map((principle) => (
                <motion.div
                  key={principle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: hermetic.indexOf(principle) * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`h-3 bg-gradient-to-r ${principle.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${principle.color} bg-opacity-10`}>
                          <principle.icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">{principle.title}</h3>
                      </div>
                      <HermeticWisdomDrop 
                        principle={principle.title} 
                        variant="dialog"
                      >
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full"
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Vale's Wisdom</span>
                        </Button>
                      </HermeticWisdomDrop>
                    </div>
                    
                    <p className="italic text-gray-600 mb-3">"{principle.quote}"</p>
                    <p className="text-gray-700 mb-3">{principle.description}</p>
                    <div className="mb-3 text-sm text-gray-600">
                      <strong>Affirmation:</strong> {principle.affirmation}
                    </div>
                    <div className="mb-3 text-sm text-gray-600">
                      <strong>Frequency:</strong> {principle.frequency.name} ({principle.frequency.frequency}Hz)
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                      <strong>Animation:</strong> {principle.animation}
                    </div>
                    
                    <Button
                      onClick={() => handleExplore(principle.tag)}
                      className={`w-full bg-gradient-to-r ${principle.color} text-white hover:opacity-90`}
                    >
                      Explore {principle.title}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discover More About Hermetic Principles</h2>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="kybalion">
                  <AccordionTrigger className="text-gray-800">About The Kybalion</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      The Kybalion is a book published in 1908 by "Three Initiates" that claims to present the essence of the 
                      teachings of Hermes Trismegistus. These principles have influenced esoteric and spiritual traditions worldwide.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="application">
                  <AccordionTrigger className="text-gray-800">Applying These Principles</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Each principle offers a unique lens through which to understand yourself and the universe. 
                      Through meditation, sound healing, and intention setting, you can align with these universal laws.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="history">
                  <AccordionTrigger className="text-gray-800">Historical Context</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">
                      Hermes Trismegistus is a legendary figure associated with the Greek god Hermes and the Egyptian god Thoth. 
                      The teachings attributed to him have influenced alchemy, astrology, and various mystical traditions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="text-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HermeticWisdom;
