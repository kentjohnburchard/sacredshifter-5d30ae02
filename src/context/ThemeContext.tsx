
import React, { createContext, useState, useContext, useEffect } from 'react';

interface ThemeContextType {
  liftTheVeil: boolean;
  toggleVeil: () => void;
  setVeilState: (state: boolean) => void;
  // Add these no-op implementations for backwards compatibility
  toggleConsciousnessMode?: () => void;
  setLiftTheVeil?: (state: boolean) => void;
  currentElement?: string;
  currentWatermarkStyle?: string;
}

const ThemeContext = createContext<ThemeContextType>({
  liftTheVeil: false,
  toggleVeil: () => {},
  setVeilState: () => {},
  toggleConsciousnessMode: () => {},
  setLiftTheVeil: () => {},
  currentElement: 'air',
  currentWatermarkStyle: 'default'
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liftTheVeil, setLiftTheVeil] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const savedVeilState = localStorage.getItem('liftTheVeil');
    if (savedVeilState) {
      setLiftTheVeil(savedVeilState === 'true');
    }
  }, []);

  const toggleVeil = () => {
    const newState = !liftTheVeil;
    setLiftTheVeil(newState);
    localStorage.setItem('liftTheVeil', String(newState));
    
    // Dispatch custom event for other components to listen for
    const event = new CustomEvent('themeChanged', { detail: { liftTheVeil: newState } });
    window.dispatchEvent(event);
  };

  const setVeilState = (state: boolean) => {
    setLiftTheVeil(state);
    localStorage.setItem('liftTheVeil', String(state));
    
    const event = new CustomEvent('themeChanged', { detail: { liftTheVeil: state } });
    window.dispatchEvent(event);
  };

  // Add this alias for backwards compatibility
  const toggleConsciousnessMode = toggleVeil;

  return (
    <ThemeContext.Provider value={{ 
      liftTheVeil, 
      toggleVeil, 
      setVeilState,
      // Add compatibility properties 
      toggleConsciousnessMode,
      setLiftTheVeil: setVeilState,
      currentElement: 'air',
      currentWatermarkStyle: 'default'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
