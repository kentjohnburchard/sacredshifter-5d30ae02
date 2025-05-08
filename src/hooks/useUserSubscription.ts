
import { useAuth } from '@/context/AuthContext';

export const useUserSubscription = () => {
  const { profile } = useAuth();
  
  // Check if user has premium access
  const isPremiumUser = () => {
    return !!profile?.is_premium;
  };
  
  // Get subscription status information
  const getSubscriptionStatus = () => {
    if (!profile) {
      return { status: 'unauthenticated', label: 'Not Logged In' };
    }
    
    if (profile.is_premium) {
      return { status: 'premium', label: 'Premium' };
    }
    
    return { status: 'free', label: 'Free Account' };
  };
  
  return {
    isPremiumUser,
    getSubscriptionStatus
  };
};
