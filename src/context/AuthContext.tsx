
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

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`Auth state changed: ${event}`, newSession?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else if (newSession) {
        // For SIGNED_IN or TOKEN_REFRESHED
        setUser(newSession.user);
        setSession(newSession);
      }
      
      // Only update loading to false when we have a definite auth state
      if (event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    // Then fetch the current session
    const initializeAuth = async () => {
      try {
        console.log("Fetching current session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error.message);
        } else {
          console.log("Initial session check:", data?.session ? "Found session" : "No active session");
          setSession(data?.session);
          setUser(data?.session?.user ?? null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    console.log(`Attempting to sign in: ${email}`);
    setLoading(true);
    
    try {
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
      
      // Auth state listener will update the state
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
      toast.error(error.message || "An unexpected error occurred");
      setLoading(false);
      return { error };
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    console.log(`Attempting to sign up: ${email}`);
    setLoading(true);
    
    try {
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
      
      // We don't automatically log in after signup since email confirmation may be required
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
    console.log("Signing out");
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error(error.message || "Failed to sign out");
      } else {
        console.log("Sign out successful");
        toast.success("Successfully signed out");
        // The onAuthStateChange listener will update the state
      }
      
      // Delay to allow state updates to propagate
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
