
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  pageTitle?: string; // Add pageTitle property
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Sacred Shifter",
  pageTitle,  // Use pageTitle if provided
  className = ""
}) => {
  React.useEffect(() => {
    document.title = pageTitle || title;
  }, [pageTitle, title]);

  return (
    <div className={`min-h-screen flex flex-col bg-gray-900 ${className}`}>
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-purple-400">
            Sacred Shifter
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors">About</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-purple-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/sacred-circle" className="text-gray-300 hover:text-purple-400 transition-colors">Circle</Link></li>
              <li><Link to="/lightbearer" className="text-gray-300 hover:text-purple-400 transition-colors">Lightbearer</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6 text-center text-gray-400">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Sacred Shifter. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
