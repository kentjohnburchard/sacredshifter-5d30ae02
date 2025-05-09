
import React, { createContext, useState, useContext, useEffect } from 'react';

interface ThemeContextType {
  liftTheVeil: boolean;
  toggleVeil: () => void;
  setVeilState: (state: boolean) => void;
  setLiftTheVeil: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: ThemeContextType = {
  liftTheVeil: false,
  toggleVeil: () => {},
  setVeilState: () => {},
  setLiftTheVeil: () => {}
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liftTheVeil, setLiftTheVeil] = useState<boolean>(false);

  // Load saved theme preference
  useEffect(() => {
    try {
      const savedVeilState = localStorage.getItem('liftTheVeil');
      if (savedVeilState) {
        setLiftTheVeil(savedVeilState === 'true');
      }
    } catch (error) {
      console.error("Error loading saved theme state:", error);
    }
  }, []);

  const toggleVeil = () => {
    try {
      const newState = !liftTheVeil;
      setLiftTheVeil(newState);
      localStorage.setItem('liftTheVeil', String(newState));
      
      // Apply the appropriate body class
      if (newState) {
        document.body.classList.add('veil-mode');
        document.body.classList.remove('standard-mode');
      } else {
        document.body.classList.add('standard-mode');
        document.body.classList.remove('veil-mode');
      }
      
      // Dispatch custom event for other components to listen for
      const event = new CustomEvent('themeChanged', { detail: { liftTheVeil: newState } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  };

  const setVeilState = (state: boolean) => {
    try {
      setLiftTheVeil(state);
      localStorage.setItem('liftTheVeil', String(state));
      
      // Apply the appropriate body class
      if (state) {
        document.body.classList.add('veil-mode');
        document.body.classList.remove('standard-mode');
      } else {
        document.body.classList.add('standard-mode');
        document.body.classList.remove('veil-mode');
      }
      
      const event = new CustomEvent('themeChanged', { detail: { liftTheVeil: state } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error setting theme state:", error);
    }
  };

  // Apply initial body class
  useEffect(() => {
    if (liftTheVeil) {
      document.body.classList.add('veil-mode');
      document.body.classList.remove('standard-mode');
    } else {
      document.body.classList.add('standard-mode');
      document.body.classList.remove('veil-mode');
    }
  }, [liftTheVeil]);

  return (
    <ThemeContext.Provider value={{ 
      liftTheVeil, 
      toggleVeil, 
      setVeilState,
      setLiftTheVeil
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
