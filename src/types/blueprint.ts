
export interface ChakraData {
  strength: number;
  color: string;
}

export interface ChakraSignature {
  [key: string]: ChakraData;
  root: ChakraData;
  sacral: ChakraData;
  solar: ChakraData;
  heart: ChakraData;
  throat: ChakraData;
  third_eye: ChakraData;
  crown: ChakraData;
}

export interface SacredBlueprint {
  user_id: string;
  created_at: string;
  core_frequency: string;
  frequency_value: number;
  elemental_resonance: string;
  energetic_archetype: string;
  emotional_profile: string;
  musical_key: string;
  blueprint_text: string;
  chakra_signature: ChakraSignature;
  shadow_frequencies: string[];
}

export interface BlueprintQuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'slider' | 'chakra_selection' | 'frequency_selection';
  options?: string[];
}

export interface QuizResponse {
  user_id: string;
  question_id: string;
  response: string;
  response_type: string;
}
