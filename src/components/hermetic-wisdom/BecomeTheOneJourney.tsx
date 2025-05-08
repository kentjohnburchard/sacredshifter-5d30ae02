
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Sparkles, Globe, Mic, FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JourneyPhase } from "@/types/frequencies";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BecomeTheOneJourneyProps {
  onStartJourney?: () => void;
}

const becomeTheOnePhases: JourneyPhase[] = [
  {
    id: "phase1",
    title: "Initiation – The Spark",
    description: "A visual + audio sequence showing that the spark of light is within.",
    frequency: 528, // This is fine as JourneyPhase uses frequency, not related to Journey type
    message: "You've felt it. You're not crazy. You're remembering.",
    visual_type: "spiral-light",
    affirmation: "I recognize the divinity within me.",
    duration: 300, // 5 minutes
    chakras: ["Third Eye", "Crown"],
    principles: ["Vibration"]
  },
  {
    id: "phase2",
    title: "Illumination – Let There Be Light",
    description: "Chakra alignment meditation with fractal visuals synced to Crown and Heart chakras.",
    frequency: [639, 963],
    message: "You carry codes in your frequency. It's time to tune in.",
    visual_type: "crown-heart-fractal",
    affirmation: "My light illuminates my path forward.",
    duration: 420, // 7 minutes
    chakras: ["Crown", "Heart"],
    principles: ["Mentalism", "Polarity"]
  },
  {
    id: "phase3",
    title: "Declaration – I Choose Me",
    description: "Record or write an 'I Am' statement to claim your power.",
    frequency: 741,
    message: "The only permission you need is your own.",
    visual_type: "throat-activation",
    activity: "record-declaration",
    duration: 240, // 4 minutes
    chakras: ["Throat"],
    principles: ["Cause & Effect"]
  },
  {
    id: "phase4",
    title: "Embodiment – Walking the Path",
    description: "Motion-based affirmation overlay with pulsing golden fractals.",
    frequency: [528, 963],
    message: "I am becoming the light I came here to be.",
    visual_type: "golden-solar-flare",
    affirmation: "I embody the wisdom of my highest self.",
    duration: 360, // 6 minutes
    chakras: ["Solar Plexus", "Crown"],
    principles: ["Vibration", "Mentalism"]
  },
  {
    id: "phase5",
    title: "Transmission – Radiate the Shift",
    description: "Send out a pulse — vibrational ripple effect (symbolic).",
    frequency: 852,
    message: "Your frequency changes the world around you.",
    visual_type: "ripple-effect",
    activity: "send-pulse",
    duration: 180, // 3 minutes
    chakras: ["All"],
    principles: ["Correspondence"]
  }
];

const BecomeTheOneJourney: React.FC<BecomeTheOneJourneyProps> = ({ onStartJourney }) => {
  const [activePhase, setActivePhase] = useState<number>(0);
  const [declaration, setDeclaration] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [consciousnessMode, setConsciousnessMode] = useState<"normal" | "kent">("normal");
  const [currentQuote, setCurrentQuote] = useState<string>("");
  const { user } = useAuth();
  
  const currentPhase = becomeTheOnePhases[activePhase];
  const totalDuration = becomeTheOnePhases.reduce((sum, phase) => sum + (phase.duration || 0), 0);
  const formattedTotalDuration = `${Math.floor(totalDuration / 60)} minutes`;

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const { data, error } = await supabase
          .from("journey_quotes")
          .select("quote")
          .eq("journey_slug", "become-the-one")
          .eq("mode", consciousnessMode)
          .or(`phase.eq.${currentPhase.title.toLowerCase().split('–')[0].trim()},phase.eq.general`)
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching quote:", error);
          return;
        }

        if (data) {
          setCurrentQuote(data.quote);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchQuote();
  }, [activePhase, consciousnessMode, currentPhase.title]);

  const handleNextPhase = () => {
    if (activePhase < becomeTheOnePhases.length - 1) {
      setActivePhase(activePhase + 1);
      setIsPlaying(false);
    } else {
      toast.success("Journey complete! Light Bringer Activated", {
        description: "Your journey has been saved to your timeline.",
        duration: 5000,
      });
      // Here we would save the journey completion to the timeline
    }
  };

  const handlePreviousPhase = () => {
    if (activePhase > 0) {
      setActivePhase(activePhase - 1);
      setIsPlaying(false);
    }
  };

  const handleSaveDeclaration = () => {
    if (declaration.trim()) {
      toast.success("Declaration saved", {
        description: "Your 'I Am' statement has been recorded.",
        duration: 3000,
      });
    } else {
      toast.error("Please enter your declaration");
    }
  };

  const handleSendPulse = () => {
    toast.success("Light pulse sent", {
      description: "Your vibrational signature is rippling outward.",
      duration: 3000,
    });
    // Animation would trigger here in a full implementation
  };

  const getFrequencyLabel = (freq: number | number[]) => {
    if (Array.isArray(freq)) {
      return freq.join("Hz + ") + "Hz";
    }
    return `${freq}Hz`;
  };

  return (
    <Card className="w-full bg-black/40 text-white border-purple-500/30 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 pb-4 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1771&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <Badge className="bg-purple-500/80">Hermetic Journey Template</Badge>
            <ToggleGroup 
              type="single" 
              value={consciousnessMode}
              onValueChange={(value) => value && setConsciousnessMode(value as "normal" | "kent")}
              className="bg-black/30 rounded-lg p-1"
            >
              <ToggleGroupItem value="normal" className="data-[state=on]:bg-purple-500/50 data-[state=on]:text-white rounded text-xs px-2 py-1">
                🧘 Normal
              </ToggleGroupItem>
              <ToggleGroupItem value="kent" className="data-[state=on]:bg-purple-500/50 data-[state=on]:text-white rounded text-xs px-2 py-1">
                ⚡ Kent Mode
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <CardTitle className="text-2xl font-light">
            <span className="font-medium">Become the One</span>
          </CardTitle>
          <p className="text-sm mt-1 text-white/80 italic">
            You're not a chosen one — you're choosing yourself.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs border-white/30 text-white/90">
              {formattedTotalDuration}
            </Badge>
            <Badge variant="outline" className="text-xs border-white/30 text-white/90">
              528Hz + 963Hz
            </Badge>
            <Badge variant="outline" className="text-xs border-white/30 text-white/90">
              Multi-phase
            </Badge>
            <Badge variant="outline" className="text-xs border-white/30 text-white/90">
              Transformation
            </Badge>
          </div>
          
          {currentQuote && (
            <div className={`mt-3 p-3 rounded-md ${consciousnessMode === 'kent' ? 'bg-pink-500/20 border border-pink-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`}>
              <p className={`text-sm italic ${consciousnessMode === 'kent' ? 'kent-mode' : ''}`}>
                "{currentQuote}"
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs 
          value={`phase-${activePhase}`} 
          className="w-full"
          onValueChange={(value) => setActivePhase(parseInt(value.split('-')[1]))}
        >
          <TabsList className="w-full grid grid-cols-5 bg-black/30 rounded-none border-b border-purple-500/30">
            {becomeTheOnePhases.map((phase, index) => (
              <TabsTrigger 
                key={index}
                value={`phase-${index}`}
                className={`text-xs sm:text-sm ${
                  activePhase === index 
                    ? "data-[state=active]:bg-purple-900/30 data-[state=active]:text-white" 
                    : ""
                } ${
                  index < activePhase
                    ? "text-green-400/70"
                    : "text-white/70"
                }`}
              >
                {index + 1}. {phase.title.split('–')[0].trim()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {becomeTheOnePhases.map((phase, index) => (
            <TabsContent key={index} value={`phase-${index}`} className="pt-0">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{phase.title}</h3>
                    <p className="text-white/80">{phase.description}</p>
                  </div>
                  <Badge 
                    className={`bg-gradient-to-r ${
                      index === 0 ? "from-yellow-500 to-amber-600" :
                      index === 1 ? "from-indigo-500 to-blue-600" :
                      index === 2 ? "from-cyan-500 to-blue-600" :
                      index === 3 ? "from-yellow-400 to-orange-600" :
                      "from-purple-500 to-indigo-600"
                    }`}
                  >
                    Phase {index + 1}
                  </Badge>
                </div>
                
                <div 
                  className={`p-5 rounded-lg border border-white/20 bg-gradient-to-br ${
                    index === 0 ? "from-yellow-900/40 to-amber-900/40" :
                    index === 1 ? "from-indigo-900/40 to-blue-900/40" :
                    index === 2 ? "from-cyan-900/40 to-blue-900/40" :
                    index === 3 ? "from-yellow-900/40 to-orange-900/40" :
                    "from-purple-900/40 to-indigo-900/40"
                  } relative`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    {index === 0 && <Sparkles className="w-32 h-32" />}
                    {index === 1 && <Star className="w-32 h-32" />}
                    {index === 2 && <Mic className="w-32 h-32" />}
                    {index === 3 && <Globe className="w-32 h-32" />}
                    {index === 4 && <Sparkles className="w-32 h-32" />}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-4">
                      <h4 className="text-xl italic font-light mb-2">{phase.message}</h4>
                      {phase.affirmation && (
                        <p className="text-sm text-white/90 font-medium">
                          Affirmation: "{phase.affirmation}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Frequency:</span>
                            <span className="text-sm font-medium">{getFrequencyLabel(phase.frequency)}</span>
                          </div>
                          <div className="h-1 bg-white/20 rounded overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: 3,
                                repeat: isPlaying ? Infinity : 0,
                                repeatType: "reverse"
                              }}
                            />
                          </div>
                        </div>
                        
                        {phase.chakras && (
                          <div className="space-y-1">
                            <span className="text-sm">Chakras:</span>
                            <div className="flex flex-wrap gap-1">
                              {phase.chakras.map((chakra, i) => (
                                <Badge 
                                  key={i} 
                                  variant="outline"
                                  className="text-xs bg-black/20 border-white/30"
                                >
                                  {chakra}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {phase.principles && (
                          <div className="space-y-1 mt-2">
                            <span className="text-sm">Hermetic Principles:</span>
                            <div className="flex flex-wrap gap-1">
                              {phase.principles.map((principle, i) => (
                                <Badge 
                                  key={i}
                                  className="text-xs bg-black/20 border-white/30"
                                >
                                  {principle}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center items-center">
                        {phase.activity === "record-declaration" ? (
                          <div className="w-full space-y-2">
                            <label className="text-sm">Write your "I Am" declaration:</label>
                            <Textarea 
                              placeholder="I am..." 
                              className="bg-black/30 border-white/20 placeholder:text-white/40"
                              value={declaration}
                              onChange={(e) => setDeclaration(e.target.value)}
                            />
                            <Button 
                              className="w-full" 
                              variant="secondary"
                              onClick={handleSaveDeclaration}
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Save Declaration
                            </Button>
                          </div>
                        ) : phase.activity === "send-pulse" ? (
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700 text-white border-none h-32 w-32 rounded-full"
                            onClick={handleSendPulse}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-purple-500 rounded-full opacity-50"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                repeatType: "loop" 
                              }}
                            />
                            <span className="relative z-10">Send Pulse</span>
                          </Button>
                        ) : (
                          <Button 
                            className={`bg-gradient-to-r ${
                              isPlaying ? "from-red-600 to-red-700" : "from-purple-600 to-indigo-600"
                            } text-white border-none`}
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            <Play className={`h-4 w-4 mr-2 ${isPlaying ? "animate-pulse" : ""}`} /> 
                            {isPlaying ? "Pause Audio" : "Play Frequency"}
                          </Button>
                        )}
                        
                        {isPlaying && !phase.activity && (
                          <div className="mt-3 text-sm text-white/70">
                            Frequency playing: {getFrequencyLabel(phase.frequency)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-3">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white/80 hover:bg-white/10"
                    onClick={handlePreviousPhase}
                    disabled={activePhase === 0}
                  >
                    Previous Phase
                  </Button>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none"
                    onClick={handleNextPhase}
                  >
                    {activePhase === becomeTheOnePhases.length - 1 ? (
                      <>Complete Journey</>
                    ) : (
                      <>Next Phase <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BecomeTheOneJourney;
