
export interface MeditationType {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  frequency: number;
  duration: number;
  level: string;
  focus: string;
  audioUrl: string;
  guidanceUrl: string | null;
  chakra: string;
  colorGradient: string;
}
