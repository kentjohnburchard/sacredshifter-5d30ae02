
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  is_popular: boolean;
  is_best_value: boolean;
  yearly_discount: number;
  is_lifetime?: boolean;
  tier_name?: string;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  is_active: boolean;
  is_yearly: boolean;
  started_at: string;
  expires_at: string | null;
  is_lifetime?: boolean;
}

export interface UserCredits {
  balance: number | null;
  user_id: string;
}

export const useUserSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);

  // Load subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*');
          
        if (error) throw error;
        
        // Convert jsonb features to string array and transform the data to match SubscriptionPlan
        const formattedPlans = data.map(plan => ({
          ...plan,
          features: Array.isArray(plan.features) 
            ? plan.features.map(feature => String(feature)) 
            : [],
          is_popular: Boolean(plan.is_popular),
          is_best_value: Boolean(plan.is_best_value),
          yearly_discount: Number(plan.yearly_discount || 0),
          is_lifetime: Boolean(plan.is_lifetime || false),
          tier_name: String(plan.tier_name || '')
        })) as SubscriptionPlan[];
        
        setPlans(formattedPlans);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        toast.error("Could not load subscription plans");
      }
    };
    
    fetchPlans();
  }, []);
  
  // Load user subscription and credits if logged in
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setUserSubscription(null);
      setUserCredits(null);
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
          
        if (subscriptionError) throw subscriptionError;
        
        // Handle multiple subscriptions by using the most recent one
        let activeSubscription = null;
        if (subscriptionData && subscriptionData.length > 0) {
          // Sort by start date (newest first) and take the first one
          activeSubscription = subscriptionData.sort((a, b) => 
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
          )[0];
          
          // Add is_lifetime field if not present
          activeSubscription = {
            ...activeSubscription,
            is_lifetime: activeSubscription.is_lifetime || false
          };
        }
        
        setUserSubscription(activeSubscription);
        
        // Fetch user credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (creditsError && creditsError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is fine if user has no credits
          console.error("Error fetching user credits:", creditsError);
        } else if (creditsData) {
          setUserCredits(creditsData as UserCredits);
        } else {
          // Set default credits if none found
          setUserCredits({ balance: 0, user_id: user.id });
        }
        
      } catch (error) {
        console.error("Error fetching user subscription data:", error);
        toast.error("Could not load your subscription information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Toggle between monthly, yearly, and lifetime billing
  const toggleBillingCycle = (cycle: 'monthly' | 'yearly' | 'lifetime') => {
    setBillingCycle(cycle);
  };
  
  // Subscribe to a plan
  const subscribeToPlan = async (planId: string, billingType: 'monthly' | 'yearly' | 'lifetime' = 'monthly') => {
    if (!user) {
      toast.error("You need to be logged in to subscribe");
      return;
    }
    
    try {
      // This would integrate with Stripe or other payment processor
      toast.info("Processing your subscription...");
      
      const isYearly = billingType === 'yearly';
      const isLifetime = billingType === 'lifetime';
      
      // Calculate expiration date (null for lifetime)
      const expiresAt = isLifetime 
        ? null 
        : new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();
      
      // Create subscription record
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([{
          user_id: user.id,
          plan_id: planId,
          is_yearly: isYearly,
          is_lifetime: isLifetime,
          is_active: true,
          expires_at: expiresAt,
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Add is_lifetime field if not present
      const subscription = {
        ...data,
        is_lifetime: data.is_lifetime || false
      };
      
      setUserSubscription(subscription);
      
      toast.success("Successfully subscribed to plan!");
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Could not complete your subscription");
    }
  };
  
  return {
    loading,
    plans,
    userSubscription,
    userCredits,
    billingCycle,
    toggleBillingCycle,
    subscribeToPlan
  };
};
