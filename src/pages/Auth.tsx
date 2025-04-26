
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Info, Key } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'test'>('login');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Test user accounts
  const testUsers = [
    { email: 'test@sacredshifter.com', password: 'test123', label: 'Standard Test User' },
    { email: 'admin@sacredshifter.com', password: 'admin123', label: 'Admin Test User' },
    { email: 'demo@sacredshifter.com', password: 'demo123', label: 'Demo User' }
  ];

  // Check if we should show signup tab by default
  useEffect(() => {
    console.log("Auth page: Checking params and user state");
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    } else if (searchParams.get('test') === 'true') {
      setActiveTab('test');
    }
  }, [searchParams]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    console.log("Auth page: User authenticated?", !!user);
    if (user) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      console.log(`Auth page: User authenticated, redirecting to ${redirectPath}`);
      sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored path
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Auth page: Attempting login for ${email}`);
    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message);
      } else {
        console.log("Login successful, waiting for auth state update");
        toast.success('Successfully signed in!');
        // The redirect will happen in useEffect when user state updates
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Auth page: Attempting signup for ${email}`);
    setLoading(true);
    try {
      const { error } = await signUp({ email, password });
      if (error) {
        console.error("Signup error:", error.message);
        toast.error(error.message);
      } else {
        console.log("Signup successful");
        toast.success('Registration successful! Please check your email for confirmation.');
      }
    } catch (error: any) {
      console.error("Signup exception:", error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const loginWithTestUser = async (testEmail: string, testPassword: string) => {
    console.log(`Auth page: Attempting login with test account: ${testEmail}`);
    setLoading(true);
    try {
      const { error } = await signIn({ 
        email: testEmail, 
        password: testPassword 
      });
      
      if (error) {
        console.error("Test login error:", error);
        toast.error(`Test login failed: ${error.message}`);
      } else {
        console.log("Test login successful");
        toast.success(`Logged in as test user: ${testEmail}`);
        // The redirect will happen in useEffect when user state updates
      }
    } catch (error: any) {
      console.error("Test login exception:", error);
      toast.error(error.message || 'Failed to sign in with test account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Sacred Shifter
          </h1>
          <p className="text-gray-600 mt-2">Reconnect with your highest self</p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup' | 'test')}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="test">Test Users</TabsTrigger>
          </TabsList>
          
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
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
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
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="test">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-gray-600">These accounts are for testing purposes only.</p>
              </div>
              
              <Separator />
              
              {testUsers.map((testUser, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{testUser.label}</p>
                      <p className="text-sm text-gray-500">{testUser.email}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => loginWithTestUser(testUser.email, testUser.password)}
                      disabled={loading}
                      className="flex gap-2 items-center"
                    >
                      <Key className="h-4 w-4" />
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
          <p>By continuing, you agree to Sacred Shifter's Terms of Service and Privacy Policy.</p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
