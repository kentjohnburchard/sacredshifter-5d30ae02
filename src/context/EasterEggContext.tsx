
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

  // Map liftTheVeil to isEasterEggMode for backward compatibility
  const isEasterEggMode = liftTheVeil;

  // Single source of truth for toggle function
  const toggleEasterEggMode = () => {
    const newState = !liftTheVeil;
    console.log("EasterEgg toggle triggered, switching from", liftTheVeil, "to", newState);
    setLiftTheVeil(newState);
  };

  return (
    <EasterEggContext.Provider value={{ isEasterEggMode, toggleEasterEggMode }}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEggContext = () => useContext(EasterEggContext);

export default EasterEggContext;
