
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [resetMode, setResetMode] = useState(false);
  
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in password reset mode via URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('reset') === 'true') {
      setResetMode(true);
    }
  }, [location]);
  
  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (user && !loading) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin'); 
      navigate(redirectPath);
    }
  }, [user, navigate, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      // Auth context will handle the redirect after successful login
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signUp(email, password, { 
        display_name: name || email.split('@')[0],
        full_name: name
      });
      // Auth context will handle toast notifications and redirects
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setResetMode(false);
      setActiveTab('login');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <Layout pageTitle="Authentication">
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-medium mb-2">Checking authentication status...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if already logged in
  if (user) {
    return null; // Will redirect via useEffect
  }

  // Show password reset form if in reset mode
  if (resetMode) {
    return (
      <Layout pageTitle="Reset Password">
        <div className="container max-w-md mx-auto py-12">
          <Card className="border-purple-200/50 dark:border-purple-800/50 shadow-lg">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
              
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => setResetMode(false)}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Main authentication form (login/signup)
  return (
    <Layout pageTitle="Authentication">
      <div className="container max-w-md mx-auto py-12">
        <Card className="border-purple-200/50 dark:border-purple-800/50 shadow-lg">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome to Sacred Shifter</h1>
            
            <Tabs 
              defaultValue="login" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="login-password" className="block text-sm font-medium">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setResetMode(true)}
                        className="text-xs text-purple-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-name" className="block text-sm font-medium">
                      Name (Optional)
                    </label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500">Minimum 6 characters</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              By signing in, you agree to our
              <button className="text-purple-600 hover:underline ml-1">Terms of Service</button>
              {' '}and{' '}
              <button className="text-purple-600 hover:underline">Privacy Policy</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
