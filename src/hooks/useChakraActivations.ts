
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChakraTag } from '@/types/chakras';

interface ChakraActivation {
  id: string;
  chakra_tag: ChakraTag;
  journey_id?: string;
  activation_type: string;
  created_at: string;
}

interface ChakraActivationCounts {
  [key: string]: number;
}

export const useChakraActivations = () => {
  const { user } = useAuth();
  const [activations, setActivations] = useState<ChakraActivation[]>([]);
  const [activationCounts, setActivationCounts] = useState<ChakraActivationCounts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivations = async () => {
      if (!user) {
        setActivations([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_chakra_activations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedData = data as ChakraActivation[];
        setActivations(typedData);

        // Calculate activation counts by chakra
        const counts = typedData.reduce((acc, activation) => {
          const chakra = activation.chakra_tag;
          acc[chakra] = (acc[chakra] || 0) + 1;
          return acc;
        }, {} as ChakraActivationCounts);

        setActivationCounts(counts);
      } catch (err: any) {
        console.error('Error fetching chakra activations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivations();
  }, [user]);

  const recordActivation = async (
    chakraTag: ChakraTag,
    activationType: string,
    journeyId?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_chakra_activations')
        .insert({
          user_id: user.id,
          chakra_tag: chakraTag,
          activation_type: activationType,
          journey_id: journeyId
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const newActivation = data as ChakraActivation;
      setActivations(prev => [newActivation, ...prev]);
      
      // Update counts
      setActivationCounts(prev => ({
        ...prev,
        [chakraTag]: (prev[chakraTag] || 0) + 1
      }));

      return newActivation;
    } catch (err: any) {
      console.error('Error recording chakra activation:', err);
      return null;
    }
  };

  const getDominantChakra = (): ChakraTag | null => {
    if (Object.keys(activationCounts).length === 0) return null;
    
    let maxCount = 0;
    let dominant: ChakraTag | null = null;
    
    Object.entries(activationCounts).forEach(([chakra, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = chakra as ChakraTag;
      }
    });
    
    return dominant;
  };

  return {
    activations,
    activationCounts,
    loading,
    error,
    recordActivation,
    getDominantChakra
  };
};
