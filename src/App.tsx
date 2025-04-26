
import React, { useEffect } from 'react';
// Remove the React Router import
// import { useLocation } from 'react-router-dom';
// Remove AppRoutes import (not needed, app is rendered by router now)
// import AppRoutes from './AppRoutes';
import { ThemeProvider } from './context/ThemeContext';

// You may need a custom hook/useRoute for location logging, but for now, remove logging

const App: React.FC = () => {
  // If you really want path logs, use your own useRoute hook, else just remove:
  // const { path } = useRoute();
  // useEffect(() => {
  //   console.log('Navigation occurred to:', path);
  // }, [path]);
  return (
    <ThemeProvider>
      {/* The rendered page/component comes from RouterProvider in main.tsx */}
    </ThemeProvider>
  );
};

export default App;
