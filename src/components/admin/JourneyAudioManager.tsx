
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Music, Save } from "lucide-react";

interface Template {
  id: string;
  title: string;
}

interface Track {
  title: string;
  url?: string;
  audioUrl?: string;
}

const JourneyAudioManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [assignedTracks, setAssignedTracks] = useState<{
    fileName: string;
    displayTitle?: string;
    displayOrder: number;
    isPrimary: boolean;
  }[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [newTrackFile, setNewTrackFile] = useState<File | null>(null);
  const [newTrackTitle, setNewTrackTitle] = useState<string>("");
  const [newTrackDisplayOrder, setNewTrackDisplayOrder] = useState<number>(0);

  useEffect(() => {
    fetchTemplates();
    fetchAllTracks();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      fetchAssignedTracks(selectedTemplate.id);
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("journey_templates").select("id, title");
      if (error) throw error;
      if (data) {
        setTemplates(data);
        // Auto-select first template
        if (data.length > 0 && !selectedTemplate) {
          setSelectedTemplate(data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      toast.error("Failed to load journey templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("frequency_library")
        .select("title, audio_url, url");
      if (error) throw error;
      if (data) {
        setAllTracks(data);
      }
    } catch (err) {
      console.error("Error fetching tracks:", err);
      toast.error("Failed to load audio tracks");
    }
  };

  const fetchAssignedTracks = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from("journey_template_audio_mappings")
        .select("audio_file_name, display_title, display_order, is_primary")
        .eq("journey_template_id", templateId);
      
      if (error) throw error;
      if (data) {
        setAssignedTracks(data.map(d => ({
          fileName: d.audio_file_name,
          displayTitle: d.display_title,
          displayOrder: d.display_order || 0,
          isPrimary: d.is_primary
        })));
      }
    } catch (err) {
      console.error("Error fetching assigned tracks:", err);
      toast.error("Failed to load assigned tracks");
    }
  };

  const assignTrack = async (filename: string) => {
    if (!selectedTemplate) return;
    
    try {
      const { error } = await supabase.from("journey_template_audio_mappings").insert({
        journey_template_id: selectedTemplate.id,
        audio_file_name: filename,
        is_primary: false,
        display_order: assignedTracks.length
      });
      
      if (error) throw error;
      
      toast.success(`Track assigned to ${selectedTemplate.title}`);
      fetchAssignedTracks(selectedTemplate.id);
    } catch (err) {
      console.error("Error assigning track:", err);
      toast.error("Failed to assign track");
    }
  };

  const unassignTrack = async (filename: string) => {
    if (!selectedTemplate) return;
    
    try {
      const { error } = await supabase
        .from("journey_template_audio_mappings")
        .delete()
        .match({
          journey_template_id: selectedTemplate.id,
          audio_file_name: filename
        });
      
      if (error) throw error;
      
      toast.success(`Track unassigned from ${selectedTemplate.title}`);
      fetchAssignedTracks(selectedTemplate.id);
    } catch (err) {
      console.error("Error unassigning track:", err);
      toast.error("Failed to unassign track");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTrackFile(file);
      if (!newTrackTitle) {
        setNewTrackTitle(file.name.replace(/\.[^/.]+$/, "")); // Set title to filename without extension
      }
    }
  };

  const uploadNewTrack = async () => {
    if (!newTrackFile || !newTrackTitle) {
      toast.error("Please select a file and provide a title");
      return;
    }

    try {
      setUploadingFile(true);
      
      // Upload to storage
      const filename = `journey/${Date.now()}-${newTrackFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("frequency-assets")
        .upload(filename, newTrackFile);
      
      if (uploadError) throw uploadError;
      
      // Create entry in frequency_library
      const { error: insertError } = await supabase.from("frequency_library").insert({
        title: newTrackTitle,
        audio_url: `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${filename}`,
        feature: "journey",
        type: "journey-audio",
        frequency: 432, // Adding a default frequency value
        description: "Journey audio track"
      });
      
      if (insertError) throw insertError;
      
      // If a template is selected, auto-assign the track
      if (selectedTemplate) {
        await supabase.from("journey_template_audio_mappings").insert({
          journey_template_id: selectedTemplate.id,
          audio_file_name: filename,
          is_primary: false,
          display_order: assignedTracks.length,
          display_title: newTrackTitle
        });
      }
      
      toast.success("Track uploaded successfully!");
      
      // Reset form
      setNewTrackFile(null);
      setNewTrackTitle("");
      setNewTrackDisplayOrder(0);
      
      // Refresh track list
      fetchAllTracks();
      if (selectedTemplate) {
        fetchAssignedTracks(selectedTemplate.id);
      }
    } catch (err) {
      console.error("Error uploading track:", err);
      toast.error("Failed to upload track");
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Journey Templates</h2>
          <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                className="justify-start overflow-hidden"
                onClick={() => setSelectedTemplate(template)}
                variant={selectedTemplate?.id === template.id ? "default" : "outline"}
              >
                <span className="truncate">{template.title}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {selectedTemplate && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Audio for: {selectedTemplate.title}
            </h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Assigned Audio Files</h3>
              {assignedTracks.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {assignedTracks.map((track) => (
                    <Card key={track.fileName} className="overflow-hidden">
                      <CardContent className="flex items-center justify-between p-3">
                        <div className="truncate mr-2 flex items-center">
                          <Music className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                          <div>
                            <span className="text-sm font-medium">{track.displayTitle || track.fileName}</span>
                            <div className="text-xs text-gray-500">
                              Order: {track.displayOrder} 
                              {track.isPrimary && <span className="ml-2 text-green-600">Primary</span>}
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => unassignTrack(track.fileName)} 
                          variant="destructive" 
                          size="sm"
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No audio files assigned.</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Available Audio Files</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {allTracks
                  .filter((track) => !assignedTracks.some(at => at.fileName === track.title))
                  .map((track) => (
                    <Card key={track.title} className="overflow-hidden">
                      <CardContent className="flex items-center justify-between p-3">
                        <div className="truncate mr-2 flex items-center">
                          <Music className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                          <span className="truncate text-sm">{track.title}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => assignTrack(track.title)}
                        >
                          Assign
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-yellow-50 p-4 rounded-md">
        <h3 className="text-md font-medium text-yellow-800 mb-2">
          Audio Upload Instructions
        </h3>
        <p className="text-sm text-yellow-700">
          To add audio files, upload them to the Supabase storage bucket: <code>frequency-assets</code>
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Recommended path format: <code>journey/your-file-name.mp3</code>
        </p>
      </div>
    </div>
  );
};

export default JourneyAudioManager;
