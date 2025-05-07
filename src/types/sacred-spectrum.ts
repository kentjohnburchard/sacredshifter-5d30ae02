
export interface SacredSpectrumResource {
  id: string;
  title: string;
  category?: string;
  tags?: string;
  description?: string;
  external_link?: string;
  file_url?: string;
  journey_slug?: string;
  user_id?: string;
  needs_moderation?: boolean;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const resourceCategories = [
  "Sacred Geometry",
  "Sound Healing",
  "Frequency",
  "Meditation",
  "Herbal",
  "Astral",
  "Chakra",
  "Consciousness",
  "Quantum",
  "Energy Work"
];
