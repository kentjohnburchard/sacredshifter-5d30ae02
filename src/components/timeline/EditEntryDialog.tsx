
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import TagsInput from "./TagsInput";

interface TimelineEntry {
  id: string;
  title: string;
  notes: string | null;
  tags: string[] | null;
  journal: string | null;
  created_at: string;
}

interface EditEntryDialogProps {
  entry: TimelineEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryUpdated: () => void;
}

const EditEntryDialog: React.FC<EditEntryDialogProps> = ({
  entry,
  open,
  onOpenChange,
  onEntryUpdated
}) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [notes, setNotes] = useState(entry?.notes || "");
  const [journal, setJournal] = useState(entry?.journal || "");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Reset form when entry changes
  React.useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setNotes(entry.notes || "");
      setJournal(entry.journal || "");
      setTags(entry.tags || []);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!entry || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("timeline_snapshots")
        .update({
          title,
          notes,
          journal,
          tags
        })
        .eq("id", entry.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating entry:", error);
        toast.error("Failed to update entry");
        return;
      }

      toast.success("Entry updated");
      onEntryUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsSaving(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Timeline Entry</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Moment title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <TagsInput 
              value={tags} 
              onChange={setTags} 
              placeholder="Add tags (press Enter after each tag)"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this moment"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="journal">Journal Entry</Label>
            <Textarea
              id="journal"
              value={journal || ""}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Your journal entry"
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
