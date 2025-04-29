
export type LightbearerLevel = {
  level_num: number;
  threshold: number;
  title: string;
  next_threshold: number | null;
};

export type LightbearerStats = {
  light_points: number;
  light_level: number;
  earned_badges: string[];
  last_level_up: string | null;
};

export type LevelUpEvent = {
  leveled_up: boolean;
  new_level: number;
  new_points: number;
  points_added: number;
};
