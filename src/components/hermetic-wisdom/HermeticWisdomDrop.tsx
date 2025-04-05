
import React from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, Sparkles } from "lucide-react";

const principleWisdom = {
  "Mentalism": {
    title: "Principle of Mentalism",
    description: "The All is Mind; The Universe is Mental.",
    explanation: "This principle explains that everything in the material universe is mental, a projection of the mind of the All. Consciousness is primary, matter secondary.",
    frequency: "963Hz",
    chakra: "Crown",
    scienceConnection: "Quantum physics shows that consciousness affects quantum systems through observation. The consciousness collapses quantum probability waves into particle reality.",
    frequencyEffect: "963Hz corresponds to pineal gland activation, higher consciousness, and unity awareness. This frequency enhances meditation, spiritual connection, and transcendent states.",
  },
  "Correspondence": {
    title: "Principle of Correspondence",
    description: "As Above, So Below; As Within, So Without.",
    explanation: "This principle demonstrates the harmony and connection between different planes of existence. Patterns repeat themselves across scale and dimension.",
    frequency: "852Hz",
    chakra: "Third Eye",
    scienceConnection: "Fractal mathematics and holographic theory show how patterns replicate at different scales. The structure of the atom resembles the structure of a solar system.",
    frequencyEffect: "852Hz aligns with intuition, insight, and clarity of perception. This frequency helps clear mental blocks, enhance visualization, and strengthen intuitive abilities.",
  },
  "Vibration": {
    title: "Principle of Vibration",
    description: "Nothing Rests; Everything Moves; Everything Vibrates.",
    explanation: "This principle reveals that everything is in constant motion at varying frequencies. Differences in vibration create different manifestations of matter, energy, and consciousness.",
    frequency: "528Hz",
    chakra: "Solar Plexus",
    scienceConnection: "String theory proposes that all particles are actually tiny vibrating strings, with different vibration patterns producing different particles.",
    frequencyEffect: "528Hz is known as the 'Miracle Tone' or 'DNA repair frequency'. It promotes transformation, increased energy, and manifestation of intentions.",
  },
  "Polarity": {
    title: "Principle of Polarity",
    description: "Everything is Dual; Everything has Poles; Everything has its Opposite.",
    explanation: "This principle shows that opposites are identical in nature but different in degree. All paradoxes can be reconciled through understanding this principle.",
    frequency: "639Hz",
    chakra: "Heart",
    scienceConnection: "Electromagnetism demonstrates polarity with positive and negative charges. The balance of opposing forces creates stability in physical systems.",
    frequencyEffect: "639Hz harmonizes relationships, promotes compassion, and helps resolve conflicts. This frequency balances emotional extremes and encourages understanding.",
  },
  "Rhythm": {
    title: "Principle of Rhythm",
    description: "Everything Flows; Out and In; All Things Rise and Fall.",
    explanation: "This principle describes the cyclic nature of all things. Pendulum swings manifest in everything from tides to economies, emotions to civilizations.",
    frequency: "417Hz",
    chakra: "Sacral",
    scienceConnection: "Circadian rhythms, economic cycles, and planetary movements all demonstrate the principle of rhythm in different domains.",
    frequencyEffect: "417Hz facilitates change, releases trauma, and enables creative flow. This frequency helps us break out of stagnant patterns and embody flow consciousness.",
  },
  "Cause & Effect": {
    title: "Principle of Cause and Effect",
    description: "Every Cause has its Effect; Every Effect has its Cause.",
    explanation: "This principle states that nothing happens by chance; there are causal connections among all events, though they may operate across planes and dimensions.",
    frequency: "741Hz",
    chakra: "Throat",
    scienceConnection: "Chaos theory shows how small causes can create large, unpredictable effects through sensitivity to initial conditions.",
    frequencyEffect: "741Hz empowers self-expression, creative manifestation, and living with integrity. This frequency helps clear toxicity and promotes speaking your truth.",
  },
  "Gender": {
    title: "Principle of Gender",
    description: "Gender is in Everything; Everything has Masculine and Feminine Principles.",
    explanation: "This principle reveals the creative interplay between receptive and projective energies in all things, from human relationships to atomic structure.",
    frequency: "396Hz",
    chakra: "Root",
    scienceConnection: "Particle-wave duality in quantum physics demonstrates complementary properties similar to the masculine (particle) and feminine (wave) aspects.",
    frequencyEffect: "396Hz grounds spiritual energy, provides stability, and releases fear. This frequency helps establish foundation and security while clearing blockages.",
  },
};

interface HermeticWisdomDropProps {
  principle: string;
  variant: "hover-card" | "dialog";
  children?: React.ReactNode;
}

const HermeticWisdomDrop: React.FC<HermeticWisdomDropProps> = ({
  principle,
  variant = "hover-card",
  children
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const wisdom = principleWisdom[principle as keyof typeof principleWisdom] || {
    title: principle,
    description: "Hermetic wisdom",
    explanation: "Information about this principle",
    frequency: "Unknown",
    chakra: "Unknown",
    scienceConnection: "Scientific correlation",
    frequencyEffect: "Effect on consciousness",
  };

  const getChakraColor = (chakra: string) => {
    switch (chakra) {
      case "Root": return "bg-red-100 text-red-800 border-red-200";
      case "Sacral": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Solar Plexus": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Heart": return "bg-green-100 text-green-800 border-green-200";
      case "Throat": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Third Eye": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Crown": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const content = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{wisdom.title}</h3>
        <Badge className={getChakraColor(wisdom.chakra)}>
          {wisdom.chakra} Chakra • {wisdom.frequency}
        </Badge>
      </div>
      
      <p className="italic text-gray-700">"{wisdom.description}"</p>
      
      <div className="space-y-2">
        <h4 className="font-medium text-purple-700">Core Understanding:</h4>
        <p className="text-gray-700">{wisdom.explanation}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-purple-700">Scientific Connection:</h4>
        <p className="text-gray-700">{wisdom.scienceConnection}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-purple-700">Frequency Effect:</h4>
        <p className="text-gray-700">{wisdom.frequencyEffect}</p>
      </div>
    </div>
  );

  if (variant === "hover-card") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              <Info className="h-4 w-4 mr-1" />
              Learn More
            </Button>
          )}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">{content}</HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <>
      {children ? (
        <span onClick={() => setDialogOpen(true)}>{children}</span>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          onClick={() => setDialogOpen(true)}
        >
          <Info className="h-4 w-4 mr-1" />
          Learn More
        </Button>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Hermetic Wisdom
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HermeticWisdomDrop;
