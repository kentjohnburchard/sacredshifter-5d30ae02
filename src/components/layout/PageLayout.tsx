
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // Determine consciousness mode class
  const consciousnessClass = liftTheVeil ? 'veil-mode' : 'standard-mode';
  
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white ${consciousnessClass} ${className}`}>
      <header className="bg-black/60 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button 
                onClick={handleBack}
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 focus:ring-2 focus:ring-white/30"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
            
            {title && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-contrast-high">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-200">{subtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="pb-16 overflow-x-hidden">
        {children}
      </main>
      
      <footer className="bg-black/60 backdrop-blur-sm py-4 mt-auto shadow-inner">
        <div className="container mx-auto px-4 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Sacred Sound Journeys</p>
        </div>
      </footer>
    </div>
  );
};
