
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FractalVisual } from "@/types/frequencies";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, Heart, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const FractalVisualsExplorer: React.FC = () => {
  const [fractals, setFractals] = useState<FractalVisual[]>([]);
  const [selectedFractal, setSelectedFractal] = useState<FractalVisual | null>(null);
  const [showFractalDialog, setShowFractalDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchFractals = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("fractal_visuals")
          .select("*")
          .order("frequency", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setFractals(data);
        }
      } catch (err) {
        console.error("Error fetching fractal visuals:", err);
        toast.error("Failed to load fractal visuals");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFractals();
  }, []);
  
  const handleFractalClick = (fractal: FractalVisual) => {
    setSelectedFractal(fractal);
    setShowFractalDialog(true);
  };
  
  const getChakraColor = (chakra: string = ""): string => {
    switch (chakra.toLowerCase()) {
      case 'root': return 'from-red-500 to-red-600';
      case 'sacral': return 'from-orange-400 to-orange-500';
      case 'solar plexus': return 'from-yellow-400 to-yellow-500';
      case 'heart': return 'from-green-400 to-green-500';
      case 'throat': return 'from-blue-400 to-blue-500';
      case 'third eye': return 'from-indigo-400 to-indigo-500';
      case 'crown': return 'from-purple-400 to-violet-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };
  
  const getAnimationClass = (type?: string): string => {
    if (type === 'animation') {
      return 'animate-fractal-pulse';
    }
    return '';
  };
  
  const saveFractalToTimeline = async (fractal: FractalVisual) => {
    if (!user) {
      toast.error("Please sign in to save fractals to your timeline");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('timeline_snapshots')
        .insert({
          user_id: user.id,
          title: `Fractal: ${fractal.title || `${fractal.frequency}Hz`}`,
          frequency: fractal.frequency,
          chakra: fractal.chakra,
          tag: 'fractal',
          visual_type: fractal.type,
          notes: `Fractal visual for ${fractal.chakra} chakra / ${fractal.principle} principle`
        });
      
      if (error) throw error;
      
      toast.success("Fractal saved to your timeline");
    } catch (err) {
      console.error("Error saving fractal to timeline:", err);
      toast.error("Failed to save fractal to timeline");
    }
  };
  
  const filteredFractals = fractals.filter(fractal => {
    if (activeTab === "all") return true;
    if (activeTab === "animation") return fractal.type === "animation";
    return fractal.chakra?.toLowerCase() === activeTab;
  });
  
  return (
    <div className="space-y-6">
      <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sacred Geometry Fractal Explorer</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-6">
            Experience the visual manifestations of universal frequencies through sacred geometry.
            Each fractal corresponds to a specific frequency, chakra, and Hermetic principle.
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="root">Root</TabsTrigger>
              <TabsTrigger value="sacral">Sacral</TabsTrigger>
              <TabsTrigger value="solar plexus">Solar</TabsTrigger>
              <TabsTrigger value="heart">Heart</TabsTrigger>
              <TabsTrigger value="throat">Throat</TabsTrigger>
              <TabsTrigger value="third eye">Third Eye</TabsTrigger>
              <TabsTrigger value="crown">Crown</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredFractals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No fractals found for this filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFractals.map((fractal) => (
                <div 
                  key={fractal.id} 
                  className="relative group cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => handleFractalClick(fractal)}
                >
                  <div 
                    className={`h-40 bg-cover bg-center ${getAnimationClass(fractal.type)}`} 
                    style={{ backgroundImage: `url(${fractal.visual_url})` }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white font-medium mb-1">
                      {fractal.title || `${fractal.frequency}Hz Fractal`}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="bg-black/50 text-white text-xs">
                        {fractal.frequency}Hz
                      </Badge>
                      
                      {fractal.principle && (
                        <Badge variant="outline" className="bg-black/50 text-white text-xs">
                          {fractal.principle}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveFractalToTimeline(fractal);
                        }}
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <Badge
                    className={`absolute top-2 right-2 bg-gradient-to-r ${getChakraColor(fractal.chakra)}`}
                  >
                    {fractal.chakra}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Full Screen Fractal Dialog */}
      {selectedFractal && (
        <Dialog open={showFractalDialog} onOpenChange={setShowFractalDialog}>
          <DialogContent className="max-w-5xl h-full max-h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-full">
              <div 
                className={`absolute inset-0 bg-cover bg-center ${getAnimationClass(selectedFractal?.type)}`}
                style={{ backgroundImage: `url(${selectedFractal?.visual_url})` }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <div className="text-white max-w-xl">
                  <h2 className="text-2xl font-semibold mb-2">
                    {selectedFractal?.title || `${selectedFractal?.frequency}Hz Fractal`}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline" className="border-white/30 text-white">
                      {selectedFractal?.frequency}Hz
                    </Badge>
                    {selectedFractal?.chakra && (
                      <Badge variant="outline" className="border-white/30 text-white">
                        {selectedFractal.chakra} Chakra
                      </Badge>
                    )}
                    {selectedFractal?.principle && (
                      <Badge variant="outline" className="border-white/30 text-white">
                        {selectedFractal.principle} Principle
                      </Badge>
                    )}
                    {selectedFractal?.prime_number && (
                      <Badge variant="outline" className="border-purple-300 bg-purple-500/30 text-white">
                        Prime {selectedFractal.prime_number}
                      </Badge>
                    )}
                  </div>
                  
                  {selectedFractal?.notes && (
                    <p className="text-white/80 mb-4">{selectedFractal.notes}</p>
                  )}
                  
                  {selectedFractal?.formula && (
                    <div className="bg-black/30 p-3 rounded mb-4">
                      <p className="text-sm font-mono text-green-300">{selectedFractal.formula}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    <Button 
                      className="bg-white text-purple-800 hover:bg-white/90"
                      onClick={() => setShowFractalDialog(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20"
                      onClick={() => saveFractalToTimeline(selectedFractal)}
                    >
                      <Heart className="h-4 w-4 mr-2" /> Save to Timeline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FractalVisualsExplorer;
