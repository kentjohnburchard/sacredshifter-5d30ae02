
import React from "react";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info, Quote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface WisdomDropContent {
  principle: string;
  icon: string;
  title: string;
  quote: string;
  explanation: string[];
  valeSays: string;
  affirmation: string;
}

const wisdomDrops: Record<string, WisdomDropContent> = {
  "Mentalism": {
    principle: "Mentalism",
    icon: "🧠",
    title: "The All is Mind; the Universe is Mental.",
    quote: "The All is Mind; the Universe is Mental.",
    explanation: [
      "Your thoughts are the Wi-Fi signal broadcasting your reality.",
      "Think crap, get crap. Think clarity, get alignment.",
      "The Universe isn't judging—it's just syncing to your frequency."
    ],
    valeSays: "You don't have to fake positive vibes—but you do need to be *deliberate.* Your thoughts are spells, darling. Choose them like sacred ingredients. Brew your reality on purpose.",
    affirmation: "My thoughts are the origin of my reality."
  },
  "Correspondence": {
    principle: "Correspondence",
    icon: "🪞",
    title: "As above, so below; as within, so without.",
    quote: "As above, so below; as within, so without.",
    explanation: [
      "The whole damn Universe is a mirror.",
      "Your relationships? Reflect your boundaries.",
      "Your home? Reflects your inner order.",
      "Your boss Karen? Probably reflecting something unresolved in *you* (sorry)."
    ],
    valeSays: "You want your outer world to stop being chaos? Babe, light a candle, sit with yourself, and clean your inner altar. Mirror work is soul work.",
    affirmation: "I shift my world by shifting within."
  }
};

interface HermeticWisdomDropProps {
  principle: string;
  variant?: "tooltip" | "hover-card" | "dialog";
  children?: React.ReactNode;
}

const HermeticWisdomDrop: React.FC<HermeticWisdomDropProps> = ({
  principle,
  variant = "hover-card",
  children
}) => {
  const wisdom = wisdomDrops[principle];
  
  if (!wisdom) {
    return <span>No wisdom found for {principle}</span>;
  }

  const renderWisdomContent = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{wisdom.icon}</span>
        <h3 className="text-lg font-medium">{wisdom.principle}: <span className="italic font-normal">"{wisdom.quote}"</span></h3>
      </div>
      
      <div className="space-y-2">
        {wisdom.explanation.map((line, index) => (
          <p key={index} className="text-sm">{line}</p>
        ))}
        <p className="text-sm">This isn't manifestation fluff—it's <strong>vibrational physics</strong>. Your mind is the control panel. Your beliefs are the code. And what you feel? That's your signal strength.</p>
      </div>
      
      <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
        <p className="text-sm font-medium mb-1">Vale says:</p>
        <p className="text-sm italic">{wisdom.valeSays}</p>
      </div>
      
      <div className="border-t pt-2">
        <p className="text-sm font-medium">Affirmation:</p>
        <p className="text-sm italic">"{wisdom.affirmation}"</p>
      </div>
    </div>
  );

  if (variant === "tooltip") {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {children || (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <Info className="h-4 w-4" />
                <span className="sr-only">Vale's Wisdom on {principle}</span>
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p className="text-sm">Click for Vale's wisdom on {principle}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "hover-card") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <Info className="h-4 w-4" />
              <span className="sr-only">Vale's Wisdom on {principle}</span>
            </Button>
          )}
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="right">
          {renderWisdomContent()}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
            <Quote className="h-4 w-4" />
            <span>Vale's Wisdom</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vale's Wisdom Drop – {principle} Edition
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            {renderWisdomContent()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HermeticWisdomDrop;
