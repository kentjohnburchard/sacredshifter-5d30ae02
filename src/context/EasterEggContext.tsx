
import React, { createContext, useContext, useState, useEffect } from "react";
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
  // Use the liftTheVeil state from ThemeContext
  const { liftTheVeil, setLiftTheVeil } = useTheme();

  // Map liftTheVeil to isEasterEggMode for backward compatibility
  const isEasterEggMode = liftTheVeil;

  // Toggle function that updates both contexts
  const toggleEasterEggMode = () => {
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
