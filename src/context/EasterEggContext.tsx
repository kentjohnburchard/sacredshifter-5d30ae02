
import React, { createContext, useContext } from "react";
import { useTheme } from "./ThemeContext";

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

  // Single source of truth for toggle function - simply inverts the current state
  const toggleEasterEggMode = () => {
    console.log("EasterEgg: Toggle triggered, current state:", liftTheVeil);
    setLiftTheVeil(!liftTheVeil);
  };

  return (
    <EasterEggContext.Provider value={{ isEasterEggMode, toggleEasterEggMode }}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEggContext = () => useContext(EasterEggContext);

export default EasterEggContext;
