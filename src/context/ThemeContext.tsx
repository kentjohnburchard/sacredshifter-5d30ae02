
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type ThemeContextType = {
  liftTheVeil: boolean;
  setLiftTheVeil: (mode: boolean) => void;
  currentQuote: string;
  refreshQuote: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  liftTheVeil: false,
  setLiftTheVeil: () => {},
  currentQuote: "",
  refreshQuote: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const { randomQuote, refreshRandomQuote, getRandomQuote } = useLoveQuotes();
  const [currentQuote, setCurrentQuote] = useState("");
  const [liftTheVeil, setLiftTheVeilState] = useState(false);

  // Initialize lift the veil mode from preferences
  useEffect(() => {
    if (preferences) {
      const consciousnessMode = preferences.consciousness_mode || "standard";
      setLiftTheVeilState(consciousnessMode === "lift-the-veil");
    }
  }, [preferences]);

  const setLiftTheVeil = async (mode: boolean) => {
    try {
      // Update local state immediately for responsive UI
      setLiftTheVeilState(mode);
      
      // Then update in database
      await saveUserPreferences({
        ...preferences,
        consciousness_mode: mode ? "lift-the-veil" : "standard"
      });
    } catch (error) {
      console.error("Error toggling Lift the Veil Mode:", error);
      // Revert state if save failed
      setLiftTheVeilState(!mode);
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
    <ThemeContext.Provider value={{ liftTheVeil, setLiftTheVeil, currentQuote, refreshQuote }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
