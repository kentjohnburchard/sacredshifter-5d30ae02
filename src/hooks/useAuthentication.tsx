
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

interface AuthError {
  message: string;
  status?: number;
}

export function useAuthentication() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST (this order is important)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Clear errors on successful auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setError(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error getting session:", err);
        setError({ message: "Failed to initialize authentication" });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError({ message: error.message });
        toast.error(error.message);
        return { success: false, error };
      }
      
      toast.success("Signed in successfully!");
      
      // Check for redirect path from session storage
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
      
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during sign in";
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, metadata?: object) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });
      
      if (error) {
        setError({ message: error.message });
        toast.error(error.message);
        return { success: false, error };
      }
      
      // Check if email confirmation is required
      if (data.session === null) {
        toast.info("Please check your email for confirmation link");
      } else {
        toast.success("Account created successfully!");
        navigate('/');
      }
      
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during sign up";
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError({ message: error.message });
        toast.error(error.message);
        return { success: false, error };
      }
      
      toast.success("Signed out successfully");
      navigate('/');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during sign out";
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth?reset=true'
      });
      
      if (error) {
        setError({ message: error.message });
        toast.error(error.message);
        return { success: false, error };
      }
      
      toast.success("Password reset email sent. Please check your inbox.");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  };
}
