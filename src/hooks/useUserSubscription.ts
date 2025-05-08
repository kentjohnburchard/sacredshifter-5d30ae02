
import { useAuth } from '@/context/AuthContext';

export const useUserSubscription = () => {
  const { profile } = useAuth();
  
  // Check if user has premium access
  const isPremiumUser = () => {
    return !!profile?.is_premium;
  };
  
  // Check if user has lifetime membership
  const isLifetimeMember = () => {
    // Check if profile has is_lifetime_member property, if not fall back to checking is_premium
    return !!profile?.is_lifetime_member || !!profile?.is_premium;
  };
  
  // Check if user has an active subscription
  const hasActiveSubscription = () => {
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
  
  // Loading state
  const loading = false;
  
  // Subscription details
  const subscription = profile?.is_premium ? {
    status: 'active',
    plan: 'premium',
    renewalDate: null
  } : null;
  
  return {
    isPremiumUser,
    isLifetimeMember,
    hasActiveSubscription,
    getSubscriptionStatus,
    loading,
    subscription
  };
};
