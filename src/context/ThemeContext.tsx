
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

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
      } else {
        // Set default theme based on consciousness mode
        setCurrentTheme(consciousnessMode === "lift-the-veil" 
          ? "linear-gradient(to right, #FF36AB, #B967FF)" 
          : "linear-gradient(to right, #4facfe, #00f2fe)");
      }
      
      if (preferences.element) {
        setCurrentElement(preferences.element);
      }
      
      if (preferences.watermark_style) {
        setCurrentWatermarkStyle(preferences.watermark_style);
      }
    }
  }, [preferences]);

  // Set lift the veil mode with visual feedback
  const setLiftTheVeil = useCallback(async (mode: boolean) => {
    try {
      // Update local state immediately for responsive UI
      setLiftTheVeilState(mode);
      
      // Change theme based on consciousness mode
      if (mode) {
        // Pink-focused theme for lifted veil
        setCurrentTheme("linear-gradient(to right, #FF36AB, #B967FF)");
        document.documentElement.classList.add('veil-lifted');
      } else {
        // Purple-focused theme for standard mode
        setCurrentTheme("linear-gradient(to right, #4facfe, #00f2fe)");
        document.documentElement.classList.remove('veil-lifted');
      }
      
      // Show toast notification to confirm the change
      toast.success(
        mode ? "Veil Lifted! Welcome to heightened perception." : "Returning to standard consciousness",
        {
          icon: <Sparkles className={mode ? "text-pink-500" : "text-purple-500"} />,
          duration: 3000
        }
      );
      
      // Update user preferences if they're logged in
      if (preferences) {
        await saveUserPreferences({
          ...preferences,
          consciousness_mode: mode ? "lift-the-veil" : "standard"
        });
      }
    } catch (error) {
      console.error("Error toggling Lift the Veil Mode:", error);
      // Revert state if save failed
      setLiftTheVeilState(!mode);
      toast.error("Failed to change consciousness mode");
    }
  }, [preferences, saveUserPreferences]);

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

  // Add global CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement;
    if (liftTheVeil) {
      root.style.setProperty('--primary-accent', '#FF36AB');
      root.style.setProperty('--secondary-accent', '#B967FF');
      root.style.setProperty('--text-accent', '#FF70E9');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #FF36AB, #B967FF)');
      root.style.setProperty('--theme-primary', '#FF36AB');
      root.style.setProperty('--theme-secondary', '#B967FF');
    } else {
      root.style.setProperty('--primary-accent', '#8B5CF6');
      root.style.setProperty('--secondary-accent', '#6366F1');
      root.style.setProperty('--text-accent', '#A78BFA');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #4facfe, #00f2fe)');
      root.style.setProperty('--theme-primary', '#4facfe');
      root.style.setProperty('--theme-secondary', '#00f2fe');
    }
  }, [liftTheVeil]);

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
