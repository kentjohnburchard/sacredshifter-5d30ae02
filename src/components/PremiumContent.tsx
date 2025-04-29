
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

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
  const { isPremiumUser } = useUserSubscription();
  
  const hasAccess = 
    (!requireLiftedVeil || liftTheVeil) && 
    (!requireSubscription || isPremiumUser());
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-black/40 backdrop-blur-sm text-center">
      <Lock className="w-10 h-10 mb-3 text-gray-400" />
      <p className="mb-4 text-gray-300">{fallbackMessage}</p>
      
      {requireLiftedVeil && !liftTheVeil && (
        <p className="mb-4 text-sm text-gray-400">
          Toggle "Veil Lifted" mode in the top right corner to see beyond the veil.
        </p>
      )}
      
      {requireSubscription && !isPremiumUser() && redirectToSubscription && (
        <Button 
          variant="secondary" 
          className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          onClick={() => window.location.href = '/subscription'}
        >
          Upgrade Your Experience
        </Button>
      )}
    </div>
  );
};

export default PremiumContent;
