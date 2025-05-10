
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IntentionContextProps {
  intention: string;
  setIntention: (intention: string) => void;
}

const defaultContextValue: IntentionContextProps = {
  intention: '',
  setIntention: () => {},
};

export const IntentionContext = createContext<IntentionContextProps>(defaultContextValue);

export const useIntention = () => useContext(IntentionContext);

interface IntentionProviderProps {
  children: ReactNode;
}

export const IntentionProvider: React.FC<IntentionProviderProps> = ({ children }) => {
  const [intention, setIntention] = useState<string>('');

  return (
    <IntentionContext.Provider value={{ intention, setIntention }}>
      {children}
    </IntentionContext.Provider>
  );
};
