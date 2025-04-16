
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import './styles/liquid-crystal.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-center" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
