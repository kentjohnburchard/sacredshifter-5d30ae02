
import { useState, useEffect } from 'react';
import { ChakraTag, CHAKRA_FREQUENCIES } from '@/types/chakras';

export interface OptimizationResult {
  nextSuggestedJourney: string;
  underusedChakra: ChakraTag | null;
  dominantArchetype: string;
  frequencySuggestion: number;
  lightbearerLevel: number;
}

const dummyJourneyData = [
  { slug: 'root-awakening', chakra: 'Root', archetype: 'Warrior', completed: true },
  { slug: 'heart-opening', chakra: 'Heart', archetype: 'Lover', completed: true },
  { slug: 'third-eye-activation', chakra: 'Third Eye', archetype: 'Sage', completed: false },
  { slug: 'chakra-column-alignment', chakra: 'Root', archetype: 'Magician', completed: false },
  { slug: 'solar-activation', chakra: 'Solar Plexus', archetype: 'Ruler', completed: true },
];

const dummyChakraActivations = {
  'Root': 2,
  'Sacral': 1,
  'Solar Plexus': 3,
  'Heart': 5,
  'Throat': 2,
  'Third Eye': 1,
  'Crown': 0,
};

export const useRealityOptimizer = (userId?: string) => {
  const [results, setResults] = useState<OptimizationResult>({
    nextSuggestedJourney: '',
    underusedChakra: null,
    dominantArchetype: '',
    frequencySuggestion: 0,
    lightbearerLevel: 0
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from Supabase or context
    // For now, we'll use dummy data
    analyzeUserData();
  }, [userId]);

  const analyzeUserData = () => {
    // This would normally fetch from a service or context
    const journeyData = dummyJourneyData;
    const chakraActivations = dummyChakraActivations;
    
    const completedJourneys = journeyData.filter(journey => journey.completed);
    
    // Find underused chakra
    const underusedChakra = findUnderUsedChakra(chakraActivations);
    
    // Find dominant archetype
    const dominantArchetype = getDominantArchetype(completedJourneys);
    
    // Get suggested journey
    const nextSuggestedJourney = getSuggestedJourney(journeyData, underusedChakra);
    
    // Get frequency for the underused chakra
    const frequencySuggestion = getFrequencyForChakra(underusedChakra);
    
    // Calculate lightbearer level (simple algorithm)
    const lightbearerLevel = Math.max(1, Math.floor(completedJourneys.length / 2));
    
    setResults({
      nextSuggestedJourney,
      underusedChakra,
      dominantArchetype,
      frequencySuggestion,
      lightbearerLevel
    });
  };

  const findUnderUsedChakra = (chakraActivations: Record<string, number>): ChakraTag | null => {
    // Find the chakra with the lowest activation count
    let minActivations = Infinity;
    let underusedChakra: ChakraTag | null = null;
    
    Object.entries(chakraActivations).forEach(([chakra, count]) => {
      if (count < minActivations) {
        minActivations = count;
        underusedChakra = chakra as ChakraTag;
      }
    });
    
    return underusedChakra;
  };

  const getDominantArchetype = (completedJourneys: any[]) => {
    // Count occurrences of each archetype
    const archetypeCounts: Record<string, number> = {};
    
    completedJourneys.forEach(journey => {
      if (journey.archetype) {
        archetypeCounts[journey.archetype] = (archetypeCounts[journey.archetype] || 0) + 1;
      }
    });
    
    // Find the most frequent archetype
    let maxCount = 0;
    let dominantArchetype = 'Alchemist'; // Default
    
    Object.entries(archetypeCounts).forEach(([archetype, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantArchetype = archetype;
      }
    });
    
    return dominantArchetype;
  };

  const getSuggestedJourney = (journeyData: any[], underusedChakra: ChakraTag | null): string => {
    // Find first non-completed journey for the underused chakra
    const suggestedJourney = journeyData.find(
      journey => !journey.completed && journey.chakra === underusedChakra
    );
    
    // Return the slug formatted as a title, or a default
    if (suggestedJourney) {
      return suggestedJourney.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // If no matching journey, just return the first non-completed journey
    const anyNonCompleted = journeyData.find(journey => !journey.completed);
    
    if (anyNonCompleted) {
      return anyNonCompleted.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Chakra Column Alignment'; // Default fallback
  };

  const getFrequencyForChakra = (chakra: ChakraTag | null): number => {
    if (!chakra || !CHAKRA_FREQUENCIES[chakra]) {
      return 396; // Default to Root chakra frequency
    }
    return CHAKRA_FREQUENCIES[chakra];
  };

  return {
    ...results,
    getOptimizationResults: () => results
  };
};
