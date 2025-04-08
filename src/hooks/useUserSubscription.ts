import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export type SubscriptionTier = "free" | "premium" | "lifetime";

export interface UserSubscription {
  tier: SubscriptionTier;
  is_active: boolean;
  expires_at: string | null;
  is_lifetime: boolean;
  tier_name: string;
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
          setSubscription({
            tier: data.tier || "free",
            is_active: data.is_active || false,
            expires_at: data.expires_at || null,
            is_lifetime: data.is_lifetime || false,
            tier_name: data.tier_name || "Free Tier"
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
    loading,
    error,
    hasActiveSubscription,
    isPremiumUser,
    isLifetimeMember
  };
};
