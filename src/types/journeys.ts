
export interface JourneyMetadata {
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  tags?: string[];
  requiresVeil?: boolean;
  date?: string;
  author?: string;
  coverImage?: string;
  readingTime?: string;
  featured?: boolean;
}
