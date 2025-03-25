
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
