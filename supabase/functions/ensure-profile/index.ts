
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the user ID from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw userError || new Error("User not found");
    }

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      throw profileError;
    }

    // If profile doesn't exist, create it
    if (!existingProfile) {
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,
          display_name: user.email?.split('@')[0] || "Sacred Shifter",
          full_name: null,
          bio: null,
          avatar_url: null,
          onboarding_completed: false,
          initial_mood: null,
          primary_intention: null,
          energy_level: null,
          interests: [],
          updated_at: new Date().toISOString(),
          lightbearer_level: 1,
          ascension_title: "Seeker",
          soul_alignment: "Light",
          frequency_signature: "",
          badges: [],
          light_level: 1,
          light_points: 0
        });

      if (insertError) {
        throw insertError;
      }

      // Check if user_credits exists
      const { data: existingCredits, error: creditsError } = await supabaseAdmin
        .from("user_credits")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (creditsError && creditsError.code !== "PGRST116") {
        throw creditsError;
      }

      // If user_credits doesn't exist, create it
      if (!existingCredits) {
        const { error: insertCreditsError } = await supabaseAdmin
          .from("user_credits")
          .insert({
            user_id: user.id,
            balance: 10, // Give new users 10 credits
            last_updated: new Date().toISOString()
          });

        if (insertCreditsError) {
          throw insertCreditsError;
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Profile and credits created successfully",
          profile_created: true,
          credits_created: !existingCredits
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201
        }
      );
    }

    // Profile already exists
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Profile already exists",
        profile_created: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
