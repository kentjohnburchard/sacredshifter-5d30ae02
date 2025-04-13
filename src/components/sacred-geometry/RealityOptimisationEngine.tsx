
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Quote, MessageSquare } from 'lucide-react';
import { isPrime } from '@/utils/primeCalculations';
import { cn } from '@/lib/utils';

type SacredShape = 'flower-of-life' | 'metatrons-cube' | 'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 'vesica-piscis';

interface RealityOptimisationEngineProps {
  selectedShape: SacredShape;
  liftTheVeil: boolean;
}

// Mapping of shape names to their indices for prime number detection
const shapeIndices: Record<SacredShape, number> = {
  'flower-of-life': 1,
  'metatrons-cube': 2,
  'merkaba': 3,
  'torus': 4,
  'tree-of-life': 5,
  'sri-yantra': 6,
  'vesica-piscis': 7
};

// Inspirational quotes for each shape
const shapeQuotes: Record<SacredShape, string[]> = {
  'flower-of-life': [
    "The pattern of creation emerges from the void.",
    "All life springs from the same geometric blueprint.",
    "In the Flower of Life, see the interconnection of all beings."
  ],
  'metatrons-cube': [
    "Within this cube lies the structure of reality.",
    "Metatron's Cube contains all geometric forms known to creation.",
    "Sacred geometry is the architecture of the universe."
  ],
  'merkaba': [
    "The Merkaba activates your light body across dimensions.",
    "Counter-rotating fields of light transport consciousness.",
    "As above, so below; the Merkaba bridges worlds."
  ],
  'torus': [
    "The torus is the fundamental energy pattern of all existence.",
    "Energy flows in, through, and out in an eternal cycle.",
    "The universe breathes through toroidal flow."
  ],
  'tree-of-life': [
    "Climb the branches to understand the nature of all things.",
    "The Tree of Life maps the journey from source to manifestation.",
    "Ten spheres, twenty-two paths, one ultimate reality."
  ],
  'sri-yantra': [
    "The Sri Yantra is the visual form of the primordial sound OM.",
    "Nine interlocking triangles create 43 smaller triangles in perfect harmony.",
    "The meeting of masculine and feminine energies creates all forms."
  ],
  'vesica-piscis': [
    "In the overlap of two worlds, new creation is born.",
    "The divine proportion emerges from this sacred intersection.",
    "The womb of creation where polarities merge into one."
  ]
};

// Encoded messages that appear when veil is lifted
const encodedMessages: string[] = [
  "The frequency resonates with your true nature.",
  "Patterns repeat across scales, notice the similarities.",
  "You've been here before, in another form.",
  "The observer creates the observed.",
  "Those who seek shall find their resonance.",
  "Prime numbers are the keys to dimensional gateways.",
  "Your consciousness affects the material world.",
  "The veil between worlds is thinner than most realize."
];

const RealityOptimisationEngine: React.FC<RealityOptimisationEngineProps> = ({
  selectedShape,
  liftTheVeil
}) => {
  const [message, setMessage] = useState<string>("");
  const [isPrimeShape, setIsPrimeShape] = useState<boolean>(false);
  const [showEncodedMessage, setShowEncodedMessage] = useState<boolean>(false);

  // Check if the selected shape index is a prime number
  useEffect(() => {
    const shapeIndex = shapeIndices[selectedShape];
    setIsPrimeShape(isPrime(shapeIndex));
    
    // Log selection to session state (for future evolution)
    console.log(`Shape selected: ${selectedShape}, Index: ${shapeIndex}, Is Prime: ${isPrime(shapeIndex)}`);
    
    // Select a random quote for the current shape
    const quotes = shapeQuotes[selectedShape];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMessage(randomQuote);
    
    // Occasionally show encoded messages when veil is lifted
    if (liftTheVeil && Math.random() > 0.6) {
      const randomEncodedMessage = encodedMessages[Math.floor(Math.random() * encodedMessages.length)];
      setTimeout(() => {
        setShowEncodedMessage(true);
        setMessage(randomEncodedMessage);
      }, 3000);
    } else {
      setShowEncodedMessage(false);
    }
  }, [selectedShape, liftTheVeil]);

  // Log veil toggle (for future evolution)
  useEffect(() => {
    console.log(`Veil state changed: ${liftTheVeil ? "lifted" : "lowered"}`);
  }, [liftTheVeil]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "relative w-full max-w-md mx-auto mb-8 overflow-hidden",
        "backdrop-blur-lg rounded-lg p-4",
        "border",
        isPrimeShape && "animate-pulse-subtle",
        liftTheVeil
          ? "bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 border-pink-500/40"
          : "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30"
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg opacity-10">
        {/* Fractal-inspired background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgTCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] -rotate-12" />
      </div>

      <div className="flex items-start space-x-3">
        <div className={cn(
          "p-2 rounded-full",
          liftTheVeil 
            ? "bg-pink-500/20" 
            : "bg-purple-500/20"
        )}>
          {showEncodedMessage ? (
            <MessageSquare className={cn(
              "h-5 w-5",
              liftTheVeil ? "text-pink-300" : "text-purple-300"
            )} />
          ) : isPrimeShape ? (
            <Sparkles className={cn(
              "h-5 w-5",
              liftTheVeil ? "text-pink-300" : "text-purple-300"
            )} />
          ) : (
            <Quote className={cn(
              "h-5 w-5",
              liftTheVeil ? "text-pink-300" : "text-purple-300"
            )} />
          )}
        </div>
        <div className="flex-1">
          <motion.div
            key={message} // Force re-render animation when message changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className={cn(
              "text-sm font-medium mb-1",
              liftTheVeil ? "text-pink-300" : "text-purple-300"
            )}>
              {isPrimeShape ? "Resonance Detected" : "Sacred Insight"}
            </h4>
            <p className={cn(
              "text-sm",
              liftTheVeil ? "text-gray-200" : "text-gray-300"
            )}>
              {message}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle indicator that system is "watching" */}
      <motion.div 
        className="absolute bottom-2 right-2 opacity-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Eye className={cn(
          "h-3 w-3",
          liftTheVeil ? "text-pink-300" : "text-purple-300"
        )} />
      </motion.div>
    </motion.div>
  );
};

export default RealityOptimisationEngine;
