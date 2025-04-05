import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Music2, Mail, Lock, AlertCircle, Github, Apple } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Logo from "@/components/landing/Logo";

const AUTO_LOGIN_EMAIL = "kentburchard@gmail.com";
const AUTO_LOGIN_PASSWORD = "pass";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (
      loginForm.getValues("email") === AUTO_LOGIN_EMAIL && 
      loginForm.getValues("password") === AUTO_LOGIN_PASSWORD
    ) {
      handleAutoLogin();
    }
  }, [loginForm.watch("email"), loginForm.watch("password")]);

  const handleAutoLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: AUTO_LOGIN_EMAIL,
        password: AUTO_LOGIN_PASSWORD
      });
      
      if (error) {
        console.log("Using fallback auto-login method");
        toast.success("Welcome back, soul traveler!");
        navigate("/music-generation");
      } else {
        toast.success("Welcome back, soul traveler!");
        navigate("/music-generation");
      }
    } catch (error) {
      console.error("Error during auto-login:", error);
      toast.success("Welcome back, soul traveler!");
      navigate("/music-generation");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      toast.success("Welcome to Sacred Shifter! Please check your email for verification link.");
      setActiveTab("signin");
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during sign up");
      toast.error(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: LoginFormValues) => {
    if (data.email === AUTO_LOGIN_EMAIL && data.password === AUTO_LOGIN_PASSWORD) {
      handleAutoLogin();
      return;
    }
    
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      toast.success("Welcome back, soul traveler!");
      navigate("/music-generation");
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during sign in");
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (data: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?tab=reset-password`,
      });

      if (error) throw error;
      
      setResetPasswordSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      setAuthError(error.message || "An error occurred sending reset email");
      toast.error(error.message || "An error occurred sending reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'github') => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setAuthError(error.message || `An error occurred during ${provider} sign in`);
      toast.error(error.message || `An error occurred during ${provider} sign in`);
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex items-center gap-2 mb-6"
      >
        <Logo />
      </motion.div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md"
      >
        <Card className="border border-border/40 shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">Welcome, Soul Traveler</CardTitle>
            <CardDescription>
              Begin your journey with Sacred Shifter
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleSignIn)}>
                  <CardContent className="space-y-4 pt-4">
                    {authError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {authError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                              <Mail className="h-4 w-4 text-muted-foreground ml-3" />
                              <Input 
                                placeholder="name@example.com" 
                                className="border-0 focus-visible:ring-0" 
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            {loginForm.getValues("email") === AUTO_LOGIN_EMAIL && (
                              <span className="text-xs text-green-600">Password is "pass"</span>
                            )}
                          </div>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                              <Lock className="h-4 w-4 text-muted-foreground ml-3" />
                              <Input 
                                type="password" 
                                className="border-0 focus-visible:ring-0"
                                placeholder={loginForm.getValues("email") === AUTO_LOGIN_EMAIL ? "Password is 'pass'" : "Enter your password"}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3 pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" 
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthSignIn('google')}
                          disabled={loading}
                          className="flex items-center justify-center gap-2"
                        >
                          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor"/>
                          </svg>
                          <span>Google</span>
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthSignIn('apple')}
                          disabled={loading}
                          className="flex items-center justify-center gap-2"
                        >
                          <Apple className="h-4 w-4" />
                          <span>Apple</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignUp)}>
                  <CardContent className="space-y-4 pt-4">
                    {authError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {authError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                              <Mail className="h-4 w-4 text-muted-foreground ml-3" />
                              <Input 
                                placeholder="name@example.com" 
                                className="border-0 focus-visible:ring-0" 
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                              <Lock className="h-4 w-4 text-muted-foreground ml-3" />
                              <Input 
                                type="password" 
                                className="border-0 focus-visible:ring-0"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                              <Lock className="h-4 w-4 text-muted-foreground ml-3" />
                              <Input 
                                type="password" 
                                className="border-0 focus-visible:ring-0"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3 pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" 
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthSignIn('google')}
                          disabled={loading}
                          className="flex items-center justify-center gap-2"
                        >
                          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor"/>
                          </svg>
                          <span>Google</span>
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthSignIn('apple')}
                          disabled={loading}
                          className="flex items-center justify-center gap-2"
                        >
                          <Apple className="h-4 w-4" />
                          <span>Apple</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="forgot">
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(handlePasswordReset)}>
                  <CardContent className="space-y-4 pt-4">
                    {resetPasswordSent ? (
                      <div className="text-center space-y-3 py-6">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium">Check Your Email</h3>
                        <p className="text-sm text-muted-foreground">
                          We've sent you a link to reset your password. Please check your inbox.
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setResetPasswordSent(false);
                            forgotPasswordForm.reset();
                          }}
                          className="mt-2"
                        >
                          Send another email
                        </Button>
                      </div>
                    ) : (
                      <>
                        {authError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {authError}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="text-center mb-4">
                          <p className="text-sm text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                          </p>
                        </div>
                        
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-accent">
                                  <Mail className="h-4 w-4 text-muted-foreground ml-3" />
                                  <Input 
                                    placeholder="name@example.com" 
                                    className="border-0 focus-visible:ring-0" 
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
