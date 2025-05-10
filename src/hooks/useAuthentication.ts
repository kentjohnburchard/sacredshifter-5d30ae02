
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  
  // Check for existing session on mount
  useEffect(() => {
    async function getSession() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
        }
      } catch (e: any) {
        console.error('Error checking authentication:', e);
        setError({ message: e.message || 'Authentication error', status: e.status });
      } finally {
        setLoading(false);
      }
    }
    
    getSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (e: any) {
      console.error('Sign in error:', e);
      setError({ message: e.message || 'Sign in failed', status: e.status });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: object) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (e: any) {
      console.error('Sign up error:', e);
      setError({ message: e.message || 'Sign up failed', status: e.status });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (e: any) {
      console.error('Sign out error:', e);
      setError({ message: e.message || 'Sign out failed', status: e.status });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (e: any) {
      console.error('Password reset error:', e);
      setError({ message: e.message || 'Password reset failed', status: e.status });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  };
}

// Also export as useAuth to be compatible with both import forms
export const useAuth = useAuthentication;
