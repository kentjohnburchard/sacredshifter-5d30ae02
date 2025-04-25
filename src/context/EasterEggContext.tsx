
import React, { createContext, useContext, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

type EasterEggContextType = {
  isEasterEggMode: boolean;
  toggleEasterEggMode: () => void;
};

const EasterEggContext = createContext<EasterEggContextType>({
  isEasterEggMode: false,
  toggleEasterEggMode: () => {},
});

export const EasterEggProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();

  // Log initial state for debugging
  useEffect(() => {
    console.log("EasterEggProvider initialized, liftTheVeil state:", liftTheVeil);
  }, []);

  // Map liftTheVeil to isEasterEggMode for backward compatibility
  const isEasterEggMode = liftTheVeil;

  // Simplified toggle function that updates both contexts
  const toggleEasterEggMode = () => {
    const newState = !liftTheVeil;
    console.log("Easter egg toggle triggered, current state:", liftTheVeil, "new state:", newState);
    setLiftTheVeil(newState);
    
    // Show toast notification
    if (window.document) {
      toast.success(
        newState ? "Veil Lifted! Consciousness expanded." : "Returning to standard consciousness",
        {
          icon: <Sparkles className={newState ? "text-pink-500" : "text-purple-500"} />,
          duration: 3000
        }
      );
    }
  };

  return (
    <EasterEggContext.Provider value={{ isEasterEggMode, toggleEasterEggMode }}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEggContext = () => useContext(EasterEggContext);

export default EasterEggContext;
