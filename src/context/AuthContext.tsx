
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: { message: string; status?: number } | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthentication();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
