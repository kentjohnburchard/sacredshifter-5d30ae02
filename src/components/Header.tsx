
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showHomeButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Sacred Shifter',
  showHomeButton = true 
}) => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  
  return (
    <header 
      className="py-3 px-4 relative z-20 backdrop-blur-lg"
      style={{
        borderBottom: `1px solid ${liftTheVeil ? 'rgba(236, 72, 153, 0.2)' : 'rgba(168, 85, 247, 0.2)'}`,
        background: 'rgba(10, 10, 18, 0.7)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showHomeButton && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-300"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          
          <h1 
            className="text-lg font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage: liftTheVeil 
                ? 'linear-gradient(to right, rgba(236, 72, 153, 1), rgba(236, 72, 153, 0.8))' 
                : 'linear-gradient(to right, rgba(168, 85, 247, 1), rgba(168, 85, 247, 0.8))',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
