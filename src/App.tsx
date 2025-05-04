
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './AppRoutes';
import { Toaster } from './components/ui/toaster';
import './styles/community.css'; // Import Sacred Circle styles
import './styles/premium.css'; // Import Ascended Path styles
import './styles/journey.css'; // Import Journey styles

// App does not need children, it renders AppRoutes
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div id="sacred-shifter-app" className="min-h-screen w-full">
        <AppRoutes />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;
