
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { hermeticJourneys } from "@/data/hermeticJourneys";
import { Music, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HermeticTrackUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPrinciple?: string;
  onTrackUploaded: (trackData: any) => void;
}

const suggestedTags: Record<string, string[]> = {
  "Mentalism": ["Consciousness", "Stillness", "Cosmic", "Clarity"],
  "Correspondence": ["Insight", "Self-reflection", "Intuitive", "Mirror"],
  "Vibration": ["Energy", "Alignment", "Empowerment", "Joy"],
  "Polarity": ["Emotional healing", "Connection", "Yin-yang", "Balance"],
  "Rhythm": ["Flow", "Surrender", "Cycles", "Feminine energy"],
  "Cause & Effect": ["Voice", "Manifestation", "Ripple", "Intention"],
  "Gender": ["Grounding", "Stability", "Sacred union", "Divine energy"],
};

const HermeticTrackUploadModal: React.FC<HermeticTrackUploadModalProps> = ({
  open,
  onOpenChange,
  defaultPrinciple = "",
  onTrackUploaded
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [principle, setPrinciple] = useState(defaultPrinciple);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [isUrlInput, setIsUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file);
    } else if (file) {
      toast.error("Please select an audio file");
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You need to be logged in to upload tracks");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a track title");
      return;
    }

    if (!principle) {
      toast.error("Please select a principle");
      return;
    }

    if (!isUrlInput && !selectedFile) {
      toast.error("Please select an audio file or provide a URL");
      return;
    }

    if (isUrlInput && !audioUrl.trim()) {
      toast.error("Please enter an audio URL");
      return;
    }

    setIsUploading(true);

    try {
      // Here you would implement the actual file upload logic using Supabase Storage
      // For now, we'll simulate a successful upload
      
      // Mock successful upload after 1.5 seconds
      setTimeout(() => {
        const uploadedTrack = {
          id: `track-${Date.now()}`,
          title,
          artist: artist || "Unknown Artist",
          audioUrl: isUrlInput ? audioUrl : `https://example.com/${selectedFile?.name}`,
          duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-5 minutes
          tags: selectedTags,
          principle,
          chakra: hermeticJourneys.find(j => j.principle === principle)?.chakra || "",
        };

        onTrackUploaded(uploadedTrack);
        
        // Reset form
        setTitle("");
        setArtist("");
        setPrinciple(defaultPrinciple);
        setSelectedFile(null);
        setSelectedTags([]);
        setAudioUrl("");
        setIsUploading(false);
        
        // Close modal
        onOpenChange(false);
        
        toast.success("Track uploaded successfully!");
      }, 1500);
    } catch (error) {
      console.error("Error uploading track:", error);
      toast.error("Failed to upload track. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Upload Track for Hermetic Journey
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Track Title</Label>
            <Input
              id="title"
              placeholder="Enter track title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist/Source</Label>
            <Input
              id="artist"
              placeholder="Artist name or source (e.g., Pixabay, ZENmix)"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="principle">Hermetic Principle</Label>
            <Select value={principle} onValueChange={setPrinciple}>
              <SelectTrigger>
                <SelectValue placeholder="Select a principle" />
              </SelectTrigger>
              <SelectContent>
                {hermeticJourneys.map((journey) => (
                  <SelectItem key={journey.id} value={journey.principle}>
                    {journey.principle} ({journey.frequency}Hz)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {principle && (
            <div className="space-y-2">
              <Label>Suggested Tags (select multiple)</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags[principle]?.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Audio Source</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsUrlInput(!isUrlInput)}
              >
                {isUrlInput ? "Upload File Instead" : "Use URL Instead"}
              </Button>
            </div>

            {isUrlInput ? (
              <Input
                placeholder="Enter audio URL"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
            ) : (
              <div className="flex items-center">
                <Input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse
                </Button>
                <span className="text-sm text-gray-500 truncate max-w-[250px]">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2">◌</span> Uploading...
              </>
            ) : (
              <>Upload Track</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HermeticTrackUploadModal;
