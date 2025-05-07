
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Moon } from 'lucide-react';

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, toggleVeil } = useTheme();
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleVeil}
        className={`
          p-2 rounded-full 
          ${liftTheVeil 
            ? 'bg-pink-900/30 border-pink-400/30 text-pink-200 hover:bg-pink-800/40' 
            : 'bg-purple-900/30 border-purple-400/30 text-purple-200 hover:bg-purple-800/40'}
        `}
      >
        {liftTheVeil ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ConsciousnessToggle;
