import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, BookmarkIcon, Share2, Music } from "lucide-react";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { formatDuration } from "@/utils/formatters";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";

interface FrequencyCardProps {
  frequency: FrequencyLibraryItem;
  savedId?: string;
  notes?: string | null;
}

const FrequencyCard: React.FC<FrequencyCardProps> = ({ frequency, savedId, notes }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [saveNotes, setSaveNotes] = useState(notes || "");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const getChakraColor = (chakra: string | null | undefined) => {
    if (!chakra) return 'from-gray-400 to-gray-500';

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

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStartJourney = () => {
    navigate(`/journey/${frequency.frequency}`);
  };

  const handleSaveFrequency = async () => {
    if (!user) {
      toast.error("Please sign in to save frequencies");
      return;
    }

    try {
      if (savedId) {
        await supabase
          .from('user_saved_frequencies')
          .update({ notes: saveNotes })
          .eq('id', savedId);
        
        toast.success("Saved frequency updated");
      } else {
        await supabase
          .from('user_saved_frequencies')
          .insert({
            user_id: user.id,
            frequency_id: frequency.id,
            notes: saveNotes.trim() || null
          });
        
        toast.success("Frequency saved to your library");
      }
      
      queryClient.invalidateQueries({ queryKey: ["saved-frequencies", user.id] });
      setSaveDialogOpen(false);
    } catch (error) {
      console.error("Error saving frequency:", error);
      toast.error("Failed to save frequency");
    }
  };

  const handleUnsaveFrequency = async () => {
    if (!user || !savedId) return;
    
    try {
      await supabase
        .from('user_saved_frequencies')
        .delete()
        .eq('id', savedId);
      
      toast.success("Frequency removed from saved library");
      queryClient.invalidateQueries({ queryKey: ["saved-frequencies", user.id] });
    } catch (error) {
      console.error("Error removing saved frequency:", error);
      toast.error("Failed to remove saved frequency");
    }
  };

  return (
    <Card className="overflow-hidden h-full transition-shadow hover:shadow-md border border-gray-200">
      <div className={`h-2 bg-gradient-to-r ${getChakraColor(frequency.chakra)}`} />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{frequency.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <Music className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{frequency.frequency} Hz</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 border-indigo-200">
            {frequency.chakra || "Unknown"} Chakra
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{frequency.description}</p>
        
        {frequency.tags && frequency.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {frequency.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {frequency.length && (
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDuration(frequency.length)}</span>
          </div>
        )}
        
        {notes && (
          <div className="mt-3 p-2 bg-purple-50 rounded-md">
            <p className="text-xs text-purple-700 italic">{notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <div className="flex gap-1">
          <SacredAudioPlayer
            audioUrl={frequency.audio_url}
            url={frequency.url}
            frequency={frequency.frequency}
            isPlaying={isPlaying}
            onPlayToggle={handlePlay}
          />
          
          {savedId ? (
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-red-600 hover:bg-red-50"
              onClick={handleUnsaveFrequency}
            >
              <BookmarkIcon className="h-3.5 w-3.5 mr-1 fill-current" />
              Unsave
            </Button>
          ) : (
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200"
                >
                  <BookmarkIcon className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Save Frequency</DialogTitle>
                  <DialogDescription>
                    Save this frequency to your personal library
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`bg-gradient-to-r ${getChakraColor(frequency.chakra)} text-white border-none`}
                    >
                      {frequency.chakra || "Unknown"} Chakra
                    </Badge>
                    <span className="text-sm font-medium">{frequency.frequency} Hz</span>
                  </div>
                  <h3 className="font-medium">{frequency.title}</h3>
                  <Textarea
                    placeholder="Add personal notes about this frequency..."
                    value={saveNotes}
                    onChange={(e) => setSaveNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveFrequency}>
                    Save to Library
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Button 
          variant="default" 
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          onClick={handleStartJourney}
        >
          Start Journey
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FrequencyCard;
