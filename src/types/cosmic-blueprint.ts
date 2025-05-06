
import { ChakraData, ChakraSignature, SacredBlueprint } from '@/types/blueprint';
import { ChakraTag } from '@/types/chakras';

export type DNAStrandStatus = boolean[];

export type StarseedResonanceType = 
  | 'Pleiadian' 
  | 'Sirian' 
  | 'Lyran'
  | 'Arcturian'
  | 'Andromedan'
  | 'Orion'
  | 'Venusian'
  | 'Lemurian'
  | 'Atlantean'
  | 'Crystalline';

export interface CosmicBlueprint {
  id: string;
  user_id: string;
  sacred_blueprint_id?: string;
  dna_strand_status: DNAStrandStatus;
  starseed_resonance: StarseedResonanceType[];
  energetic_alignment_score: number;
  personal_code_pattern: string;
  created_at: string;
  last_updated_at: string;
  
  // Virtual fields (not stored in DB)
  sacred_blueprint?: SacredBlueprint;
  dominant_chakra?: ChakraTag;
  resonant_signature?: string;
}

export interface DNAVisualizationParams {
  rotation: number;
  zoom: number;
  activationLevel: number;
  highlightedStrands: number[];
  chakraOverlay: boolean;
  lightbearerOverlay: boolean;
  journeyPatternOverlay: boolean;
}

export interface EnergicAlignmentMetrics {
  chakraBalance: number;
  timelineEngagement: number;
  lightbearerProgress: number;
  reflectionConsistency: number;
  overallScore: number;
}

export interface CosmicRecommendation {
  type: 'journey' | 'symbol' | 'frequency' | 'practice';
  title: string;
  description: string;
  chakraTag?: ChakraTag;
  resonanceMatch: number;
  imageUrl?: string;
  actionUrl?: string;
}
