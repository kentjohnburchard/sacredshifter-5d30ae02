
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Music, Sparkles } from "lucide-react";
import { MusicGenerationRequest } from "@/services/api";

interface MusicFormProps {
  onSubmit: (params: MusicGenerationRequest) => void;
  isGenerating: boolean;
}

const MusicForm: React.FC<MusicFormProps> = ({ onSubmit, isGenerating }) => {
  const [description, setDescription] = useState("");
  const [lyricsType, setLyricsType] = useState<"instrumental" | "lyrical">("instrumental");
  const [negativeTags, setNegativeTags] = useState("");
  
  const generateRandomSeed = () => {
    // Generate a random integer between -1000000 and 1000000
    return Math.floor(Math.random() * 2000000) - 1000000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      return;
    }
    
    const params: MusicGenerationRequest = {
      gpt_description_prompt: description,
      lyrics_type: lyricsType,
      seed: generateRandomSeed()
    };
    
    if (negativeTags.trim()) {
      params.negative_tags = negativeTags;
    }
    
    onSubmit(params);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-border/40 shadow-sm animate-slide-up">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              Describe your music
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the music you want to create... (e.g. 'A relaxing piano melody with ambient sounds')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[120px] transition-all focus:ring-accent/50"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Music className="h-4 w-4 text-accent" />
              Type
            </Label>
            <RadioGroup 
              value={lyricsType} 
              onValueChange={(v) => setLyricsType(v as "instrumental" | "lyrical")}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instrumental" id="instrumental" />
                <Label htmlFor="instrumental" className="cursor-pointer">Instrumental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lyrical" id="lyrical" />
                <Label htmlFor="lyrical" className="cursor-pointer">With lyrics</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="negativeTags" className="text-sm font-medium">
              Negative tags (optional)
            </Label>
            <Input
              id="negativeTags"
              placeholder="Elements to avoid (comma separated)"
              value={negativeTags}
              onChange={(e) => setNegativeTags(e.target.value)}
              className="transition-all focus:ring-accent/50"
            />
            <p className="text-xs text-muted-foreground">
              Specify elements you want to avoid in your music
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 transition-all"
            disabled={isGenerating || !description.trim()}
          >
            {isGenerating ? (
              <>
                <div className="music-bars">
                  <div className="music-bar animate-music-bar-1"></div>
                  <div className="music-bar animate-music-bar-2"></div>
                  <div className="music-bar animate-music-bar-3"></div>
                  <div className="music-bar animate-music-bar-4"></div>
                </div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Music</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MusicForm;
