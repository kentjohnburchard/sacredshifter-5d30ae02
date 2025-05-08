
import { Routes, Route } from 'react-router-dom';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/journey/:slug" element={<Placeholder name="Journey" />} />
        <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
        <Route path="/sacred-circle" element={<Placeholder name="Sacred Circle" />} />
        <Route path="/lightbearer" element={<Placeholder name="Lightbearer" />} />
        
        {/* Fallback for missing routes */}
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
    </>
  );
}

export default App;
