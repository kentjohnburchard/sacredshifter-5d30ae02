
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
    // Log status for debugging
    console.log(`Sacred prime mode ${!liftTheVeil ? 'activated' : 'deactivated'}`);
    
    // Show toast notification when done via direct DOM manipulation since we're in a context
    if (window.document) {
      // This is a simple way to trigger a notification without importing toast in context
      const event = new CustomEvent('toggleEasterEgg', {
        detail: { isEasterEggMode: !liftTheVeil }
      });
      window.dispatchEvent(event);
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
