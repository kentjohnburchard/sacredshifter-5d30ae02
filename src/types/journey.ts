
export interface JourneySong {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  duration?: number;
  chakra?: string;
  frequency?: number;
  description?: string;
  order?: number;
  groupId?: string;
  imageUrl?: string;
}

export interface JourneyTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  chakra?: string;
  frequency?: number;
  imageUrl?: string;
  tags?: string[];
  effects?: string[];
  createdAt?: string;
  updatedAt?: string;
}
