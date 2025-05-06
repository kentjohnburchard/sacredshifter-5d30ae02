import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Fallback route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
