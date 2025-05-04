
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface EditEntryDialogProps {
  entry: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditEntryDialog: React.FC<EditEntryDialogProps> = ({ entry, open, onOpenChange }) => {
  const handleSave = () => {
    // Save logic here
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Timeline Entry</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                defaultValue={entry?.title}
                className="w-full p-2 bg-gray-800/50 rounded-md border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                defaultValue={entry?.date}
                className="w-full p-2 bg-gray-800/50 rounded-md border border-gray-700"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
