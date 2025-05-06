
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Heart } from 'lucide-react';

interface EarthReflectionEntry {
  id: string;
  content: string;
  created_at: string;
  chakra_tag: string;
  alignment_score?: number;
}

const EarthReflectionLog: React.FC = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<EarthReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReflection, setSelectedReflection] = useState<EarthReflectionEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchReflections = async () => {
      if (!user) return;
      
      try {
        // Type cast the response to work with our interface
        const { data, error } = await supabase
          .from('earth_resonance_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }) as any;
        
        if (error) {
          throw error;
        }
        
        setReflections(data || []);
      } catch (err) {
        console.error('Error fetching Earth reflections:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReflections();
  }, [user]);
  
  const handleReflectionClick = (reflection: EarthReflectionEntry) => {
    setSelectedReflection(reflection);
    setDialogOpen(true);
  };
  
  if (loading) {
    return (
      <Card className="border-pink-500/30 bg-black/50 backdrop-blur-md h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-pink-300/70">Loading reflections...</div>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="border-pink-500/30 bg-black/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500/20 to-amber-500/20 pb-3">
          <CardTitle className="text-white/90 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" />
            Earth Realm Reflections
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {reflections.length === 0 ? (
            <div className="text-center py-10 text-white/60">
              <p>You haven't recorded any Earth Realm reflections yet.</p>
              <p className="text-sm mt-2">Click "Reflect" on the Earth Realm Resonance panel to begin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  onClick={() => handleReflectionClick(reflection)}
                  className="p-3 rounded-md bg-black/30 border border-pink-500/20 hover:border-pink-500/40 cursor-pointer transition-all duration-300"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-pink-300/70">
                      {format(new Date(reflection.created_at), 'MMM d, yyyy • h:mm a')}
                    </span>
                    {reflection.alignment_score && (
                      <span className="text-xs text-amber-300/70">
                        Alignment: {reflection.alignment_score}
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {reflection.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-rose-500/10 to-amber-500/10 backdrop-blur-md border-rose-500/30">
          <DialogHeader>
            <DialogTitle className="text-white/90">Earth Realm Reflection</DialogTitle>
          </DialogHeader>
          
          {selectedReflection && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-pink-300/70">
                  {format(new Date(selectedReflection.created_at), 'MMMM d, yyyy • h:mm a')}
                </span>
                {selectedReflection.alignment_score && (
                  <span className="text-amber-300/70">
                    Alignment Score: {selectedReflection.alignment_score}
                  </span>
                )}
              </div>
              
              <div className="bg-black/30 rounded-md p-4 text-white/90 leading-relaxed">
                {selectedReflection.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EarthReflectionLog;
