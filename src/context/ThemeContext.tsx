
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { UserPreferences } from "@/hooks/useUserPreferences";

type ThemeContextType = {
  liftTheVeil: boolean;
  setLiftTheVeil: (mode: boolean) => void;
  kentMode: boolean; // Keep for backward compatibility
  setKentMode: (mode: boolean) => void; // Keep for backward compatibility
  currentQuote: string;
  refreshQuote: () => void;
  currentTheme: string;
  currentElement: string;
  currentWatermarkStyle: string;
};

const ThemeContext = createContext<ThemeContextType>({
  liftTheVeil: false,
  setLiftTheVeil: () => {},
  kentMode: false,
  setKentMode: () => {},
  currentQuote: "",
  refreshQuote: () => {},
  currentTheme: "linear-gradient(to right, #4facfe, #00f2fe)",
  currentElement: "water",
  currentWatermarkStyle: "zodiac",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const { randomQuote, refreshRandomQuote, getRandomQuote } = useLoveQuotes();
  const [currentQuote, setCurrentQuote] = useState("");
  const [liftTheVeil, setLiftTheVeilState] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("linear-gradient(to right, #4facfe, #00f2fe)");
  const [currentElement, setCurrentElement] = useState("water");
  const [currentWatermarkStyle, setCurrentWatermarkStyle] = useState("zodiac");

  // Initialize from preferences
  useEffect(() => {
    if (preferences) {
      // Set consciousness mode
      const consciousnessMode = preferences.consciousness_mode || "standard";
      setLiftTheVeilState(consciousnessMode === "lift-the-veil");
      
      // Set theme and element preferences
      if (preferences.theme_gradient) {
        setCurrentTheme(preferences.theme_gradient);
      }
      
      if (preferences.element) {
        setCurrentElement(preferences.element);
      }
      
      if (preferences.watermark_style) {
        setCurrentWatermarkStyle(preferences.watermark_style);
      }
    }
  }, [preferences]);

  // Set lift the veil mode
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

  // For backward compatibility, alias kentMode to liftTheVeil
  const kentMode = liftTheVeil;
  const setKentMode = setLiftTheVeil;

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
    <ThemeContext.Provider value={{ 
      liftTheVeil, 
      setLiftTheVeil, 
      kentMode, 
      setKentMode,
      currentQuote, 
      refreshQuote,
      currentTheme,
      currentElement,
      currentWatermarkStyle
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
