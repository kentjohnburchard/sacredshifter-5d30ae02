import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, UserResponse } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ExtendedProfile } from '@/types/supabaseCustomTypes';

export interface AuthUser extends User {
  created_at: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    display_name?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: ExtendedProfile | null;
  loading: boolean;
  error: { message: string; status?: number } | null;
  signIn: (email: string, password: string) => Promise<{success: boolean; error?: any}>;
  signOut: () => Promise<{success: boolean; error?: any}>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{success: boolean; error?: any}>;
  resetPassword: (email: string) => Promise<{success: boolean; error?: any}>;
  updateProfile: (data: Partial<ExtendedProfile>) => Promise<void>;
  isAdmin: () => boolean;
  isPremium: () => boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status?: number } | null>(null);
  const navigate = useNavigate();
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as ExtendedProfile);
      }
    } catch (err) {
      console.error('Exception fetching profile:', err);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user as AuthUser);
          
          // Fetch profile data after a short delay to avoid potential race conditions
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          setSession(data.session);
          setUser(data.session.user as AuthUser);
          await fetchProfile(data.session.user.id);
        }
      } catch (err: any) {
        console.error('Error getting session:', err);
        setError({ message: err.message || 'Error initializing authentication' });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
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
        console.error('Sign in error:', error);
        setError({ message: error.message, status: error.status });
        toast.error(error.message || 'Failed to sign in');
        return { success: false, error };
      }
      
      if (data.user) {
        toast.success('Signed in successfully!');
        // Redirect happens automatically via auth state change
        return { success: true, data };
      }
      
      return { success: false, error: { message: 'No user returned' } };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign in';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
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
          data: metadata || {}
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setError({ message: error.message, status: error.status });
        toast.error(error.message || 'Failed to sign up');
        return { success: false, error };
      }

      // Check if email confirmation is required
      if (data.session === null) {
        toast.info('Please check your email for the confirmation link');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign up';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
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
        console.error('Sign out error:', error);
        setError({ message: error.message, status: error.status });
        toast.error(error.message || 'Failed to sign out');
        return { success: false, error };
      }
      
      toast.success('Signed out successfully');
      navigate('/');
      return { success: true };
    } catch (err: any) {
      console.error('Sign out exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign out';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });
      
      if (error) {
        setError({ message: error.message, status: error.status });
        toast.error(error.message || 'Failed to send password reset email');
        return { success: false, error };
      }
      
      toast.success('Password reset email sent. Please check your inbox.');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError({ message: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<ExtendedProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      await fetchProfile(user.id);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError({ message: err.message || 'Failed to update profile' });
      toast.error(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for checking user role and premium status
  const isAdmin = (): boolean => {
    return profile?.role === 'admin';
  };

  const isPremium = (): boolean => {
    return !!profile?.is_premium;
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateProfile,
    isAdmin,
    isPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
