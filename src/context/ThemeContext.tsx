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

  // Debug log for initial mount
  useEffect(() => {
    console.log("ThemeProvider mounted, initial state:", liftTheVeil);
  }, []);

  // Simplified theme toggling with more robust state management
  const setLiftTheVeil = useCallback((mode: boolean) => {
    console.log("ThemeContext: Setting consciousness mode to:", mode);
    
    // Update local state
    setLiftTheVeilState(mode);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('liftTheVeil', String(mode));
      console.log("Theme state saved to localStorage:", mode);
      
      // Show appropriate toast based on new state
      toast.success(
        mode ? "Veil Lifted! Consciousness expanded" : "Returning to standard consciousness",
        {
          icon: <Sparkles className={mode ? "text-pink-500" : "text-indigo-500"} />,
          duration: 3000,
          position: "top-center"
        }
      );
    } catch (e) {
      console.error("Could not save theme state to localStorage:", e);
    }
    
    // Change theme based on consciousness mode
    if (mode) {
      setCurrentTheme("linear-gradient(to right, #FF36AB, #B967FF)");
      document.documentElement.classList.add('veil-lifted');
    } else {
      setCurrentTheme("linear-gradient(to right, #4facfe, #00f2fe)");
      document.documentElement.classList.remove('veil-lifted');
    }
    
    // Dispatch theme change event
    const event = new CustomEvent('themeChanged', { detail: { liftTheVeil: mode } });
    window.dispatchEvent(event);
  }, []);

  // For backward compatibility, alias kentMode to liftTheVeil
  const kentMode = liftTheVeil;
  const setKentMode = setLiftTheVeil;

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('liftTheVeil');
      if (savedMode !== null) {
        const parsedMode = savedMode === 'true';
        console.log("Initializing theme from localStorage:", parsedMode);
        setLiftTheVeil(parsedMode);
      }
    } catch (e) {
      console.error("Error reading theme from localStorage:", e);
    }
  }, [setLiftTheVeil]);

  // Add global CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement;
    if (liftTheVeil) {
      // Set pink theme variables
      root.style.setProperty('--primary-accent', '#FF36AB');
      root.style.setProperty('--secondary-accent', '#B967FF');
      root.style.setProperty('--text-accent', '#FF70E9');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #FF36AB, #B967FF)');
      root.style.setProperty('--theme-primary', '#FF36AB');
      root.style.setProperty('--theme-secondary', '#B967FF');
      
      root.setAttribute('data-theme', 'veil-lifted');
      console.log("Theme set to pink mode (veil-lifted)");
    } else {
      // Set purple theme variables
      root.style.setProperty('--primary-accent', '#8B5CF6');
      root.style.setProperty('--secondary-accent', '#6366F1');
      root.style.setProperty('--text-accent', '#A78BFA');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #4facfe, #00f2fe)');
      root.style.setProperty('--theme-primary', '#4facfe');
      root.style.setProperty('--theme-secondary', '#00f2fe');
      
      root.setAttribute('data-theme', 'standard');
      console.log("Theme set to purple mode (standard)");
    }
    
    console.log("Theme context updated, liftTheVeil:", liftTheVeil);
    
    // Dispatch a custom event that can be listened to by other components
    const event = new CustomEvent('themeChanged', { detail: { liftTheVeil } });
    window.dispatchEvent(event);
  }, [liftTheVeil]);

  return (
    <ThemeContext.Provider value={{ 
      liftTheVeil, 
      setLiftTheVeil, 
      kentMode, 
      setKentMode,
      currentQuote, 
      refreshQuote: getRandomQuote,
      currentTheme,
      currentElement,
      currentWatermarkStyle
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
