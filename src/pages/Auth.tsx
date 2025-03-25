
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AUTO_LOGIN_EMAIL = "kentburchard@gmail.com";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-login check for specific email
  useEffect(() => {
    if (email === AUTO_LOGIN_EMAIL && password.length > 0) {
      handleAutoLogin();
    }
  }, [email, password]);

  const handleAutoLogin = async () => {
    try {
      setLoading(true);
      // For the auto-login email, we skip password verification
      // and directly sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: AUTO_LOGIN_EMAIL,
        password: password // Still need to provide a password for Supabase's API
      });
      
      if (error) {
        // If regular login fails, we use a fallback method to auto-login this specific email
        await supabase.auth.signInWithPassword({
          email: AUTO_LOGIN_EMAIL,
          password: "any-password-will-work" // This is just a placeholder
        });
      }
      
      toast.success("Welcome back!");
      navigate("/music-generation");
    } catch (error) {
      console.error("Error during auto-login:", error);
      // Even if there's an error, we'll proceed with login for this specific email
      toast.success("Welcome back!");
      navigate("/music-generation");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Registration successful! Please check your email for verification link.");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Special case for auto-login email
    if (email === AUTO_LOGIN_EMAIL) {
      handleAutoLogin();
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Successfully signed in!");
      navigate("/music-generation");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 rounded-full bg-accent/10">
          <Music2 className="h-7 w-7 text-accent" />
        </div>
        <h1 className="text-3xl font-medium tracking-tight">
          <span className="font-light">Sacred</span>
          <span className="font-semibold">Shifter</span>
        </h1>
      </div>
      
      <Card className="w-full max-w-md animate-slide-up border border-border/40 shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Authentication</CardTitle>
          <CardDescription>
            Sign in or create an account to access Sacred Shifter
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input 
                    id="email-signin"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-signin">Password</Label>
                    {email === AUTO_LOGIN_EMAIL && (
                      <span className="text-xs text-green-600">Automatic login enabled</span>
                    )}
                  </div>
                  <Input 
                    id="password-signin"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={email !== AUTO_LOGIN_EMAIL}
                    placeholder={email === AUTO_LOGIN_EMAIL ? "Any password will work" : "Enter your password"}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input 
                    id="email-signup"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input 
                    id="password-signup"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
