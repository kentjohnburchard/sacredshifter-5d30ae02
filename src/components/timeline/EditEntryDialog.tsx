
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import TagsInput from "./TagsInput";
import { Check, X } from "lucide-react";

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
  useEffect(() => {
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

      toast.success("✅ Your moment has been updated. Reconnection complete.");
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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
          <DialogTitle className="text-xl font-semibold">Edit Saved Moment</DialogTitle>
          <DialogDescription className="text-white/80 mt-1">
            Update your moment details and reconnect with this vibration
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Update your moment title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give this moment a meaningful title"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
              <TagsInput 
                value={tags} 
                onChange={setTags} 
                placeholder="Add tags that represent this moment"
              />
              <p className="text-xs text-gray-500">
                Suggested: Healing, Clarity, Empowerment, Letting Go, Alignment, Expansion
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">Notes</Label>
              <Textarea
                id="notes"
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Brief notes about this frequency moment"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="journal" className="text-base font-medium">Update your reflection</Label>
              <Textarea
                id="journal"
                value={journal || ""}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Reflect on your experience, insights, or feelings during this frequency journey"
                className="min-h-[150px]"
              />
              <p className="text-xs text-gray-500">
                Take a moment to reflect on how this frequency made you feel and what insights emerged
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-1"
          >
            {isSaving ? "Updating..." : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
