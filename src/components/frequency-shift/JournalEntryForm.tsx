
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { JournalTag } from "./types";

interface JournalEntryFormProps {
  frequency?: number;
  chakra?: string;
  visualType?: string;
  intention?: string;
  onSaved: () => void;
  onCancel: () => void;
}

const journalTags: JournalTag[] = [
  { text: "Clarity", value: "clarity" },
  { text: "Healing", value: "healing" },
  { text: "Alignment", value: "alignment" },
  { text: "Empowerment", value: "empowerment" },
  { text: "Letting go", value: "letting_go" },
  { text: "Expansion", value: "expansion" },
];

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  frequency,
  chakra,
  visualType,
  intention,
  onSaved,
  onCancel
}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  const handleTagSelect = (tagValue: string) => {
    setSelectedTag(selectedTag === tagValue ? null : tagValue);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please give this moment a name");
      return;
    }

    if (!user) {
      toast.error("You need to be signed in to save to your timeline");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Saving timeline entry with data:", {
        user_id: user.id,
        title: title.trim(),
        notes: notes.trim() || null,
        tag: selectedTag || null,
        intention: intention || null,
        frequency: frequency || null,
        chakra: chakra || null,
        visual_type: visualType || null,
        tags: selectedTag ? [selectedTag] : []
      });

      // Save to Supabase timeline_snapshots table
      const { data, error } = await supabase
        .from('timeline_snapshots')
        .insert([{
          user_id: user.id,
          title: title.trim(),
          notes: notes.trim() || null,
          tag: selectedTag || null, 
          intention: intention || null,
          frequency: frequency || null,
          chakra: chakra || null,
          visual_type: visualType || null,
          // Add tags array to make filtering easier
          tags: selectedTag ? [selectedTag] : []
        }])
        .select();

      if (error) {
        console.error("Error saving timeline entry:", error);
        toast.error("There was a problem saving your moment");
        return;
      }

      console.log("Timeline entry saved successfully:", data);
      toast.success("Your moment has been saved to your timeline");
      onSaved();
    } catch (error) {
      console.error("Error in timeline save:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
          Save Your Moment
        </h3>
        <p className="text-gray-600 mb-4">
          Let's capture this energetic snapshot.
        </p>
        <p className="text-gray-600 mb-4">
          Name this moment—give it a word, a phrase, or a feeling. Something to remind you of this shift.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Name this moment..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />

        <div>
          <p className="text-sm text-gray-500 mb-2">Optional tag:</p>
          <div className="flex flex-wrap gap-2">
            {journalTags.map((tag) => (
              <Button
                key={tag.value}
                type="button"
                variant={selectedTag === tag.value ? "default" : "outline"}
                className={selectedTag === tag.value ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
                onClick={() => handleTagSelect(tag.value)}
                size="sm"
              >
                {tag.text}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Want to go deeper?</p>
          <p className="text-sm text-gray-500 mb-2">
            Write anything that came up during your journey—thoughts, memories, visuals, or just how you feel now.
            This space is just for you.
          </p>
          <Textarea
            placeholder="Reflect on your experience..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[120px]"
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {isSubmitting ? "Saving..." : "Save to Timeline"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryForm;
