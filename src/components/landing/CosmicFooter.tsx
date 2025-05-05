
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Heart, 
  CopyCheck, 
  FileQuestion, 
  Mail, 
  User, 
  Lock 
} from 'lucide-react';

const CosmicFooter: React.FC = () => {
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const navigate = useNavigate();
  
  // Reset click counter after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setAdminClicks(0);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [adminClicks]);
  
  // Handle secret admin access via clicks
  const handleLogoClick = () => {
    setAdminClicks(prevClicks => {
      const newClickCount = prevClicks + 1;
      
      // After 5 rapid clicks, show admin portal
      if (newClickCount >= 5) {
        setShowAdminPortal(true);
        return 0;
      }
      
      return newClickCount;
    });
  };
  
  // Navigate to admin console
  const goToAdminConsole = () => {
    navigate('/admin/console');
    setShowAdminPortal(false);
  };

  return (
    <footer className="relative z-20 py-8 px-4 md:px-8 border-t border-purple-800/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 
              className="text-xl font-bold text-white mb-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              onClick={handleLogoClick}
            >
              Sacred Shifter
            </h3>
            <p className="text-white/70 text-sm max-w-md">
              Sacred Shifter is dedicated to helping you elevate your consciousness through sacred frequencies, 
              immersive journeys, and spiritual tools for awakening.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-3">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/journeys-directory" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Sacred Journeys
                  </Link>
                </li>
                <li>
                  <Link to="/frequency-library" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <Heart className="h-4 w-4" /> Frequencies
                  </Link>
                </li>
                <li>
                  <Link to="/meditation" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <CopyCheck className="h-4 w-4" /> Meditations
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Information</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about/what" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" /> About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Contact
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                    <User className="h-4 w-4" /> Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-white/70 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-white/70 hover:text-white"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.622.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-white/70 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="mt-4 text-white/50 text-xs">
              &copy; {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Portal Modal */}
      {showAdminPortal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                Admin Portal
              </h3>
              <button 
                onClick={() => setShowAdminPortal(false)}
                className="text-white/70 hover:text-white"
              >
                &times;
              </button>
            </div>
            <p className="text-white/70 mb-4">
              This portal is restricted to administrators only. Please proceed if you have proper authorization.
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAdminPortal(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={goToAdminConsole}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-500 transition-colors"
              >
                Access Console
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default CosmicFooter;
