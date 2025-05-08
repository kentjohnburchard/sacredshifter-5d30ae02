
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PremiumContentProps {
  children: React.ReactNode;
  requireLiftedVeil?: boolean;
  requireSubscription?: boolean;
  fallbackMessage?: string;
  redirectToSubscription?: boolean;
}

/**
 * Component that conditionally renders content based on user's consciousness state 
 * and subscription status.
 */
const PremiumContent: React.FC<PremiumContentProps> = ({
  children,
  requireLiftedVeil = false,
  requireSubscription = false,
  fallbackMessage = "This content requires expanded consciousness and an active subscription.",
  redirectToSubscription = true,
}) => {
  const { liftTheVeil } = useTheme();
  const { isPremium } = useAuth();
  
  const hasAccess = 
    (!requireLiftedVeil || liftTheVeil) && 
    (!requireSubscription || isPremium());
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-black/60 backdrop-blur-sm text-center shadow-inner">
      <Lock className="w-10 h-10 mb-3 text-gray-300" />
      <p className="mb-4 text-white font-medium">{fallbackMessage}</p>
      
      {requireLiftedVeil && !liftTheVeil && (
        <p className="mb-4 text-sm text-gray-300">
          Toggle "Veil Lifted" mode in the top right corner to see beyond the veil.
        </p>
      )}
      
      {requireSubscription && !isPremium() && redirectToSubscription && (
        <Link to="/subscription">
          <Button 
            variant="default"
            className="mt-2 shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          >
            Upgrade Your Experience
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PremiumContent;
