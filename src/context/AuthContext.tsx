
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

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
      
      // Update state synchronously within the callback
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Then fetch the current session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error.message);
        } else if (data?.session) {
          console.log("Initial session found:", data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log("No active session found");
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
        setLoading(false);
        return { error };
      }
      
      console.log("Sign in successful:", data?.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
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
        setLoading(false);
        return { error };
      }
      
      console.log("Sign up successful:", data?.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log("Signing out");
    try {
      setLoading(true);
      await supabase.auth.signOut();
      console.log("Sign out successful");
      // Don't manually update state here, the onAuthStateChange will handle it
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
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
