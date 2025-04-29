
export interface ValeMessage {
  id: string;
  content: string;
  sender: 'user' | 'vale';
  timestamp: string;
  readStatus?: boolean;
}

export interface ValeConversation {
  id: string;
  userId: string;
  messages: ValeMessage[];
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValeResponse {
  message: string;
  suggestions?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'meditation' | 'article' | 'journey' | 'frequency';
  }[];
}

export interface ValeContext {
  mood?: string;
  intention?: string;
  energyLevel?: number;
  recentActivities?: string[];
  soulAlignment?: 'Light' | 'Shadow' | 'Unity';
  frequencySignature?: string;
  lightbearerLevel?: number;
  ascensionTitle?: string;
}
