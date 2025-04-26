
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

    // First set up the auth state listener with a synchronous callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`Auth state changed: ${event}`, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Then fetch the current session (after listener is set up)
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("Initial session check:", data?.session?.user?.email);
      if (error) {
        console.error('Error fetching session:', error.message);
        setSession(null);
        setUser(null);
      } else if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log("User authenticated:", data.session.user.email);
      } else {
        console.log("No active session found");
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    console.log(`Attempting to sign in: ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        return { error };
      }
      
      console.log("Sign in successful:", data?.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
      return { error };
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    console.log(`Attempting to sign up: ${email}`);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        return { error };
      }
      
      console.log("Sign up successful:", data?.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log("Signing out");
    try {
      await supabase.auth.signOut();
      console.log("Sign out successful");
    } catch (error) {
      console.error('Error signing out:', error);
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
