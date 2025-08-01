import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Hotel, Mail, Lock, Building2 } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { signIn, signUp, user, isSuperAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();


  // Redirect if already authenticated
  useEffect(() => {
    // Only redirect if user exists and we're not loading roles
    if (user && !authLoading) {
      if (isSuperAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isSuperAdmin, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your hotel dashboard."
        });
        // Don't navigate here - let the useEffect handle role-based navigation
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then sign in."
        });
        setActiveTab('signin');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoUser = async () => {
    setLoading(true);
    try {
      const demoEmail = 'demo@hotel.com';
      const demoPassword = 'demo123';
      
      const { error } = await signIn(demoEmail, demoPassword);
      if (error) {
        toast({
          title: "Demo user not found",
          description: "Please contact administrator.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Demo login successful!",
          description: "Welcome to the hotel dashboard."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Demo login failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoAdmin = async () => {
    setLoading(true);
    try {
      const adminEmail = 'admin@hotel.com';
      const adminPassword = 'admin123';
      
      const { error } = await signIn(adminEmail, adminPassword);
      if (error) {
        toast({
          title: "Demo admin not found",
          description: "Please contact administrator.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Demo admin login successful!",
          description: "Welcome to the admin dashboard."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Demo admin login failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hotel Dashboard</h1>
            <p className="text-muted-foreground">Manage your luxury hotels with elegance</p>
          </div>
        </div>

        {/* Demo credentials banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Hotel className="h-4 w-4 text-primary" />
                <span className="font-medium">Demo Accounts:</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>Hotel User:</strong> demo@hotel.com / demo123</div>
                <div><strong>Admin User:</strong> admin@hotel.com / admin123</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createDemoUser}
                  disabled={loading}
                  className="bg-background/50"
                >
                  {loading ? 'Loading...' : 'Demo User'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createDemoAdmin}
                  disabled={loading}
                  className="bg-background/50"
                >
                  {loading ? 'Loading...' : 'Demo Admin'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth form */}
        <Card className="elegant-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'signin' 
                ? 'Sign in to access your hotel dashboard' 
                : 'Create a new account to get started'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Professional hotel management made simple</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;