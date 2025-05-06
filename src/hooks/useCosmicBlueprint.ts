
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { 
  fetchUserCosmicBlueprint, 
  createCosmicBlueprint,
  calculateEnergeticAlignment,
  getResonantSignature,
  getCosmicRecommendations
} from '@/services/cosmicBlueprintService';
import { 
  CosmicBlueprint, 
  EnergicAlignmentMetrics,
  DNAStrandStatus,
  CosmicRecommendation,
  StarseedResonanceType
} from '@/types/cosmic-blueprint';
import { toast } from 'sonner';

export const useCosmicBlueprint = () => {
  const { user } = useAuth();
  const { getDominantChakra } = useChakraActivations();
  const [loading, setLoading] = useState(true);
  const [blueprint, setBlueprint] = useState<CosmicBlueprint | null>(null);
  const [alignmentMetrics, setAlignmentMetrics] = useState<EnergicAlignmentMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<CosmicRecommendation[]>([]);
  const [calculatingAlignment, setCalculatingAlignment] = useState(false);

  useEffect(() => {
    const loadCosmicBlueprint = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Try to fetch existing blueprint
        let userBlueprint = await fetchUserCosmicBlueprint(user.id);
        
        // If no blueprint exists yet, create one
        if (!userBlueprint) {
          userBlueprint = await createCosmicBlueprint(user.id);
          if (userBlueprint) {
            toast.success('Your Cosmic Blueprint has been initialized!');
          }
        }
        
        if (userBlueprint) {
          // Add virtual fields
          userBlueprint.dominant_chakra = getDominantChakra();
          userBlueprint.resonant_signature = getResonantSignature(
            userBlueprint.energetic_alignment_score,
            userBlueprint.dominant_chakra
          );
          
          setBlueprint(userBlueprint);
          
          // Load recommendations
          const cosmicRecommendations = await getCosmicRecommendations(user.id);
          setRecommendations(cosmicRecommendations);
        }
      } catch (err) {
        console.error('Error in loadCosmicBlueprint:', err);
        toast.error('Failed to load your cosmic blueprint');
      } finally {
        setLoading(false);
      }
    };
    
    loadCosmicBlueprint();
  }, [user, getDominantChakra]);

  const recalculateAlignment = async () => {
    if (!user) return;
    
    setCalculatingAlignment(true);
    try {
      const metrics = await calculateEnergeticAlignment(user.id);
      setAlignmentMetrics(metrics);
      
      // Update the blueprint with the new score
      if (blueprint) {
        const updatedBlueprint = { 
          ...blueprint, 
          energetic_alignment_score: metrics.overallScore,
          resonant_signature: getResonantSignature(
            metrics.overallScore,
            blueprint.dominant_chakra
          )
        };
        setBlueprint(updatedBlueprint);
      }
      
      return metrics;
    } catch (err) {
      console.error('Error recalculating alignment:', err);
      toast.error('Failed to calculate your energetic alignment');
      return null;
    } finally {
      setCalculatingAlignment(false);
    }
  };

  const updateDNAStrands = async (dnaStrandStatus: DNAStrandStatus) => {
    if (!user || !blueprint) return false;
    
    try {
      const result = await updateDNAStrandStatus(user.id, dnaStrandStatus);
      
      if (result) {
        setBlueprint({
          ...blueprint,
          dna_strand_status: dnaStrandStatus
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating DNA strands:', err);
      return false;
    }
  };

  const updateStarseedResonance = async (resonanceTypes: StarseedResonanceType[]) => {
    if (!user || !blueprint) return false;
    
    try {
      // Implementation will be added in the next iteration
      return false;
    } catch (err) {
      console.error('Error updating starseed resonance:', err);
      return false;
    }
  };

  return {
    loading,
    blueprint,
    alignmentMetrics,
    recommendations,
    calculatingAlignment,
    recalculateAlignment,
    updateDNAStrands,
    updateStarseedResonance
  };
};
