
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Reflection {
  id: string;
  content: string;
  timestamp: string;
  journey_id?: string;
  journey_title?: string;
  duration_seconds?: number;
}

interface UseReflectionsOptions {
  limit?: number;
  journeyId?: string;
}

export const useReflections = (options: UseReflectionsOptions = {}) => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!user?.id) {
      setReflections([]);
      setIsLoading(false);
      return;
    }

    const fetchReflections = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('session_reflections')
          .select(`
            id,
            content,
            timestamp,
            journey_completions(
              journey_id,
              duration_seconds
            )
          `)
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });
          
        // Apply optional filters
        if (options.journeyId) {
          query = query.eq('journey_completions.journey_id', options.journeyId);
        }
        
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the data
        const transformedData = data?.map(item => {
          const journeyCompletion = item.journey_completions?.[0];
          
          return {
            id: item.id,
            content: item.content,
            timestamp: item.timestamp,
            journey_id: journeyCompletion?.journey_id,
            duration_seconds: journeyCompletion?.duration_seconds
          };
        }) || [];
        
        setReflections(transformedData);
      } catch (err) {
        console.error('Error fetching reflections:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReflections();
  }, [user?.id, options.limit, options.journeyId]);
  
  /**
   * Save a new reflection
   */
  const saveReflection = async (content: string, journeyId?: string): Promise<string | null> => {
    if (!user?.id) return null;
    
    try {
      const sessionId = crypto.randomUUID();
      
      // Save the reflection
      const { data, error } = await supabase
        .from('session_reflections')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          content: content
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // If a journey ID is provided, also create a completion record
      if (journeyId && data?.id) {
        await supabase
          .from('journey_completions')
          .insert({
            user_id: user.id,
            journey_id: journeyId,
            reflection_id: data.id,
            duration_seconds: 0 // Default duration
          });
      }
      
      // Refresh reflections
      if (data?.id) {
        setReflections(prev => [
          {
            id: data.id,
            content: content,
            timestamp: new Date().toISOString(),
            journey_id: journeyId
          },
          ...prev
        ]);
        
        return data.id;
      }
      
      return null;
    } catch (err) {
      console.error('Error saving reflection:', err);
      setError(err as Error);
      return null;
    }
  };
  
  /**
   * Delete a reflection
   */
  const deleteReflection = async (reflectionId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('session_reflections')
        .delete()
        .eq('id', reflectionId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setReflections(prev => prev.filter(r => r.id !== reflectionId));
      
      return true;
    } catch (err) {
      console.error('Error deleting reflection:', err);
      setError(err as Error);
      return false;
    }
  };

  return {
    reflections,
    isLoading,
    error,
    saveReflection,
    deleteReflection
  };
};
