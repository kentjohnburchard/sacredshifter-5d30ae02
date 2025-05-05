
import React, { useState } from "react";
import { HealingFrequency } from "@/data/frequencies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Music2, Moon, Star, Flower } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FrequencyInfoBoxProps {
  frequencies: HealingFrequency[];
  selectedFrequency: HealingFrequency;
  onSelectFrequency: (frequency: HealingFrequency) => void;
}

const FrequencyInfoBox: React.FC<FrequencyInfoBoxProps> = ({
  frequencies,
  selectedFrequency,
  onSelectFrequency,
}) => {
  const navigate = useNavigate();
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const { toast } = useToast();

  const getBenefitIcon = (benefit: string, index: number) => {
    const iconClasses = "h-4 w-4 mr-2 text-purple-300";
    
    if (benefit.toLowerCase().includes("heal") || benefit.toLowerCase().includes("heart") || benefit.toLowerCase().includes("love")) {
      return <Heart className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("spirit") || benefit.toLowerCase().includes("consciousness") || benefit.toLowerCase().includes("awakens")) {
      return <Flower className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("sleep") || benefit.toLowerCase().includes("relax") || benefit.toLowerCase().includes("peace")) {
      return <Moon className={iconClasses} />;
    } else if (benefit.toLowerCase().includes("energy") || benefit.toLowerCase().includes("vibration") || benefit.toLowerCase().includes("balance")) {
      return <Star className={iconClasses} />;
    } else {
      return <Sparkles className={iconClasses} />;
    }
  };

  const handleFrequencyChange = (value: string) => {
    const frequency = frequencies.find(f => f.id === value);
    if (frequency) {
      onSelectFrequency(frequency);
    }
  };

  const handleCreateMusic = () => {
    toast({
      title: "Creating music with " + selectedFrequency.name,
      description: `Frequency: ${selectedFrequency.frequency}Hz`,
    });
    
    navigate('/music-generation', { 
      state: { 
        selectedFrequency,
        generateWithFrequency: true
      } 
    });
    
    setShowMusicDialog(false);
  };

  const openMusicDialog = () => {
    setShowMusicDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="mb-3">
            <label htmlFor="frequency-select" className="block text-sm font-bold text-slate-200 mb-2 text-shadow-sm">
              Select a Sacred Frequency:
            </label>
            <Select value={selectedFrequency.id} onValueChange={handleFrequencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.id} value={freq.id}>
                    {freq.name} - {freq.frequency} Hz
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`p-4 rounded-lg bg-gradient-to-r ${selectedFrequency.color} bg-opacity-20 shadow-lg shadow-black/40 border border-white/10`}>
            <div className="flex items-center gap-2 mb-2">
              <Music2 className="h-5 w-5 text-white" />
              <h4 className="text-xl font-bold text-white text-shadow">{selectedFrequency.name}</h4>
            </div>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-lg font-semibold text-white/90 text-shadow-sm">{selectedFrequency.frequency} Hz</span>
              {selectedFrequency.chakra && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                  {selectedFrequency.chakra} Chakra
                </span>
              )}
            </div>
            
            <Button 
              onClick={openMusicDialog} 
              className="w-full mt-2 bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
            >
              Create Music with this Frequency
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
            <TabsList className="grid grid-cols-3 bg-transparent border-b border-white/10 w-full rounded-t-lg">
              <TabsTrigger value="about" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200 font-semibold">
                <Music2 className="h-4 w-4 mr-2" />
                <span>About</span>
              </TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200 font-semibold">
                <Heart className="h-4 w-4 mr-2" />
                <span>Benefits</span>
              </TabsTrigger>
              <TabsTrigger value="meditation" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-slate-200 font-semibold">
                <Flower className="h-4 w-4 mr-2" />
                <span>Meditation</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4">
              <ScrollArea className="h-48">
                <TabsContent value="about" className="mt-0 text-slate-200">
                  <p className="text-shadow-sm">{selectedFrequency.description}</p>
                </TabsContent>
                
                <TabsContent value="benefits" className="mt-0">
                  {selectedFrequency.benefits && selectedFrequency.benefits.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedFrequency.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          {getBenefitIcon(benefit, index)}
                          <span className="text-slate-200 text-shadow-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-200 text-shadow-sm">No specific benefits have been listed for this frequency.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="meditation" className="mt-0">
                  {selectedFrequency.meditations && selectedFrequency.meditations.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedFrequency.meditations.map((meditation, index) => (
                        <li key={index} className="flex items-start">
                          <Flower className="h-5 w-5 mr-2 text-purple-300 shrink-0 mt-0.5" />
                          <span className="text-slate-200 text-shadow-sm">{meditation}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-200 text-shadow-sm">
                      Sit comfortably with your spine straight. Close your eyes and take deep breaths while focusing on the sound. Allow the frequency to flow through your entire being, releasing any tension or blockages.
                    </p>
                  )}
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={showMusicDialog} onOpenChange={setShowMusicDialog}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              Create Music with {selectedFrequency.name}
            </DialogTitle>
            <DialogDescription>
              Would you like to generate a healing track using the {selectedFrequency.frequency}Hz frequency?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center gap-2 my-2">
            <Music2 className="h-5 w-5 text-teal-400" />
            <span className="text-teal-300 font-medium">{selectedFrequency.frequency}Hz</span>
            {selectedFrequency.chakra && (
              <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">
                {selectedFrequency.chakra} Chakra
              </span>
            )}
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row mt-4">
            <DialogClose>
              <Button variant="outline" className="border-white/20 text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleCreateMusic}
              className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
            >
              Create Healing Track
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FrequencyInfoBox;
