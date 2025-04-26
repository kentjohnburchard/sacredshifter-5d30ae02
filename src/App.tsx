
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './AppRoutes';

// App does not need children, it renders AppRoutes
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
