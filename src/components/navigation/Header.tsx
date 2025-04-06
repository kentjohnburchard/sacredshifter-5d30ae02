import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Menu, User, X, Palette, Heart, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
                alt="Sacred Shifter Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/home" className="text-gray-600 hover:text-purple-600 transition-colors">
                <Home className="h-4 w-4 inline mr-1" /> Home
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Dashboard</Link>
                  <Link to="/energy-check" className="text-gray-600 hover:text-purple-600 transition-colors">Energy Check</Link>
                  <Link to="/frequency-library" className="text-gray-600 hover:text-purple-600 transition-colors">Frequencies</Link>
                  <Link to="/heart-center" className="text-gray-600 hover:text-pink-600 transition-colors">
                    <Heart className="h-4 w-4 inline mr-1" /> Heart Center
                  </Link>
                  <Link to="/sacred-blueprint" className="text-gray-600 hover:text-purple-600 transition-colors">
                    <Sparkles className="h-4 w-4 inline mr-1" /> Sacred Blueprint
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/personal-vibe" className="hidden md:flex">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Palette className="h-4 w-4 mr-2" />
                    My Vibe
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/auth?signup=true" className="hidden md:block">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              {user && (
                <>
                  <Link to="/sacred-blueprint" className="text-gray-600 hover:text-purple-600 transition-colors py-1">
                    <Sparkles className="h-4 w-4 inline mr-1" /> Sacred Blueprint
                  </Link>
                </>
              )}
              <Link to="/home" className="text-gray-600 hover:text-purple-600 transition-colors py-1">
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Dashboard</Link>
                  <Link to="/energy-check" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Energy Check</Link>
                  <Link to="/frequency-library" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Frequencies</Link>
                  <Link to="/heart-center" className="text-gray-600 hover:text-pink-600 transition-colors py-1">
                    <Heart className="h-4 w-4 inline mr-1" /> Heart Center
                  </Link>
                  <Link to="/personal-vibe" className="text-gray-600 hover:text-purple-600 transition-colors py-1">My Vibe</Link>
                  <Link to="/profile" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/auth" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Login</Link>
                  <Link to="/auth?signup=true" className="text-gray-600 hover:text-purple-600 transition-colors py-1">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
