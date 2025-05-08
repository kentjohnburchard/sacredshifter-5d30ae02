import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface PremiumGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

const PremiumGuard: React.FC<PremiumGuardProps> = ({ 
  children, 
  fallbackMessage = "This content requires a premium subscription."
}) => {
  const { isPremium, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-b-2 border-purple-500 rounded-full mr-3"></div>
        <div className="text-sm text-purple-700">Checking subscription...</div>
      </div>
    );
  }
  
  // If user is premium, show the content
  if (isPremium()) {
    return <>{children}</>;
  }
  
  // Otherwise, show upgrade prompt
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-black/60 backdrop-blur-sm text-center shadow-inner">
      <Lock className="w-10 h-10 mb-3 text-gray-300" />
      <p className="mb-4 text-white font-medium">{fallbackMessage}</p>
      
      <Link to="/subscription">
        <Button 
          variant="default"
          className="mt-2 shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          Upgrade To Premium
        </Button>
      </Link>
    </div>
  );
};

export default PremiumGuard;
