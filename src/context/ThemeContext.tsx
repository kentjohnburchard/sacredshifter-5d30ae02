
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { getRandomQuote } from "@/utils/customizationOptions";

interface ThemeContextType {
  currentGradient: string;
  currentElement: string;
  watermarkStyle: string;
  soundscapeMode: string;
  zodiacSign: string;
  kentMode: boolean;
  setKentMode: (mode: boolean) => void;
  currentQuote: string;
  refreshQuote: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentGradient: "linear-gradient(to right, #4facfe, #00f2fe)",
  currentElement: "water",
  watermarkStyle: "zodiac",
  soundscapeMode: "bubbles",
  zodiacSign: "cancer",
  kentMode: false,
  setKentMode: () => {},
  currentQuote: "Your vibe creates your reality.",
  refreshQuote: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { preferences, loading } = useUserPreferences();
  const [kentMode, setKentMode] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("Your vibe creates your reality.");

  // Refresh quote function
  const refreshQuote = () => {
    setCurrentQuote(getRandomQuote(kentMode));
  };

  // Apply theme to root element (for global CSS variables if needed)
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty('--theme-gradient', preferences.theme_gradient);
      document.documentElement.style.setProperty('--theme-element', preferences.element);
      document.documentElement.setAttribute('data-element', preferences.element);
    }
  }, [preferences, loading]);

  // Initialize quote based on kent mode
  useEffect(() => {
    refreshQuote();
  }, [kentMode]);

  return (
    <ThemeContext.Provider
      value={{
        currentGradient: preferences.theme_gradient,
        currentElement: preferences.element,
        watermarkStyle: preferences.watermark_style,
        soundscapeMode: preferences.soundscape_mode,
        zodiacSign: preferences.zodiac_sign,
        kentMode,
        setKentMode,
        currentQuote,
        refreshQuote
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
