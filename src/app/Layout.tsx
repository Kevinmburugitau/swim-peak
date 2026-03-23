import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { useNotifications } from './hooks/useNotifications';
import { useAutoSave } from './hooks/useAutoSave';
import { useAppStore } from './store/useAppStore';
import { supabase } from '../utils/supabase/client';

export const Layout = () => {
  // Enable notification system
  useNotifications();
  
  // Enable auto-save
  useAutoSave();
  
  const navigate = useNavigate();
  const { isAuthenticated, setAuthState, loadUserData, accessToken } = useAppStore();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAuthState(session.access_token, {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'Swimmer',
        });
        // Load user data from server
        await loadUserData(session.access_token);
      } else if (!isAuthenticated) {
        navigate('/login');
      }
    };

    checkSession();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center font-sans sm:p-4">
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-[90vh] bg-slate-950 sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col sm:border-[8px] border-slate-900">
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
        <BottomNav />
      </div>
      <Toaster 
        position="top-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#0f172a',
            border: '1px solid #1e293b',
            color: '#f8fafc'
          }
        }}
      />
    </div>
  );
};