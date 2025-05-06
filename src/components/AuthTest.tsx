
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuthTest: React.FC = () => {
  const { user, loading, error, signOut } = useAuth();
  
  useEffect(() => {
    // Log the current auth state
    const logAuthState = async () => {
      console.log("Auth Test Component - User:", user?.email || "Not logged in");
      console.log("Auth Test Component - Loading:", loading);
      console.log("Auth Test Component - Error:", error?.message || "No error");
      
      // Check session directly from supabase
      const { data } = await supabase.auth.getSession();
      console.log("Supabase session check:", data.session?.user?.email || "No session");
    };
    
    logAuthState();
  }, [user, loading, error]);
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Auth State:</h3>
            <p>Status: {loading ? "Loading..." : (user ? "Authenticated" : "Not authenticated")}</p>
            {error && <p className="text-red-500">Error: {error.message}</p>}
          </div>
          
          {user && (
            <div>
              <h3 className="font-medium">User Info:</h3>
              <p>Email: {user.email}</p>
              <p>ID: {user.id}</p>
              <p>Created: {new Date(user.created_at).toLocaleString()}</p>
            </div>
          )}
          
          <div className="pt-4">
            {user ? (
              <Button 
                onClick={() => signOut()} 
                variant="destructive"
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = "/auth"} 
                variant="default"
              >
                Go to Login
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
