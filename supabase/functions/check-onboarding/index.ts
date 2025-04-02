
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authorize the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");
      
      if (!userId) {
        throw new Error("User ID is required if not authenticated");
      }
      
      // Check if the user has completed onboarding
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ data, error: null }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // If authorization header is present, validate the token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) throw authError;
    
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userData.user?.id)
      .single();
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ data, error: null }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ data: null, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
