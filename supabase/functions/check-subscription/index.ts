
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Get the token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authorization token");
    }

    // Check if user has an active subscription in the database
    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (subscriptionError && subscriptionError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      throw subscriptionError;
    }

    // If subscription exists and is active, return it
    if (subscriptionData) {
      // Initialize Stripe
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });

      // Get subscription details from Stripe if available
      let stripeSubscription = null;
      let isCancelled = false;
      
      if (subscriptionData.stripe_subscription_id) {
        try {
          stripeSubscription = await stripe.subscriptions.retrieve(
            subscriptionData.stripe_subscription_id
          );
          
          // Check if subscription is scheduled to be cancelled
          isCancelled = stripeSubscription.cancel_at_period_end;
        } catch (stripeError) {
          console.error("Error fetching Stripe subscription:", stripeError);
        }
      }

      return new Response(
        JSON.stringify({
          hasActiveSubscription: true,
          subscription: {
            ...subscriptionData,
            isCancelled,
            stripeDetails: stripeSubscription ? {
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              status: stripeSubscription.status,
            } : null,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ hasActiveSubscription: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
