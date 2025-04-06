
import { SacredBlueprint, ChakraData, ElementMap, MusicalKeyData } from "@/types/blueprint";
import { supabase } from "@/integrations/supabase/client";

// Frequency archetypes with their meanings
export const frequencyArchetypes = {
  "396Hz": {
    name: "The Liberator",
    description: "Releases fear and guilt, connecting you to the grounding energies of security and presence.",
    frequency: 396
  },
  "417Hz": {
    name: "The Transmuter",
    description: "Facilitates change, clearing traumatic experiences and undoing situations that are no longer in your highest good.",
    frequency: 417
  },
  "432Hz": {
    name: "The Harmonizer",
    description: "Connects you with the universal heartbeat, aligning you with the natural frequency of the universe.",
    frequency: 432
  },
  "528Hz": {
    name: "The Miracle Tone",
    description: "Associated with DNA repair, transformation and miracles. The frequency of love and healing.",
    frequency: 528
  },
  "639Hz": {
    name: "The Connector",
    description: "Connects you to love, enhances relationships, and creates harmony within communities.",
    frequency: 639
  },
  "741Hz": {
    name: "The Awakener",
    description: "Awakens intuition and expands consciousness, helping solve problems and express yourself creatively.",
    frequency: 741
  },
  "852Hz": {
    name: "The Illuminator",
    description: "Returns spiritual order, awakening intuition and raises energy to connect with the spiritual realm.",
    frequency: 852
  },
  "963Hz": {
    name: "The Transcender",
    description: "Connects with the perfect state, the crown chakra, and the light of universal consciousness.",
    frequency: 963
  }
};

// Chakra colors
export const chakraColors = {
  root: "#FF0000",
  sacral: "#FF7F00",
  solar: "#FFFF00",
  heart: "#00FF00",
  throat: "#00FFFF",
  third_eye: "#0000FF",
  crown: "#8B00FF"
};

// Element associations
export const elementAssociations: Record<ElementMap, any> = {
  earth: {
    color: "#4CAF50",
    traits: ["grounded", "stable", "nurturing", "abundant"],
    chakras: ["root", "sacral"],
    frequencies: ["396Hz", "417Hz"]
  },
  water: {
    color: "#2196F3",
    traits: ["flowing", "intuitive", "emotional", "healing"],
    chakras: ["sacral", "heart"],
    frequencies: ["528Hz", "639Hz"]
  },
  fire: {
    color: "#FF5722",
    traits: ["passionate", "transformative", "energetic", "creative"],
    chakras: ["solar", "throat"],
    frequencies: ["417Hz", "741Hz"]
  },
  air: {
    color: "#CDDC39",
    traits: ["intellectual", "communicative", "expansive", "social"],
    chakras: ["throat", "third_eye"],
    frequencies: ["741Hz", "852Hz"]
  }
};

// Musical keys with meanings
export const musicalKeys: Record<string, MusicalKeyData> = {
  "C Major": {
    key: "C Major",
    mood: "Pure, innocent, simple",
    description: "The key of children, faith, and divine simplicity."
  },
  "C Minor": {
    key: "C Minor",
    mood: "Declaration of love and lamenting",
    description: "A key for expressing unrequited love and deep yearning."
  },
  "G Major": {
    key: "G Major",
    mood: "Serious, magnificent, fantasy",
    description: "The key of sincere faith, quiet contemplation, and rustic idylls."
  },
  "D Major": {
    key: "D Major",
    mood: "Triumphant, victorious, joyful",
    description: "The key of victory, war-cries, and jubilation."
  },
  "A Major": {
    key: "A Major",
    mood: "Clear, sonorous, radiant",
    description: "The key of confident declarations, innocent love, and youthful cheerfulness."
  },
  "E Major": {
    key: "E Major",
    mood: "Sparkling, bright, joyful",
    description: "The key of heavenly, resonant joy and laughter."
  },
  "F Major": {
    key: "F Major",
    mood: "Peaceful, complaisance, calm",
    description: "The key of peace, joy, light, and relief after storm."
  }
};

// Function to generate a blueprint based on data points
export const generateBlueprint = async (
  userId: string,
  quizResponses: any[],
  astroData?: any
): Promise<SacredBlueprint> => {
  // Process quiz data to build out components
  
  // 1. Determine Core Frequency
  const frequencyResponses = quizResponses.filter(r => 
    r.question_id === 'preferred_frequency' || r.question_id === 'resonant_tone');
  
  // Default to 528Hz (heart frequency) if no clear preference
  let coreFrequency = "528Hz";
  let frequencyValue = 528;
  
  if (frequencyResponses.length > 0) {
    coreFrequency = frequencyResponses[0].response;
    frequencyValue = parseInt(coreFrequency.replace("Hz", ""));
  }
  
  // 2. Determine Elemental Resonance
  const elementResponses = quizResponses.filter(r => 
    r.question_id === 'element_affinity' || r.response_type === 'element');
  
  // Default to water if no clear preference
  let elementalResonance: ElementMap = "water";
  
  if (elementResponses.length > 0) {
    elementalResonance = elementResponses[0].response as ElementMap;
  } else if (astroData?.dominant_element) {
    elementalResonance = astroData.dominant_element.toLowerCase() as ElementMap;
  }

  // 3. Generate Chakra Signature
  const chakraResponses = quizResponses.filter(r => 
    r.response_type === 'chakra' || r.question_id.includes('chakra'));
  
  // Start with balanced chakras
  const chakraSignature: Record<string, ChakraData> = {
    root: {
      name: "Root Chakra",
      strength: 50,
      color: chakraColors.root
    },
    sacral: {
      name: "Sacral Chakra",
      strength: 50,
      color: chakraColors.sacral
    },
    solar: {
      name: "Solar Plexus Chakra",
      strength: 50,
      color: chakraColors.solar
    },
    heart: {
      name: "Heart Chakra",
      strength: 50,
      color: chakraColors.heart
    },
    throat: {
      name: "Throat Chakra",
      strength: 50,
      color: chakraColors.throat
    },
    third_eye: {
      name: "Third Eye Chakra",
      strength: 50,
      color: chakraColors.third_eye
    },
    crown: {
      name: "Crown Chakra",
      strength: 50,
      color: chakraColors.crown
    }
  };
  
  // Adjust based on responses
  chakraResponses.forEach(response => {
    const chakra = response.response.toLowerCase();
    if (chakraSignature[chakra]) {
      chakraSignature[chakra].strength += 15;
    }
  });
  
  // Normalize strengths to ensure they're between 30-100
  Object.keys(chakraSignature).forEach(key => {
    chakraSignature[key].strength = Math.min(100, Math.max(30, chakraSignature[key].strength));
  });
  
  // 4. Determine Emotional Profile
  const emotionalResponses = quizResponses.filter(r => 
    r.response_type === 'emotion' || r.question_id === 'emotional_tendency');
  
  let emotionalProfiles = [
    "The Reflector", "The Spark", "The Resonator", "The Alchemist", 
    "The Dreamer", "The Sentinel", "The Flow", "The Oracle"
  ];
  
  // Default
  let emotionalProfile = "The Resonator";
  
  if (emotionalResponses.length > 0) {
    const response = emotionalResponses[0].response.toLowerCase();
    // Logic to map response to profile
    if (response.includes("peaceful") || response.includes("calm")) {
      emotionalProfile = "The Reflector";
    } else if (response.includes("joy") || response.includes("excitement")) {
      emotionalProfile = "The Spark";
    } else if (response.includes("empath") || response.includes("connection")) {
      emotionalProfile = "The Resonator";
    } else if (response.includes("transform") || response.includes("change")) {
      emotionalProfile = "The Alchemist";
    }
  }
  
  // 5. Determine Energetic Archetype
  const archetypes = [
    "The Lightweaver", "The Channel", "The Guardian of Vibe", 
    "The Frequency Keeper", "The Soul Harmonizer", "The Cosmic Tuner"
  ];
  
  // Base archetype on core frequency
  let energeticArchetype = "The Soul Harmonizer";
  if (frequencyValue < 500) {
    energeticArchetype = "The Guardian of Vibe";
  } else if (frequencyValue < 700) {
    energeticArchetype = "The Lightweaver";
  } else {
    energeticArchetype = "The Channel";
  }
  
  // 6. Determine Musical Key Alignment
  const musicResponses = quizResponses.filter(r => 
    r.response_type === 'music' || r.question_id === 'musical_preference');
  
  const keys = Object.keys(musicalKeys);
  // Default
  let musicalKey = "D Major";
  
  if (musicResponses.length > 0) {
    const response = musicResponses[0].response.toLowerCase();
    // Match response to key
    if (response.includes("calm") || response.includes("peaceful")) {
      musicalKey = "F Major";
    } else if (response.includes("joy") || response.includes("bright")) {
      musicalKey = "E Major";
    } else if (response.includes("serious") || response.includes("deep")) {
      musicalKey = "G Major";
    } else if (response.includes("triumph") || response.includes("victory")) {
      musicalKey = "D Major";
    }
  }
  
  // 7. Determine Shadow Frequencies
  // These are typically frequencies that are furthest from the core frequency
  const allFrequencies = Object.keys(frequencyArchetypes);
  const shadowFrequencies = allFrequencies
    .filter(freq => {
      const freqValue = parseInt(freq.replace("Hz", ""));
      return Math.abs(freqValue - frequencyValue) > 200;
    })
    .slice(0, 2);
  
  // 8. Generate Blueprint Text
  const blueprintText = generateBlueprintText(
    coreFrequency,
    elementalResonance,
    chakraSignature,
    emotionalProfile,
    energeticArchetype,
    musicalKey,
    shadowFrequencies
  );
  
  // Return the compiled blueprint
  return {
    user_id: userId,
    core_frequency: coreFrequency,
    frequency_value: frequencyValue,
    elemental_resonance: elementalResonance,
    chakra_signature: chakraSignature,
    emotional_profile: emotionalProfile,
    energetic_archetype: energeticArchetype,
    musical_key: musicalKey,
    shadow_frequencies: shadowFrequencies,
    blueprint_text: blueprintText,
    version: 1,
    name: "Sacred Blueprint"
  };
};

// Generate poetic blueprint text
export const generateBlueprintText = (
  coreFrequency: string,
  elementalResonance: string,
  chakraSignature: Record<string, ChakraData>,
  emotionalProfile: string,
  energeticArchetype: string,
  musicalKey: string,
  shadowFrequencies: string[]
): string => {
  // Find strongest and weakest chakras
  let strongestChakra = "heart";
  let weakestChakra = "root";
  let highestValue = 0;
  let lowestValue = 100;
  
  Object.entries(chakraSignature).forEach(([chakra, data]) => {
    if (data.strength > highestValue) {
      highestValue = data.strength;
      strongestChakra = chakra;
    }
    if (data.strength < lowestValue) {
      lowestValue = data.strength;
      weakestChakra = chakra;
    }
  });
  
  const chakraNames: Record<string, string> = {
    root: "Root",
    sacral: "Sacral",
    solar: "Solar Plexus",
    heart: "Heart",
    throat: "Throat",
    third_eye: "Third Eye",
    crown: "Crown"
  };

  const freqArchetype = frequencyArchetypes[coreFrequency]?.name || "The Harmonizer";
  const elementTraits = elementAssociations[elementalResonance as ElementMap]?.traits || ["balanced", "resonant"];
  
  // Create poetic text
  return `You are ${emotionalProfile}—one who vibrates with ${elementTraits[0]}, ${elementTraits[1]}, and harmonic intent. Your Core Frequency is ${coreFrequency}: the vibration of ${frequencyArchetypes[coreFrequency]?.description || "divine connection"}. 
  
Your energy flows through ${elementalResonance.charAt(0).toUpperCase() + elementalResonance.slice(1)}, with ${chakraNames[strongestChakra]} and ${chakraNames[weakestChakra]} chakras leading your alignment. Your song is in ${musicalKey}, ${musicalKeys[musicalKey]?.mood.toLowerCase() || "reflective and brave"}. 

As ${energeticArchetype}, you are here to connect, soothe, and remember. Even your shadow frequencies (${shadowFrequencies.join(", ")}) call for healing—they're where your next resonance waits. Your journey is to harmonize all aspects of your frequency while amplifying your unique spiritual signature.

Remember: This is your now—not your forever. You are the artist of your frequency.`;
};

// Save blueprint to Supabase
export const saveBlueprint = async (blueprint: SacredBlueprint): Promise<{ data: any, error: any }> => {
  const { data, error } = await supabase
    .from('sacred_blueprints')
    .insert(blueprint)
    .select('id');
  
  return { data, error };
};

// Fetch user's blueprint from Supabase
export const fetchUserBlueprint = async (userId: string): Promise<{ data: SacredBlueprint | null, error: any }> => {
  const { data, error } = await supabase
    .from('sacred_blueprints')
    .select('*')
    .eq('user_id', userId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  return { data, error };
};

// Save quiz response to Supabase
export const saveQuizResponse = async (response: any): Promise<{ data: any, error: any }> => {
  const { data, error } = await supabase
    .from('sacred_blueprint_quiz_responses')
    .insert([response]);
  
  return { data, error };
};

// Get user's quiz responses
export const getUserQuizResponses = async (userId: string): Promise<{ data: any[], error: any }> => {
  const { data, error } = await supabase
    .from('sacred_blueprint_quiz_responses')
    .select('*')
    .eq('user_id', userId);
  
  return { data: data || [], error };
};

// Get user's astrological data if available
export const getUserAstroData = async (userId: string): Promise<{ data: any, error: any }> => {
  const { data, error } = await supabase
    .from('user_astrology_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  return { data, error };
};
