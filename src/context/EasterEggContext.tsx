
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
  const { liftTheVeil, toggleConsciousnessMode } = useTheme();

  // Simply map to ThemeContext values
  const isEasterEggMode = liftTheVeil;

  // Use the central toggle function
  const toggleEasterEggMode = () => {
    console.log("EasterEggContext: Toggle requested, delegating to ThemeContext");
    toggleConsciousnessMode();
  };

  return (
    <EasterEggContext.Provider value={{ isEasterEggMode, toggleEasterEggMode }}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEggContext = () => useContext(EasterEggContext);

export default EasterEggContext;
