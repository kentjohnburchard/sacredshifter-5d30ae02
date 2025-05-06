
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, FileText, Edit, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChakraTag } from '@/types/chakras';
import ChakraIcon from '@/components/chakra/ChakraIcon';

interface TimelineViewerProps {
  activeTagFilter: string;
  chakraFilter: ChakraTag[];
  onEdit: (entry: any) => void;
}

const TimelineViewer: React.FC<TimelineViewerProps> = ({ activeTagFilter, chakraFilter, onEdit }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        let query = supabase
          .from('timeline_snapshots')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (activeTagFilter !== 'all') {
          query = query.eq('tag', activeTagFilter);
        }
        
        if (chakraFilter && chakraFilter.length > 0) {
          query = query.in('chakra', chakraFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching timeline:', error);
          return;
        }
        
        setEntries(data || []);
      } catch (err) {
        console.error('Error in fetchTimeline:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeline();
  }, [user, activeTagFilter, chakraFilter]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-purple-500 rounded-full"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No timeline entries found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-black/40 border border-gray-800 rounded-lg p-4 hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-white">{entry.title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="flex items-center gap-1 bg-gray-900/50">
              <Calendar className="h-3 w-3" />
              {new Date(entry.created_at).toLocaleDateString()}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 bg-gray-900/50">
              <Tag className="h-3 w-3" />
              {entry.tag}
            </Badge>
            
            {entry.chakra && (
              <Badge variant="outline" className="flex items-center gap-1 bg-purple-900/30 border-purple-500/30">
                <ChakraIcon chakraTag={entry.chakra as ChakraTag} size={14} />
                {entry.chakra}
              </Badge>
            )}
          </div>
          
          {entry.notes && (
            <div className="mt-2 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  {typeof entry.notes === 'string' && entry.notes.startsWith('{') ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {JSON.stringify(JSON.parse(entry.notes), null, 2)}
                    </pre>
                  ) : (
                    <p>{entry.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => onEdit(entry)}>
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TimelineViewer;
