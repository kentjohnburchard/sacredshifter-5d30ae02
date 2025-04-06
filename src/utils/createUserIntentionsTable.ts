
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates the user_intentions table if it doesn't exist
 */
export const createUserIntentionsTable = async () => {
  try {
    // First check if the table exists
    const { data, error } = await supabase
      .from('user_intentions')
      .select('id')
      .limit(1);
    
    if (!error) {
      console.log("user_intentions table already exists");
      return true;
    }
    
    // Table doesn't exist, try to create it using RPC
    const { error: createError } = await supabase.rpc('create_user_intentions_table');
    
    if (createError) {
      console.error("Error creating user_intentions table:", createError);
      toast.error("Failed to set up intentions feature");
      return false;
    }
    
    console.log("Successfully created user_intentions table");
    return true;
  } catch (err) {
    console.error("Unexpected error creating user_intentions table:", err);
    return false;
  }
};
