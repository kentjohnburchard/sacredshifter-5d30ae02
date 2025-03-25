
export type PromptOption = {
  text: string;
  tag: string;
  frequency?: number;
  chakra?: string;
  visualType?: string;
};

export type PromptStep = {
  title: string;
  text: string;
  options: PromptOption[];
};

export type IntentionSuggestion = {
  text: string;
};

export type VisualOverlayOption = {
  text: string;
  tag: string;
  color: string;
  description: string;
};

export type JournalTag = {
  text: string;
  value: string;
};

export type TimelineEntry = {
  title: string;
  tag?: string;
  notes?: string;
  frequency?: number;
  chakra?: string;
  visualType?: string;
  timestamp: Date;
};
