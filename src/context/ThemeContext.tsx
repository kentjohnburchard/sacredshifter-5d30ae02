
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLoveQuotes } from "@/hooks/useLoveQuotes";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

type ThemeContextType = {
  liftTheVeil: boolean;
  setLiftTheVeil: (mode: boolean) => void;
  currentQuote: string;
  refreshQuote: () => void;
  currentTheme: string;
  currentElement: string;
  currentWatermarkStyle: string;
  toggleConsciousnessMode: () => void;
  isContentAccessible: (requireLiftedVeil: boolean, requireSubscription: boolean) => boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  liftTheVeil: false,
  setLiftTheVeil: () => {},
  currentQuote: "",
  refreshQuote: () => {},
  currentTheme: "linear-gradient(to right, #4facfe, #00f2fe)",
  currentElement: "water",
  currentWatermarkStyle: "zodiac",
  toggleConsciousnessMode: () => {},
  isContentAccessible: () => false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, saveUserPreferences } = useUserPreferences();
  const { randomQuote, refreshRandomQuote, getRandomQuote } = useLoveQuotes();
  const [currentQuote, setCurrentQuote] = useState("");
  const [liftTheVeil, setLiftTheVeilState] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState("linear-gradient(to right, #4facfe, #00f2fe)");
  const [currentElement, setCurrentElement] = useState("water");
  const [currentWatermarkStyle, setCurrentWatermarkStyle] = useState("zodiac");
  
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

  const toggleConsciousnessMode = useCallback(() => {
    console.log("TOGGLE FUNCTION CALLED - Current state before toggle:", liftTheVeil);
    
    setLiftTheVeilState(prevState => {
      const newState = !prevState;
      console.log(`ThemeContext: toggleConsciousnessMode executed, flipping from ${prevState} to ${newState}`);
      
      try {
        localStorage.setItem('liftTheVeil', String(newState));
        console.log("ThemeContext: Saved new state to localStorage:", newState);
      } catch (e) {
        console.error("ThemeContext: Failed to save to localStorage:", e);
      }
      
      toast.success(
        newState ? "Veil Lifted! Consciousness expanded." : "Returning to standard consciousness",
        {
          icon: <Sparkles className={newState ? "text-pink-500" : "text-purple-500"} />,
          duration: 3000,
          position: "top-center"
        }
      );
      
      const event = new CustomEvent('themeChanged', { 
        detail: { liftTheVeil: newState } 
      });
      window.dispatchEvent(event);
      console.log("ThemeContext: Dispatched themeChanged event with new state:", newState);
      
      return newState;
    });
  }, []);

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
      
      const event = new CustomEvent('themeChanged', { 
        detail: { liftTheVeil: newMode } 
      });
      window.dispatchEvent(event);
      console.log("ThemeContext: Dispatched themeChanged event with new state:", newMode);
      
      return newMode;
    });
  }, []);

  // Helper function to check if content is accessible based on consciousness mode and subscription
  const isContentAccessible = useCallback((requireLiftedVeil: boolean, requireSubscription: boolean) => {
    // For now, only check the liftTheVeil state
    // The subscription check will be implemented separately
    if (requireLiftedVeil && !liftTheVeil) {
      return false;
    }
    
    // We don't check subscription here yet, but the structure is prepared for it
    return true;
  }, [liftTheVeil]);

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
      root.classList.add('veil-mode');
      root.classList.remove('standard-mode');
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
      root.classList.remove('veil-mode');
      root.classList.add('standard-mode');
      setCurrentTheme("linear-gradient(to right, #4facfe, #00f2fe)");
    }
    
    const event = new CustomEvent('themeChanged', { detail: { liftTheVeil } });
    window.dispatchEvent(event);
    console.log("ThemeContext: Dispatched themeChanged event on theme change:", liftTheVeil);
    
  }, [liftTheVeil]);

  return (
    <ThemeContext.Provider value={{ 
      liftTheVeil, 
      setLiftTheVeil, 
      currentQuote, 
      refreshQuote: getRandomQuote,
      currentTheme,
      currentElement,
      currentWatermarkStyle,
      toggleConsciousnessMode,
      isContentAccessible
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
