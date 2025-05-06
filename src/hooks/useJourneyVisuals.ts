
import { useEffect, useState } from 'react';
import { VisualThemeParams } from '@/context/VisualThemeContext';
import { getJourneyVisualParams, saveJourneyVisualParams } from '@/services/visualThemeService';
import { useJourney } from '@/context/JourneyContext';

export const useJourneyVisuals = (journeyId?: string | number) => {
  const { activeJourney } = useJourney();
  const [visualParams, setVisualParams] = useState<VisualThemeParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use provided journeyId or active journey from context
  const effectiveJourneyId = journeyId?.toString() || activeJourney?.id?.toString();
  
  useEffect(() => {
    if (!effectiveJourneyId) {
      return;
    }
    
    const fetchParams = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = await getJourneyVisualParams(effectiveJourneyId);
        setVisualParams(params);
      } catch (err) {
        console.error('Error in useJourneyVisuals:', err);
        setError('Failed to load visual parameters');
      } finally {
        setLoading(false);
      }
    };
    
    fetchParams();
  }, [effectiveJourneyId]);
  
  const updateVisualParams = async (params: Partial<VisualThemeParams>): Promise<boolean> => {
    if (!effectiveJourneyId) {
      setError('No journey ID provided');
      return false;
    }
    
    try {
      const updatedParams = {
        ...(visualParams || {
          theme: 'default',
          intensity: 3,
          colorScheme: '#9b87f5',
          animated: true
        }),
        ...params
      };
      
      const success = await saveJourneyVisualParams(effectiveJourneyId, updatedParams as VisualThemeParams);
      
      if (success) {
        setVisualParams(updatedParams as VisualThemeParams);
      }
      
      return success;
    } catch (err) {
      console.error('Failed to update visual params:', err);
      setError('Failed to save visual parameters');
      return false;
    }
  };
  
  return {
    visualParams,
    loading,
    error,
    updateVisualParams
  };
};
