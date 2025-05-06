
import { supabase } from '@/integrations/supabase/client';
import { 
  CosmicBlueprint, 
  DNAStrandStatus, 
  EnergicAlignmentMetrics,
  StarseedResonanceType,
  CosmicRecommendation
} from '@/types/cosmic-blueprint';
import { ChakraTag } from '@/types/chakras';
import { getUserChakraProgress } from './chakraService';
import { fetchUserTimeline } from './timelineService';

export const fetchUserCosmicBlueprint = async (userId: string): Promise<CosmicBlueprint | null> => {
  try {
    const { data, error } = await supabase
      .from('cosmic_blueprints')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No cosmic blueprint found, return null
        return null;
      }
      console.error('Error fetching cosmic blueprint:', error);
      return null;
    }
    
    return data as CosmicBlueprint;
  } catch (err) {
    console.error('Error in fetchUserCosmicBlueprint:', err);
    return null;
  }
};

export const createCosmicBlueprint = async (
  userId: string,
  sacredBlueprintId?: string
): Promise<CosmicBlueprint | null> => {
  try {
    const initialDnaStatus: DNAStrandStatus = Array(12).fill(false);
    // Activate first DNA strand by default
    initialDnaStatus[0] = true;
    
    const { data, error } = await supabase
      .from('cosmic_blueprints')
      .insert({
        user_id: userId,
        sacred_blueprint_id: sacredBlueprintId,
        dna_strand_status: initialDnaStatus,
        starseed_resonance: [],
        energetic_alignment_score: 1, // Start with minimal score
        personal_code_pattern: 'awakening-sequence',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating cosmic blueprint:', error);
      return null;
    }
    
    return data as CosmicBlueprint;
  } catch (err) {
    console.error('Error in createCosmicBlueprint:', err);
    return null;
  }
};

export const updateDNAStrandStatus = async (
  userId: string,
  dnaStrandStatus: DNAStrandStatus
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cosmic_blueprints')
      .update({
        dna_strand_status: dnaStrandStatus,
        last_updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating DNA strand status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateDNAStrandStatus:', err);
    return false;
  }
};

export const updateStarseedResonance = async (
  userId: string,
  starseedResonance: StarseedResonanceType[]
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cosmic_blueprints')
      .update({
        starseed_resonance,
        last_updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating starseed resonance:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateStarseedResonance:', err);
    return false;
  }
};

export const calculateEnergeticAlignment = async (
  userId: string
): Promise<EnergicAlignmentMetrics> => {
  try {
    // Default metrics
    const defaultMetrics: EnergicAlignmentMetrics = {
      chakraBalance: 0,
      timelineEngagement: 0,
      lightbearerProgress: 0,
      reflectionConsistency: 0,
      overallScore: 0
    };
    
    // Get chakra data
    const chakraProgress = await getUserChakraProgress(userId);
    if (chakraProgress.length > 0) {
      // Calculate chakra balance as standard deviation of chakra percentages
      // Lower standard deviation = better balance
      const percentages = chakraProgress.map(p => p.percentage);
      const mean = percentages.reduce((a, b) => a + b, 0) / percentages.length;
      const variance = percentages.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / percentages.length;
      const stdDev = Math.sqrt(variance);
      
      // Convert to 0-100 scale where 100 is perfect balance
      defaultMetrics.chakraBalance = Math.max(0, Math.min(100, 100 - (stdDev * 2)));
    }
    
    // Get timeline engagement
    const timelineEntries = await fetchUserTimeline(userId);
    if (timelineEntries.length > 0) {
      // Calculate timeline engagement score based on number and recency of entries
      const entriesCount = timelineEntries.length;
      const scoreByCount = Math.min(100, entriesCount * 5); // 5 points per entry, max 100
      
      // Check recency - higher score for recent activity
      const now = new Date();
      const mostRecentEntryDate = new Date(timelineEntries[0].created_at);
      const daysSinceLastEntry = (now.getTime() - mostRecentEntryDate.getTime()) / (1000 * 3600 * 24);
      
      const recencyScore = Math.max(0, 100 - (daysSinceLastEntry * 10)); // Lose 10 points per day of inactivity
      
      defaultMetrics.timelineEngagement = (scoreByCount * 0.6) + (recencyScore * 0.4);
    }
    
    // For now, we'll set these as default values until we implement more comprehensive calculations
    defaultMetrics.lightbearerProgress = 50;
    defaultMetrics.reflectionConsistency = 40;
    
    // Calculate overall score as weighted average
    defaultMetrics.overallScore = Math.round(
      (defaultMetrics.chakraBalance * 0.4) +
      (defaultMetrics.timelineEngagement * 0.3) +
      (defaultMetrics.lightbearerProgress * 0.2) +
      (defaultMetrics.reflectionConsistency * 0.1)
    );
    
    // Update the score in the database
    await supabase
      .from('cosmic_blueprints')
      .update({
        energetic_alignment_score: defaultMetrics.overallScore,
        last_updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    return defaultMetrics;
  } catch (err) {
    console.error('Error calculating energetic alignment:', err);
    return {
      chakraBalance: 0,
      timelineEngagement: 0,
      lightbearerProgress: 0,
      reflectionConsistency: 0,
      overallScore: 0
    };
  }
};

export const getResonantSignature = (
  alignmentScore: number,
  dominantChakra?: ChakraTag
): string => {
  const alignmentLevel = 
    alignmentScore >= 80 ? 'Harmonized' :
    alignmentScore >= 60 ? 'Aligned' :
    alignmentScore >= 40 ? 'Awakening' : 'Seeking';
  
  const chakraElement = dominantChakra ? 
    dominantChakra === 'Root' ? 'Earth' :
    dominantChakra === 'Sacral' ? 'Water' :
    dominantChakra === 'Solar Plexus' ? 'Fire' :
    dominantChakra === 'Heart' ? 'Air' :
    dominantChakra === 'Throat' ? 'Sound' :
    dominantChakra === 'Third Eye' ? 'Light' :
    dominantChakra === 'Crown' ? 'Cosmic' :
    'Multidimensional' : 'Balanced';
  
  const frequency = 
    alignmentScore >= 80 ? '963Hz' :
    alignmentScore >= 60 ? '528Hz' :
    alignmentScore >= 40 ? '432Hz' : '396Hz';
  
  return `${alignmentLevel} ${chakraElement} Resonator (${frequency})`;
};

export const getCosmicRecommendations = async (
  userId: string,
  limit: number = 3
): Promise<CosmicRecommendation[]> => {
  try {
    // Get user's dominant chakra
    const chakraProgress = await getUserChakraProgress(userId);
    let dominantChakra: ChakraTag | undefined;
    let maxPercentage = 0;
    
    chakraProgress.forEach(p => {
      if (p.percentage > maxPercentage) {
        maxPercentage = p.percentage;
        dominantChakra = p.chakra;
      }
    });
    
    // Simple mock recommendations based on chakra
    // In a real implementation, this would use more sophisticated logic
    const recommendations: CosmicRecommendation[] = [
      {
        type: 'journey',
        title: `${dominantChakra || 'Energy'} Activation Journey`,
        description: `Strengthen your ${dominantChakra || 'energetic'} alignment through this guided journey.`,
        chakraTag: dominantChakra,
        resonanceMatch: 85
      },
      {
        type: 'symbol',
        title: 'Metatron\'s Cube Meditation',
        description: 'Connect with your higher self through sacred geometry.',
        resonanceMatch: 78
      },
      {
        type: 'frequency',
        title: '528Hz Healing Frequency',
        description: 'Experience the transformational "miracle tone" of DNA repair.',
        resonanceMatch: 92
      },
      {
        type: 'practice',
        title: 'Kundalini Breathwork',
        description: 'Activate your spine's energy channel to awaken dormant cosmic potential.',
        resonanceMatch: 81
      }
    ];
    
    return recommendations.slice(0, limit);
  } catch (err) {
    console.error('Error getting cosmic recommendations:', err);
    return [];
  }
};
