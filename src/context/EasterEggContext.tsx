
import React, { createContext, useContext, useEffect } from "react";
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

  // Single source of truth for toggle function
  const toggleEasterEggMode = () => {
    const newState = !liftTheVeil;
    console.log("EasterEgg toggle triggered, switching from", liftTheVeil, "to", newState);
    
    // Call the setLiftTheVeil function from ThemeContext
    // This will handle state updates, localStorage persistence, and toast notifications
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
