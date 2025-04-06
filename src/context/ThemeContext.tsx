
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type ThemeContextType = {
  kentMode: boolean;
  setKentMode: (mode: boolean) => void;
  currentQuote: string;
  refreshQuote: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  kentMode: false,
  setKentMode: () => {},
  currentQuote: "",
  refreshQuote: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const { randomQuote, refreshRandomQuote, getRandomQuote } = useLoveQuotes();
  const [currentQuote, setCurrentQuote] = useState("");
  const [kentMode, setKentModeState] = useState(false);

  // Initialize kent mode from preferences
  useEffect(() => {
    if (preferences) {
      const consciousnessMode = preferences.consciousness_mode || "standard";
      setKentModeState(consciousnessMode === "kent");
    }
  }, [preferences]);

  const setKentMode = async (mode: boolean) => {
    try {
      // Update local state immediately for responsive UI
      setKentModeState(mode);
      
      // Then update in database
      await saveUserPreferences({
        ...preferences,
        consciousness_mode: mode ? "kent" : "standard"
      });
    } catch (error) {
      console.error("Error toggling Kent Mode:", error);
      // Revert state if save failed
      setKentModeState(!mode);
    }
  };

  // Update current quote when randomQuote changes
  useEffect(() => {
    if (randomQuote) {
      setCurrentQuote(randomQuote.text);
    }
  }, [randomQuote]);

  // Refresh the quote
  const refreshQuote = useCallback(() => {
    const quote = getRandomQuote();
    if (quote) {
      setCurrentQuote(quote.text);
    } else {
      refreshRandomQuote();
    }
  }, [getRandomQuote, refreshRandomQuote]);

  return (
    <ThemeContext.Provider value={{ kentMode, setKentMode, currentQuote, refreshQuote }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
