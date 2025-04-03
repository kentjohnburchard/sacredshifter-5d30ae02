
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wand2, Music, Sparkles, MicVocal, Tag } from "lucide-react";
import { MusicGenerationRequest } from "@/services/api";
import { HealingFrequency } from "@/data/frequencies";

interface MusicFormProps {
  onSubmit?: (params: MusicGenerationRequest) => void;
  isGenerating?: boolean;
  initialFrequency?: HealingFrequency | null;
}

const MusicForm: React.FC<MusicFormProps> = ({ 
  onSubmit = () => {}, // Provide default no-op function
  isGenerating = false, 
  initialFrequency = null 
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [negativeTags, setNegativeTags] = useState("");
  const [lyricsType, setLyricsType] = useState<"generate" | "user" | "instrumental">("instrumental");
  
  useEffect(() => {
    if (initialFrequency) {
      setTitle(`${initialFrequency.name} Healing`);
      
      const frequencyDescription = [
        `A healing meditation track based on the ${initialFrequency.frequency}Hz frequency.`,
        initialFrequency.chakra ? `Focused on the ${initialFrequency.chakra} chakra.` : '',
        `Incorporate subtle ${initialFrequency.name.toLowerCase()} tones and harmonics.`
      ].filter(Boolean).join(' ');
      
      setDescription(frequencyDescription);
    }
  }, [initialFrequency]);
  
  const generateRandomSeed = () => {
    return Math.floor(Math.random() * 2000000) - 1000000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !title.trim()) {
      return;
    }
    
    const params: MusicGenerationRequest = {
      title: title,
      gpt_description_prompt: description,
      lyrics_type: lyricsType,
      seed: generateRandomSeed(),
      frequency: initialFrequency ? initialFrequency.frequency : undefined
    };
    
    if (negativeTags.trim()) {
      params.negative_tags = negativeTags;
    }
    
    onSubmit(params);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-xl bg-gradient-to-br from-brand-purple/90 to-brand-deep/90 backdrop-blur-md overflow-hidden animate-slide-up rounded-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold flex items-center gap-1.5 text-shadow-sm text-white">
              <Tag className="h-4 w-4 text-brand-lavender" />
              Song Title
            </Label>
            <Input
              id="title"
              placeholder="Enter a title for your song"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-all focus:ring-brand-lavender/50 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold flex items-center gap-1.5 text-shadow-sm text-white">
              <Sparkles className="h-4 w-4 text-brand-lavender" />
              Describe your music
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the music you want to create... (e.g. 'A relaxing piano melody with ambient sounds')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[120px] transition-all focus:ring-brand-lavender/50 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-bold flex items-center gap-1.5 text-shadow-sm text-white">
              <MicVocal className="h-4 w-4 text-brand-lavender" />
              Lyrics Type
            </Label>
            <RadioGroup 
              className="flex items-center gap-4" 
              defaultValue="instrumental"
              value={lyricsType}
              onValueChange={(value) => setLyricsType(value as "generate" | "user" | "instrumental")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instrumental" id="instrumental" className="border-brand-lavender text-brand-lavender data-[state=checked]:bg-brand-lavender data-[state=checked]:text-white" />
                <Label htmlFor="instrumental" className="cursor-pointer font-medium text-white">Instrumental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="generate" id="generate" className="border-brand-lavender text-brand-lavender data-[state=checked]:bg-brand-lavender data-[state=checked]:text-white" />
                <Label htmlFor="generate" className="cursor-pointer font-medium text-white">AI-Generated Lyrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" className="border-brand-lavender text-brand-lavender data-[state=checked]:bg-brand-lavender data-[state=checked]:text-white" />
                <Label htmlFor="user" className="cursor-pointer font-medium text-white">Custom Lyrics</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="negativeTags" className="text-sm font-bold flex items-center gap-1.5 text-shadow-sm text-white">
              <Music className="h-4 w-4 text-brand-lavender" />
              Negative tags (optional)
            </Label>
            <Input
              id="negativeTags"
              placeholder="Elements to avoid (comma separated)"
              value={negativeTags}
              onChange={(e) => setNegativeTags(e.target.value)}
              className="transition-all focus:ring-brand-lavender/50 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-white/70">
              Specify elements you want to avoid in your music
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-brand-lavender to-brand-purple hover:from-brand-purple hover:to-brand-deep text-white border-none shadow-lg"
            disabled={isGenerating || !description.trim() || !title.trim()}
          >
            {isGenerating ? (
              <>
                <div className="music-bars">
                  <div className="music-bar animate-music-bar-1"></div>
                  <div className="music-bar animate-music-bar-2"></div>
                  <div className="music-bar animate-music-bar-3"></div>
                  <div className="music-bar animate-music-bar-4"></div>
                </div>
                <span>Creating Your Sound...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Sacred Music</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MusicForm;
