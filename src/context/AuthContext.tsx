
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: ({ email, password }: { email: string; password: string }) => Promise<{ error: any }>;
  signUp: ({ email, password }: { email: string; password: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Set a maximum time for initial auth loading state
    const maxLoadingTimer = setTimeout(() => {
      setLoading(false);
      console.log("Auth loading timed out after 4 seconds - forcing loading state to false");
    }, 4000);

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`Auth state changed: ${event}`, newSession?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else if (newSession) {
        setUser(newSession.user);
        setSession(newSession);
      }
      
      // Update loading state for relevant auth events
      if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
        setLoading(false);
        clearTimeout(maxLoadingTimer); // Clear the timeout if we got a definitive state
      }
    });
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error fetching session:', error.message);
        setLoading(false);
        return;
      }
      
      console.log("Initial session check:", data?.session ? "Found session" : "No active session");
      setSession(data?.session);
      setUser(data?.session?.user ?? null);
      
      // Only set loading to false after we've checked for an existing session
      // and if no definitive auth events have occurred
      setTimeout(() => {
        setLoading(false);
      }, 500); // Small delay to prevent UI flashing if auth event fires right after
    });

    // Cleanup function
    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      clearTimeout(maxLoadingTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      console.log(`Attempting to sign in: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message || "Login failed");
        setLoading(false);
        return { error };
      }
      
      console.log("Sign in successful:", data?.user?.email);
      toast.success("Successfully signed in!");
      
      // Auth state listener will update the state and loading
      // But we'll also set a backup timeout in case the listener doesn't fire
      const backupTimer = setTimeout(() => setLoading(false), 3000);
      
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
      toast.error(error.message || "An unexpected error occurred");
      setLoading(false);
      return { error };
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      console.log(`Attempting to sign up: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        toast.error(error.message || "Registration failed");
        setLoading(false);
        return { error };
      }
      
      console.log("Sign up successful:", data?.user?.email);
      toast.success("Registration successful! Please check your email for confirmation.");
      
      setTimeout(() => setLoading(false), 500);
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      toast.error(error.message || "An unexpected error occurred");
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error(error.message || "Failed to sign out");
      } else {
        console.log("Sign out successful");
        toast.success("Successfully signed out");
        // The onAuthStateChange listener will update the state
      }
      
      setTimeout(() => setLoading(false), 500);
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
