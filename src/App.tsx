
import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const location = useLocation();

  // Log navigation for debugging
  useEffect(() => {
    console.log('Navigation occurred to:', location.pathname);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
