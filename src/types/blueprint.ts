
export interface ChakraData {
  name: string;
  strength: number; // 0-100
  color: string;
  affirmation?: string;
}

export interface SacredBlueprint {
  id?: string;
  user_id?: string;
  core_frequency: string;
  frequency_value: number;
  elemental_resonance: string;
  chakra_signature: {
    root: ChakraData;
    sacral: ChakraData;
    solar: ChakraData;
    heart: ChakraData;
    throat: ChakraData;
    third_eye: ChakraData;
    crown: ChakraData;
    [key: string]: ChakraData;
  };
  emotional_profile: string;
  energetic_archetype: string;
  musical_key: string;
  shadow_frequencies: string[];
  blueprint_text: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
}

export interface QuizResponse {
  id?: string;
  user_id?: string;
  question_id: string;
  response: string;
  response_type: string;
  created_at?: string;
}

export interface BlueprintQuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'slider' | 'frequency_selection' | 'color_picker' | 'chakra_selection';
  options?: string[];
  min?: number;
  max?: number;
}

export type FrequencyArchetypeMap = {
  [key: string]: {
    name: string;
    description: string;
    frequency: number;
  }
};

export type ElementMap = 'earth' | 'air' | 'fire' | 'water';

export type MusicalKeyData = {
  key: string;
  mood: string;
  description: string;
}
