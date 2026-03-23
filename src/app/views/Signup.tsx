import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { supabase } from '../../utils/supabase/client';
import { projectId } from '/utils/supabase/info';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Waves, Loader2 } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthState } = useAppStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Call server to create user
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-29992991/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error('Signup failed: ' + (result.error || 'Unknown error'));
        setLoading(false);
        return;
      }

      // Now sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Account created but login failed: ' + error.message);
        navigate('/login');
        setLoading(false);
        return;
      }

      if (data.session) {
        setAuthState(data.session.access_token, {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || name,
        });

        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Signup exception:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-blue-900 to-cyan-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Swimmer Pro</h1>
          <p className="text-blue-200">Track, Train, Triumph</p>
        </div>

        <Card className="border-blue-400/20 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-navy-900">Create Account</CardTitle>
            <CardDescription>Start your swimming journey today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-navy-900">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy-900">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="swimmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-navy-900">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-navy-900">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <SplashButton
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </SplashButton>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
