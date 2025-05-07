
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
    <header className={`
      border-b py-2 px-4
      ${liftTheVeil 
        ? 'bg-black/60 border-pink-500/20' 
        : 'bg-black/60 border-purple-500/20'}
      backdrop-blur-md
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showHomeButton && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
