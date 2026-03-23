import { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../utils/supabase/client';
import { projectId } from '/utils/supabase/info';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, LogOut, Save, Settings, Loader2 } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';

export function Profile() {
  const navigate = useNavigate();
  const { user, accessToken, userProfile, updateUserProfile, logout } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(userProfile.dailyCalorieTarget);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      // Update profile on server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-29992991/user/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error('Failed to update profile: ' + (error.error || 'Unknown error'));
        return;
      }

      // Update local profile
      updateUserProfile({ name, dailyCalorieTarget });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile exception:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-blue-900 to-cyan-800 p-4 pb-24">
      <div className="max-w-2xl mx-auto pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 border-blue-400/20 bg-white/95 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userProfile.profileImage} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-navy-900">{name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings Card */}
        <Card className="border-blue-400/20 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-navy-900">Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-navy-900">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-900">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="border-blue-200 bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="calorieTarget" className="text-navy-900">Daily Calorie Target</Label>
              <Input
                id="calorieTarget"
                type="number"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(Number(e.target.value))}
                className="border-blue-200 focus:border-blue-500"
                min="1000"
                max="10000"
              />
              <p className="text-xs text-gray-500">Set your daily calorie consumption goal</p>
            </div>

            <div className="flex gap-3 pt-4">
              <SplashButton
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </SplashButton>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="mt-6 border-blue-400/20 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-navy-900 text-sm">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="text-navy-900 font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type:</span>
                <span className="text-navy-900">Free</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
