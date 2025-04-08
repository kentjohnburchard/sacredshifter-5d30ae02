
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "premium" | "lifetime";

export interface UserSubscription {
  tier: SubscriptionTier;
  is_active: boolean;
  expires_at: string | null;
  is_lifetime: boolean;
  tier_name: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier_name: string;
  price: number;
  period: "month" | "year" | "lifetime";
  features: string[];
  is_popular: boolean;
  is_best_value: boolean;
  is_lifetime: boolean;
  yearly_discount: number;
  credits_per_period: number;
  songs_equivalent: number;
}

const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: "free",
  is_active: true,
  expires_at: null,
  is_lifetime: false,
  tier_name: "Free Tier"
};

export const useUserSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>(DEFAULT_SUBSCRIPTION);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly" | "lifetime">("monthly");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(DEFAULT_SUBSCRIPTION);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching subscription:", error);
          setError("Failed to load subscription data");
          setSubscription(DEFAULT_SUBSCRIPTION);
        } else if (data) {
          // Transform the database data into our UserSubscription type
          const tier = data.plan_id?.includes('premium') ? 'premium' : 
                      data.plan_id?.includes('lifetime') ? 'lifetime' : 'free';
                      
          setSubscription({
            tier: tier,
            is_active: data.is_active || false,
            expires_at: data.expires_at || null,
            is_lifetime: tier === 'lifetime',
            tier_name: tier === 'premium' ? 'Premium Plan' : 
                      tier === 'lifetime' ? 'Lifetime Membership' : 'Free Tier'
          });
        } else {
          // No subscription found, use default
          setSubscription(DEFAULT_SUBSCRIPTION);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
        setSubscription(DEFAULT_SUBSCRIPTION);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("*");

        if (error) {
          console.error("Error fetching plans:", error);
        } else if (data) {
          setPlans(data as SubscriptionPlan[]);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlans();
  }, []);

  // Toggle billing cycle
  const toggleBillingCycle = (cycle: "monthly" | "yearly" | "lifetime") => {
    setBillingCycle(cycle);
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId: string, billingCycle: "monthly" | "yearly" | "lifetime") => {
    if (!user) return;
    
    try {
      // This would typically call a Supabase Edge Function to create a checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          plan_id: planId,
          is_yearly: billingCycle === 'yearly',
          price: plans.find(p => p.id === planId)?.price || 0
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
    }
  };

  const hasActiveSubscription = (): boolean => {
    return subscription.is_active;
  };

  const isPremiumUser = (): boolean => {
    return (
      subscription.is_active && 
      (subscription.tier === "premium" || subscription.tier === "lifetime")
    );
  };

  const isLifetimeMember = (): boolean => {
    return subscription.is_lifetime;
  };

  return {
    subscription,
    userSubscription: subscription, // Alias for backward compatibility
    plans,
    billingCycle,
    toggleBillingCycle,
    subscribeToPlan,
    loading,
    error,
    hasActiveSubscription,
    isPremiumUser,
    isLifetimeMember
  };
};
