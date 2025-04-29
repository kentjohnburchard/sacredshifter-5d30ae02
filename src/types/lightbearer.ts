
// Add this file if it doesn't exist or update it if it does

export interface LightbearerLevel {
  level_num: number;
  threshold: number;
  next_threshold: number | null;
  title: string | null;
}

export interface LightbearerStats {
  light_points: number;
  light_level: number;
  earned_badges: string[];
  last_level_up: string | null;
  // New soul progression fields
  lightbearer_level: number;
  badges: string[];
  // Additional fields for expanded functionality
  ascension_title?: string;
  soul_alignment?: 'Light' | 'Shadow' | 'Unity';
  frequency_signature?: string;
}

export interface LevelUpEvent {
  user_id: string;
  new_points: number;
  new_level: number;
  leveled_up: boolean;
  points_added: number;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}
