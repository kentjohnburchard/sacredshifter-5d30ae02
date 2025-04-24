
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

  // Simplified theme toggling with more robust state management
  const setLiftTheVeil = useCallback((mode: boolean) => {
    console.log("Toggling Lift the Veil mode to:", mode);
    
    // Update local state
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
  }, []);

  // For backward compatibility, alias kentMode to liftTheVeil
  const kentMode = liftTheVeil;
  const setKentMode = setLiftTheVeil;

  // Add global CSS variables for theme colors with improved contrast
  useEffect(() => {
    const root = document.documentElement;
    if (liftTheVeil) {
      root.style.setProperty('--primary-accent', '#FF36AB');
      root.style.setProperty('--secondary-accent', '#B967FF');
      root.style.setProperty('--text-accent', '#FF70E9');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #FF36AB, #B967FF)');
      root.style.setProperty('--theme-primary', '#FF36AB');
      root.style.setProperty('--theme-secondary', '#B967FF');
      
      root.setAttribute('data-theme', 'veil-lifted');
    } else {
      root.style.setProperty('--primary-accent', '#8B5CF6');
      root.style.setProperty('--secondary-accent', '#6366F1');
      root.style.setProperty('--text-accent', '#A78BFA');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #4facfe, #00f2fe)');
      root.style.setProperty('--theme-primary', '#4facfe');
      root.style.setProperty('--theme-secondary', '#00f2fe');
      
      root.setAttribute('data-theme', 'standard');
    }
    
    console.log("Theme context updated, liftTheVeil:", liftTheVeil);
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
