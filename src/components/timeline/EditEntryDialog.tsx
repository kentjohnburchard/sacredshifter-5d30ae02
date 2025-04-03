
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TagsInput from "./TagsInput";

interface TimelineEntry {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  tag: string | null;
  tags?: string[];
  journal?: string;
  frequency?: number | null;
  chakra?: string | null;
  created_at: string;
  updated_at: string;
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
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setNotes(entry.notes || "");
      setTags(entry.tags || []);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!entry) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("timeline_snapshots")
        .update({
          title,
          notes,
          tags,
          updated_at: new Date().toISOString()
        })
        .eq("id", entry.id);
      
      if (error) throw error;
      
      toast.success("Timeline entry updated successfully");
      onEntryUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating timeline entry:", error);
      toast.error("Failed to update timeline entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("timeline_snapshots")
        .delete()
        .eq("id", entry.id);
      
      if (error) throw error;
      
      toast.success("Timeline entry deleted");
      onEntryUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting timeline entry:", error);
      toast.error("Failed to delete timeline entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Timeline Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this entry"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this frequency experience"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagsInput 
              value={tags} 
              onChange={setTags} 
              placeholder="Add tags and press Enter"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Entry
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={isLoading || !title.trim()}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
