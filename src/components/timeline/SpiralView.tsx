
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChakraTag } from '@/types/chakras';

export interface SpiralViewProps {
  activeTagFilter: string;
  chakraFilter: ChakraTag[];  // Add this property to match Timeline.tsx usage
  onEdit: (entry: any) => void;
}

const SpiralView: React.FC<SpiralViewProps> = ({ activeTagFilter, chakraFilter, onEdit }) => {
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

  return (
    <div className="spiral-timeline-container">
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No timeline entries found.</p>
        </div>
      ) : (
        <div className="spiral-visualization">
          <p className="text-center mb-6">
            Spiral visualization of {entries.length} timeline entries
          </p>
          {/* Placeholder for actual spiral visualization - would be implemented with D3 or similar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="p-4 rounded-md bg-gray-800/50 border border-gray-700 hover:border-purple-500 cursor-pointer transition-all"
                onClick={() => onEdit(entry)}
              >
                <h3 className="text-lg font-semibold mb-1">{entry.title}</h3>
                <p className="text-sm text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</p>
                {entry.chakra && (
                  <span className="inline-block px-2 py-1 text-xs rounded mt-2 bg-purple-900/50">
                    {entry.chakra}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiralView;
