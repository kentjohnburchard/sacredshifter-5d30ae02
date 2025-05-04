import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Info, Key, AlertCircle, Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "test">("login");
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Test user accounts
  const testUsers = [
    { email: "test@sacredshifter.com", password: "test123", label: "Standard Test User" },
    { email: "admin@sacredshifter.com", password: "admin123", label: "Admin Test User" },
    { email: "demo@sacredshifter.com", password: "demo123", label: "Demo User" },
  ];

  // Check if we should show signup tab by default
  useEffect(() => {
    console.log("Auth page: Checking params and user state");
    if (searchParams.get("signup") === "true") {
      setActiveTab("signup");
    } else if (searchParams.get("test") === "true") {
      setActiveTab("test");
    }
  }, [searchParams]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    console.log("Auth page: User authenticated?", !!user, "Auth loading?", authLoading);
    
    // Only redirect if auth is not loading and we have a user
    if (user && !authLoading) {
      // Get redirect path or default to dashboard
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      console.log(`Auth page: User authenticated, redirecting to ${redirectPath}`);
      sessionStorage.removeItem("redirectAfterLogin"); // Clear the stored path
      
      // Use a small timeout to prevent potential race conditions
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    }
  }, [user, authLoading, navigate]);

  // If authentication is taking too long, reset the submission state
  useEffect(() => {
    if (isSubmitting) {
      const resetTimer = setTimeout(() => {
        console.log("Auth request taking too long, resetting submission state");
        setIsSubmitting(false);
      }, 8000); // Reset after 8 seconds max
      
      return () => clearTimeout(resetTimer);
    }
  }, [isSubmitting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple simultaneous requests
    
    console.log(`Auth page: Attempting login for ${email}`);
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Login failed");
        setIsSubmitting(false);
      }
      // Don't set isSubmitting to false on success - we'll be redirected
      // But we do set a backup timeout in case redirection doesn't happen
      else {
        // Safety timeout to reset button if redirect doesn't happen
        setTimeout(() => setIsSubmitting(false), 5000);
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(error.message || "Failed to sign in");
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple simultaneous requests
    
    console.log(`Auth page: Attempting signup for ${email}`);
    setIsSubmitting(true);
    
    try {
      const { error } = await signUp({ email, password });
      if (error) {
        console.error("Signup error:", error.message);
        toast.error(error.message || "Signup failed");
        setIsSubmitting(false);
      } else {
        console.log("Signup successful");
        toast.success("Registration successful! Please check your email for confirmation.");
        // Wait a moment and then switch to login tab
        setTimeout(() => {
          setActiveTab("login");
          setIsSubmitting(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Signup exception:", error);
      toast.error(error.message || "Failed to sign up");
      setIsSubmitting(false);
    }
  };

  const loginWithTestUser = async (testEmail: string, testPassword: string) => {
    if (isSubmitting) return; // Prevent multiple simultaneous requests
    
    console.log(`Auth page: Attempting login with test account: ${testEmail}`);
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        console.error("Test login error:", error);
        toast.error(`Test login failed: ${error.message}`);
        setIsSubmitting(false);
      }
      // Safety timeout to reset button if redirect doesn't happen
      else {
        setTimeout(() => setIsSubmitting(false), 5000);
      }
    } catch (error: any) {
      console.error("Test login exception:", error);
      toast.error(error.message || "Failed to sign in with test account");
      setIsSubmitting(false);
    }
  };

  // Show loading state when authentication is in progress
  if (authLoading && user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Shifter
          </h1>
          <p className="text-gray-600 mt-2">Reconnect with your highest self</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup" | "test")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="test">Test Users</TabsTrigger>
          </TabsList>

          {/* Display auth in progress indicator */}
          {isSubmitting && (
            <div className="my-3 py-2 px-3 bg-purple-50 text-purple-700 text-sm rounded-md border border-purple-200">
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing authentication request...</span>
              </div>
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-white/90 text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-white/90 text-gray-800"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-white/90 text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-white/90 text-gray-800"
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-gray-600">
                  These accounts are for testing purposes only.
                </p>
              </div>

              <Separator className="my-2" />

              {testUsers.map((testUser, index) => (
                <div key={index} className="p-3 border rounded-lg bg-white/70">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{testUser.label}</p>
                      <p className="text-sm text-gray-500">{testUser.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        loginWithTestUser(testUser.email, testUser.password)
                      }
                      disabled={isSubmitting}
                      className="flex gap-2 items-center"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4" />
                      )}
                      Login
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="font-medium">Password:</span>
                    <span className="ml-2">{testUser.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to Sacred Shifter's Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
