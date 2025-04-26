
import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  // You can re-enable navigation logging here if needed, but nothing currently.
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default App;
