
export interface SongMapping {
  id: string;
  title: string;
  artist?: string;
  audioUrl?: string;
  duration?: number;
  chakra?: string;
  frequency?: number;
  category?: string; // Add category property
}

export interface AppFunctionality {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}
