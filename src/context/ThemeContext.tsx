
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
  toggleConsciousnessMode: () => void; // Toggle function
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
  toggleConsciousnessMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const { randomQuote, refreshRandomQuote, getRandomQuote } = useLoveQuotes();
  const [currentQuote, setCurrentQuote] = useState("");
  const [liftTheVeil, setLiftTheVeilState] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState("linear-gradient(to right, #4facfe, #00f2fe)");
  const [currentElement, setCurrentElement] = useState("water");
  const [currentWatermarkStyle, setCurrentWatermarkStyle] = useState("zodiac");
  
  // Initialize theme state from localStorage ONLY on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('liftTheVeil');
      console.log("ThemeContext: Initial localStorage check:", savedMode);
      
      if (savedMode !== null) {
        const parsedMode = savedMode === 'true';
        console.log("ThemeContext: Initializing state from localStorage:", parsedMode);
        setLiftTheVeilState(parsedMode);
      } else {
        console.log("ThemeContext: No saved mode found, using default (false)");
      }
    } catch (e) {
      console.error("Error reading theme from localStorage:", e);
    }
  }, []);

  // The CRITICAL toggle function - completely rewritten for reliability
  const toggleConsciousnessMode = useCallback(() => {
    setLiftTheVeilState(prevState => {
      const newState = !prevState;
      console.log(`ThemeContext: toggleConsciousnessMode executed, flipping from ${prevState} to ${newState}`);
      
      // Save to localStorage
      try {
        localStorage.setItem('liftTheVeil', String(newState));
        console.log("ThemeContext: Saved new state to localStorage:", newState);
      } catch (e) {
        console.error("ThemeContext: Failed to save to localStorage:", e);
      }
      
      // Show toast with the NEW state
      toast.success(
        newState ? "Veil Lifted! Consciousness expanded." : "Returning to standard consciousness",
        {
          icon: <Sparkles className={newState ? "text-pink-500" : "text-purple-500"} />,
          duration: 3000,
          position: "top-center"
        }
      );
      
      return newState;
    });
  }, []);

  // Legacy setter - simplified to use toggleConsciousnessMode when appropriate
  const setLiftTheVeil = useCallback((newMode: boolean) => {
    console.log("ThemeContext: setLiftTheVeil called with:", newMode);
    
    setLiftTheVeilState(prevMode => {
      if (prevMode === newMode) {
        console.log("ThemeContext: No change needed, same state:", newMode);
        return prevMode;
      }
      
      console.log(`ThemeContext: Changing state from ${prevMode} to ${newMode}`);
      
      try {
        localStorage.setItem('liftTheVeil', String(newMode));
      } catch (e) {
        console.error("Could not save theme state to localStorage:", e);
      }
      
      return newMode;
    });
  }, []);

  // Make kentMode a direct reference to liftTheVeil
  const kentMode = liftTheVeil;
  const setKentMode = setLiftTheVeil;

  // Apply theme changes when state changes
  useEffect(() => {
    const root = document.documentElement;
    
    console.log("ThemeContext: Applying theme changes, liftTheVeil =", liftTheVeil);
    
    if (liftTheVeil) {
      root.style.setProperty('--primary-accent', '#FF36AB');
      root.style.setProperty('--secondary-accent', '#B967FF');
      root.style.setProperty('--text-accent', '#FF70E9');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #FF36AB, #B967FF)');
      root.style.setProperty('--theme-primary', '#FF36AB');
      root.style.setProperty('--theme-secondary', '#B967FF');
      
      root.setAttribute('data-theme', 'veil-lifted');
      root.classList.add('veil-lifted');
      setCurrentTheme("linear-gradient(to right, #FF36AB, #B967FF)");
    } else {
      root.style.setProperty('--primary-accent', '#8B5CF6');
      root.style.setProperty('--secondary-accent', '#6366F1');
      root.style.setProperty('--text-accent', '#A78BFA');
      root.style.setProperty('--theme-gradient', 'linear-gradient(to right, #4facfe, #00f2fe)');
      root.style.setProperty('--theme-primary', '#4facfe');
      root.style.setProperty('--theme-secondary', '#00f2fe');
      
      root.setAttribute('data-theme', 'standard');
      root.classList.remove('veil-lifted');
      setCurrentTheme("linear-gradient(to right, #4facfe, #00f2fe)");
    }
    
    // Dispatch event for components that need to react to theme changes
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
      currentWatermarkStyle,
      toggleConsciousnessMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
