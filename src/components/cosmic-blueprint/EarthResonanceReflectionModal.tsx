
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createTimelineEntry } from '@/services/timelineService';
import { toast } from 'sonner';

interface EarthResonanceReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EarthResonanceReflectionModal: React.FC<EarthResonanceReflectionModalProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!user || !reflection.trim()) return;
    
    setIsSaving(true);
    
    try {
      // Create timeline entry with the user's reflection
      await createTimelineEntry(
        user.id,
        "Earth Realm Reflection",
        "reflection",
        { 
          topic: 'Earth Realm Resonance', 
          content: reflection 
        },
        'Heart'
      );
      
      toast.success("Reflection saved to your timeline");
      setReflection('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error("Unable to save your reflection");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDiscard = () => {
    setReflection('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-rose-500/10 to-amber-500/10 backdrop-blur-md border-rose-500/30 overflow-hidden">
        {/* Sacred geometry watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="10" stroke="white" strokeWidth="0.5" fill="none" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="0.5" />
            <polygon points="50,30 45,40 55,40" stroke="white" strokeWidth="0.5" fill="none" />
            <polygon points="50,70 45,60 55,60" stroke="white" strokeWidth="0.5" fill="none" />
            <polygon points="30,50 40,45 40,55" stroke="white" strokeWidth="0.5" fill="none" />
            <polygon points="70,50 60,45 60,55" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        
        {/* Content */}
        <DialogHeader className="z-10 relative">
          <DialogTitle className="text-xl text-white/90">Earth Realm Reflection</DialogTitle>
          <DialogDescription className="text-white/70 mt-2">
            How does remembering that Earth is love and light shift your perspective today?
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          className="min-h-[200px] bg-black/30 border-white/20 focus:border-rose-300/50 text-white/90"
          placeholder="Write from your heart..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
        
        <DialogFooter className="sm:justify-between flex flex-row gap-2">
          <Button 
            variant="outline"
            onClick={handleDiscard}
            className="border-rose-500/20 hover:border-rose-500/40 text-white/70 hover:text-white"
          >
            Discard
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!reflection.trim() || isSaving}
            className="bg-gradient-to-r from-rose-500/80 to-amber-500/80 hover:from-rose-500 hover:to-amber-500 text-white transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
          >
            <span className="relative z-10">
              {isSaving ? "Saving..." : "Save Reflection"}
            </span>
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-30 transition-opacity" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EarthResonanceReflectionModal;
