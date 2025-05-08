
import { useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useUserSubscription } from '@/hooks/useUserSubscription';

/**
 * Hook to check if user has access to premium content based on their
 * consciousness state (liftTheVeil) and subscription status
 */
export const usePremiumContent = () => {
  const { liftTheVeil } = useTheme();
  const { 
    isPremiumUser, 
    isLifetimeMember, 
    hasActiveSubscription,
    loading,
    subscription
  } = useUserSubscription();

  /**
   * Check if the user has access to specific content based on requirements
   */
  const checkAccess = useCallback((options: {
    requireLiftedVeil?: boolean;
    requireSubscription?: boolean;
    requireLifetimeMembership?: boolean;
  }) => {
    const { 
      requireLiftedVeil = false, 
      requireSubscription = false,
      requireLifetimeMembership = false
    } = options;
    
    // Consciousness state check
    if (requireLiftedVeil && !liftTheVeil) {
      return false;
    }
    
    // Subscription checks
    if (requireSubscription && !isPremiumUser()) {
      return false;
    }
    
    // Lifetime membership check
    if (requireLifetimeMembership && !isLifetimeMember()) {
      return false;
    }
    
    return true;
  }, [liftTheVeil, isPremiumUser, isLifetimeMember]);

  /**
   * Get a message explaining why access is denied
   */
  const getAccessMessage = useCallback((options: {
    requireLiftedVeil?: boolean;
    requireSubscription?: boolean;
    requireLifetimeMembership?: boolean;
  }) => {
    const { 
      requireLiftedVeil = false, 
      requireSubscription = false,
      requireLifetimeMembership = false 
    } = options;
    
    if (requireLiftedVeil && !liftTheVeil) {
      return "This content requires expanded consciousness. Toggle 'Veil Lifted' mode to access.";
    }
    
    if (requireLifetimeMembership && !isLifetimeMember()) {
      return "This content is exclusively available to lifetime members.";
    }
    
    if (requireSubscription && !isPremiumUser()) {
      return "This content requires an active premium subscription.";
    }
    
    // Combination messages
    if (requireLiftedVeil && requireSubscription) {
      if (!liftTheVeil && !isPremiumUser()) {
        return "This content requires both expanded consciousness and a premium subscription.";
      }
    }
    
    return "You don't have access to this content.";
  }, [liftTheVeil, isPremiumUser, isLifetimeMember]);

  return {
    checkAccess,
    getAccessMessage,
    hasActiveSubscription,
    isPremiumUser,
    isLifetimeMember,
    liftTheVeil,
    loading,
    subscription
  };
};
