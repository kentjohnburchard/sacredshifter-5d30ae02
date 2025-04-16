
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import './styles/liquid-crystal.css';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
