
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface ThemeContextType {
  currentGradient: string;
  currentElement: string;
  watermarkStyle: string;
  soundscapeMode: string;
  zodiacSign: string;
}

const ThemeContext = createContext<ThemeContextType>({
  currentGradient: "linear-gradient(to right, #4facfe, #00f2fe)",
  currentElement: "water",
  watermarkStyle: "zodiac",
  soundscapeMode: "bubbles",
  zodiacSign: "cancer"
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { preferences, loading } = useUserPreferences();

  // Apply theme to root element (for global CSS variables if needed)
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty('--theme-gradient', preferences.theme_gradient);
      document.documentElement.style.setProperty('--theme-element', preferences.element);
      document.documentElement.setAttribute('data-element', preferences.element);
    }
  }, [preferences, loading]);

  return (
    <ThemeContext.Provider
      value={{
        currentGradient: preferences.theme_gradient,
        currentElement: preferences.element,
        watermarkStyle: preferences.watermark_style,
        soundscapeMode: preferences.soundscape_mode,
        zodiacSign: preferences.zodiac_sign
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
