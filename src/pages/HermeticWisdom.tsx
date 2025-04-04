
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
import HermeticPrincipleCard from "@/components/hermetic-wisdom/HermeticPrincipleCard";

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
    <Layout pageTitle="Hermetic Wisdom Hub">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {selectedJourney ? (
          <div className="mb-8">
            <HermeticJourneyDetail journey={selectedJourney} onBack={handleBack} />
          </div>
        ) : (
          <>
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-playfair text-4xl font-light mb-6">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  The 7 Hermetic Principles
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
                These 7 principles come from the ancient teachings of Hermes Trismegistus, as written in the Kybalion. 
                They form the foundation of vibrational alignment, intention, and spiritual transformation.
              </p>
              <p className="text-md text-gray-600 max-w-3xl mx-auto">
                Each principle corresponds to a specific frequency that resonates with different aspects of our being, 
                creating a powerful framework for understanding how vibration shapes our reality.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {hermetic.map((principle) => (
                <HermeticPrincipleCard
                  key={principle.id}
                  id={principle.id}
                  title={principle.title}
                  quote={principle.quote}
                  description={principle.description}
                  affirmation={principle.affirmation}
                  frequency={principle.frequency.frequency}
                  frequencyName={principle.frequency.name}
                  animation={principle.animation}
                  color={principle.color}
                  tag={principle.tag}
                  icon={principle.icon}
                  onClick={() => handleExplore(principle.tag)}
                />
              ))}
            </div>

            <motion.div 
              className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-6">Understanding Hermetic Wisdom & Frequency</h2>
              
              <div className="prose max-w-none">
                <p className="mb-4">
                  The Hermetic principles provide a profound framework for understanding the relationship 
                  between consciousness, vibration, and manifestation. These ancient teachings remain remarkably 
                  relevant in our modern understanding of quantum physics and vibrational medicine.
                </p>
                
                <h3 className="font-playfair text-xl mt-6 mb-3">Frequencies & Hermetic Principles</h3>
                <p className="mb-4">
                  Each Hermetic principle is associated with a specific frequency that resonates with different 
                  aspects of our consciousness and physical being. These frequencies align with our chakra system,
                  creating powerful opportunities for transformation through sound.
                </p>
                
                <div className="bg-purple-50 p-6 rounded-lg mb-6">
                  <h4 className="font-playfair text-lg font-medium mb-3">Key Frequency-Principle Connections:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Mentalism (963Hz)</strong> - Crown Chakra - Pure consciousness, universal mind connection</li>
                    <li><strong>Correspondence (852Hz)</strong> - Third Eye Chakra - Inner sight, pattern recognition</li>
                    <li><strong>Vibration (528Hz)</strong> - Heart Chakra (center) - DNA repair, harmony, transformation</li>
                    <li><strong>Polarity (639Hz)</strong> - Heart Chakra (emotional) - Balance, harmonizing opposites</li>
                    <li><strong>Rhythm (417Hz)</strong> - Sacral Chakra - Flow, creativity, cyclical wisdom</li>
                    <li><strong>Cause & Effect (741Hz)</strong> - Throat Chakra - Expression, manifestation</li>
                    <li><strong>Gender (396Hz)</strong> - Root Chakra - Grounding, stability, balance of energies</li>
                  </ul>
                </div>
                
                <h3 className="font-playfair text-xl mt-6 mb-3">Scientific Foundations</h3>
                <p className="mb-4">
                  Modern science has begun to validate what ancient wisdom has long taught. Cymatics—the study 
                  of visible sound vibration—shows how different frequencies create distinct geometric patterns 
                  in physical matter. This perfectly aligns with the Hermetic principle that "everything vibrates."
                </p>
                
                <p className="mb-4">
                  When we consciously work with frequencies through meditation, sound healing, or intention setting, 
                  we're directly applying Hermetic principles to shift our physical and energetic state.
                </p>
                
                <h3 className="font-playfair text-xl mt-6 mb-3">Application in Sacred Shifter</h3>
                <p className="mb-4">
                  This application leverages these principles in several ways:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li><strong>Intention Setting</strong> - Applying Mentalism by focusing consciousness</li>
                  <li><strong>Frequency Journeys</strong> - Using specific vibrational frequencies to shift your energy</li>
                  <li><strong>Chakra Alignment</strong> - Working with Correspondence to balance inner and outer</li>
                  <li><strong>Timeline Tracking</strong> - Observing the Rhythm and Cause & Effect in your healing journey</li>
                </ul>
                
                <div className="border-l-4 border-purple-500 pl-4 italic">
                  "When you change the frequency of your consciousness, you change the frequency of your reality.
                  This is not metaphor—it's vibrational physics."
                </div>
              </div>
              
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="kybalion">
                  <AccordionTrigger className="text-gray-800 font-playfair">History of The Kybalion</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">
                      The Kybalion was first published in 1908 by "Three Initiates" (widely believed to include William 
                      Walker Atkinson). It claims to present the essence of the teachings of Hermes Trismegistus, 
                      a legendary figure associated with both the Greek god Hermes and the Egyptian god Thoth.
                    </p>
                    <p className="text-gray-700">
                      These teachings were part of the Hermetic tradition that heavily influenced alchemy, astrology, 
                      and various mystical traditions throughout history. The text has been foundational to Western 
                      esoteric traditions and continues to inform modern spiritual practices.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="application">
                  <AccordionTrigger className="text-gray-800 font-playfair">Daily Application of Hermetic Principles</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">
                      Integrating these principles into daily life can be transformative:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li><strong>Mentalism</strong> - Practice thought awareness and conscious creation</li>
                      <li><strong>Correspondence</strong> - Notice parallels between your inner state and outer reality</li>
                      <li><strong>Vibration</strong> - Choose environments, music, and people that match your desired frequency</li>
                      <li><strong>Polarity</strong> - Find balance between opposing forces rather than resisting them</li>
                      <li><strong>Rhythm</strong> - Recognize life's cycles and flow with them rather than against them</li>
                      <li><strong>Cause & Effect</strong> - Take responsibility for your choices and their ripple effects</li>
                      <li><strong>Gender</strong> - Balance receptive and projective energies in your creativity and relationships</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="quantum">
                  <AccordionTrigger className="text-gray-800 font-playfair">Quantum Physics & Hermetic Wisdom</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 mb-3">
                      Modern quantum physics has revealed surprising parallels to Hermetic principles:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>The observer effect demonstrates how consciousness (Mentalism) affects physical reality</li>
                      <li>Quantum entanglement mirrors the principle of Correspondence ("as above, so below")</li>
                      <li>String theory proposes that all matter consists of tiny vibrating strings (Vibration)</li>
                      <li>Wave-particle duality reflects Polarity at the quantum level</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                      These connections suggest that ancient mystics may have intuitively understood aspects of reality 
                      that science is only now beginning to verify through empirical methods.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <motion.div 
              className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
                <h2 className="font-playfair text-2xl font-semibold mb-2">Sacred Frequency Journey</h2>
                <p>
                  Experience the power of Hermetic principles through guided frequency meditation journeys 
                  designed to align your consciousness with universal wisdom.
                </p>
              </div>
              <div className="p-6">
                <p className="mb-4">
                  Each journey combines specific frequencies, guided visualization, and Hermetic wisdom 
                  to create profound shifts in your energy and consciousness.
                </p>
                <Button 
                  onClick={() => navigate("/journey-templates")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                >
                  Explore All Journeys
                </Button>
              </div>
            </motion.div>

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
