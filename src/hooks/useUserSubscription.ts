
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits_per_period: number;
  period: string;
  songs_equivalent: number;
  features: string[];
  is_popular: boolean;
  is_best_value: boolean;
  yearly_discount: number;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  is_active: boolean;
  is_yearly: boolean;
  started_at: string;
  expires_at: string | null;
}

export interface UserCredits {
  balance: number;
  last_updated: string;
}

export const useUserSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
          yearly_discount: Number(plan.yearly_discount || 0)
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
        // Fetch user subscription - fix the maybeSingle issue by using select() and handling multiple results
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
        }
        
        // Fetch user credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits')
          .select('balance, last_updated')
          .eq('user_id', user.id);
          
        if (creditsError) throw creditsError;
        
        // Handle potential multiple credit records by taking the first one
        const userCreditData = creditsData && creditsData.length > 0 ? creditsData[0] : null;
        
        setUserSubscription(activeSubscription);
        setUserCredits(userCreditData);
      } catch (error) {
        console.error("Error fetching user subscription data:", error);
        toast.error("Could not load your subscription information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Toggle between monthly and yearly billing
  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };
  
  // Subscribe to a plan
  const subscribeToPlan = async (planId: string, isYearly: boolean = false) => {
    if (!user) {
      toast.error("You need to be logged in to subscribe");
      return;
    }
    
    try {
      // This would integrate with Stripe or other payment processor
      // For now, we'll just create a subscription record directly
      
      toast.info("Processing your subscription...");
      
      // Create subscription record
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([{
          user_id: user.id,
          plan_id: planId,
          is_yearly: isYearly,
          is_active: true,
          expires_at: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setUserSubscription(data);
      
      // Fetch the plan to get credits
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('credits_per_period')
        .eq('id', planId)
        .single();
        
      if (planError) throw planError;
      
      // Add credits to user balance
      const creditAmount = planData.credits_per_period;
      const { error: creditError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          balance: creditAmount,
          last_updated: new Date().toISOString()
        });
        
      if (creditError) throw creditError;
      
      // Record credit transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: creditAmount,
          description: `Credits from ${isYearly ? 'yearly' : 'monthly'} subscription`,
          transaction_type: 'subscription'
        });
      
      // Fetch updated credits
      const { data: updatedCredits, error: updatedCreditsError } = await supabase
        .from('user_credits')
        .select('balance, last_updated')
        .eq('user_id', user.id)
        .single();
        
      if (updatedCreditsError) throw updatedCreditsError;
      
      setUserCredits(updatedCredits);
      
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
