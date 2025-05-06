
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ChakraSelect from '@/components/chakra/ChakraSelect';

interface EditEntryDialogProps {
  entry: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditEntryDialog: React.FC<EditEntryDialogProps> = ({ entry, open, onOpenChange }) => {
  const [title, setTitle] = useState(entry.title);
  const [notes, setNotes] = useState(() => {
    // Try to format notes if it's a JSON string
    if (entry.notes) {
      try {
        const parsedNotes = JSON.parse(entry.notes);
        const { chakra, ...restNotes } = parsedNotes; // Extract chakra value
        return JSON.stringify(restNotes, null, 2);
      } catch (e) {
        return entry.notes;
      }
    }
    return '';
  });
  
  const [chakraTag, setChakraTag] = useState(entry.chakra_tag || (() => {
    // Try to extract chakra from notes
    if (entry.notes) {
      try {
        const parsedNotes = JSON.parse(entry.notes);
        return parsedNotes.chakra || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  })());
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      let notesObj = {};
      
      // Try to parse notes as JSON
      if (notes) {
        try {
          notesObj = JSON.parse(notes);
        } catch (e) {
          // If not valid JSON, use as string
          notesObj = { details: notes };
        }
      }
      
      // Add chakra to the notes object if specified
      if (chakraTag) {
        notesObj = { ...notesObj, chakra: chakraTag };
      }
      
      const { error } = await supabase
        .from('timeline_snapshots')
        .update({ 
          title,
          notes: JSON.stringify(notesObj),
          chakra_tag: chakraTag || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', entry.id);

      if (error) throw error;
      
      toast.success('Entry updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
              placeholder="Entry title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chakra">Chakra</Label>
            <ChakraSelect
              value={chakraTag}
              onChange={setChakraTag}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes or JSON data"
              className="min-h-[100px] font-mono text-sm"
            />
            <p className="text-xs text-gray-400">
              Created: {format(new Date(entry.created_at), 'PPp')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
