
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get request body
    const { userId } = await req.json();

    // Check if the user profile exists
    const { data: existingProfile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If profile doesn't exist, create a default one
    if (!existingProfile) {
      const { data: newProfile, error: insertError } = await supabaseClient
        .from('profiles')
        .insert({
          id: userId,
          full_name: null,
          display_name: null,
          bio: null,
          avatar_url: null,
          onboarding_completed: false,
          initial_mood: null,
          primary_intention: null,
          energy_level: null,
          interests: null,
          updated_at: new Date().toISOString()
        })
        .select();

      if (insertError) throw insertError;
      
      return new Response(JSON.stringify({ 
        profile: newProfile[0], 
        created: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      profile: existingProfile, 
      created: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in ensure-profile function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
