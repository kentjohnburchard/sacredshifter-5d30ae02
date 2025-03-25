
export type PromptOption = {
  text: string;
  tag: string;
  frequency?: number;
  chakra?: string;
};

export type PromptStep = {
  title: string;
  text: string;
  options: PromptOption[];
};

export type IntentionSuggestion = {
  text: string;
};
