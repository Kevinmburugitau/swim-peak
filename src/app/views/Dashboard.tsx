import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Watch, Droplets, Flame, Waves } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAppStore } from '../store/useAppStore';
import { useDeviceSync } from '../hooks/useDeviceSync';
import { useNavigate } from 'react-router';

export const Dashboard = () => {
  const user = useAppStore((state) => state.user);
  const userProfile = useAppStore((state) => state.userProfile);
  const deviceMetrics = useAppStore((state) => state.deviceMetrics);
  const getWeeklyCalories = useAppStore((state) => state.getWeeklyCalories);
  const getUpcomingWorkout = useAppStore((state) => state.getUpcomingWorkout);
  const navigate = useNavigate();

  // Enable device sync simulation
  useDeviceSync();

  const performanceData = getWeeklyCalories();
  const upcomingWorkout = getUpcomingWorkout();
  
  const displayName = user?.name || userProfile.name;

  const handleStartSession = () => {
    if (upcomingWorkout) {
      if ('stroke' in upcomingWorkout) {
        navigate('/water');
      } else {
        navigate('/land');
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-28 px-5 pt-8 bg-slate-950 text-slate-50">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Hello, {displayName}</h1>
          <p className="text-slate-400 mt-1">Ready for your next plunge?</p>
        </div>
        <div className="h-14 w-14 rounded-full border-2 border-cyan-500 overflow-hidden bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <ImageWithFallback src={userProfile.profileImage} alt="Profile" className="h-full w-full object-cover" />
        </div>
      </header>

      {/* Smart Device Widget */}
      <div className="bg-slate-900 rounded-3xl p-5 mb-6 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Watch className="text-cyan-400" size={20} />
            <h2 className="font-semibold text-lg">Garmin Sync Active</h2>
          </div>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
            <Flame className="text-orange-500 mb-1" size={20} />
            <span className="text-xl font-bold">{deviceMetrics.calories.toLocaleString()}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">kcal</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
            <Activity className="text-rose-500 mb-1" size={20} />
            <span className="text-xl font-bold">{deviceMetrics.heartRate}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">bpm</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
            <Droplets className="text-cyan-400 mb-1" size={20} />
            <span className="text-xl font-bold">{deviceMetrics.swolf}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">swolf</span>
          </div>
        </div>
      </div>

      {/* Up Next */}
      {upcomingWorkout && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3">Up Next</h2>
          <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-3xl p-5 text-white shadow-[0_10px_30px_rgba(6,182,212,0.3)] relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 scale-150 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
              <Waves size={140} />
            </div>
            <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm inline-block mb-3">
                {'stroke' in upcomingWorkout ? '16:00 PM' : '17:30 PM'}
              </span>
              <h3 className="text-2xl font-bold mb-1">{upcomingWorkout.name || ('drillName' in upcomingWorkout ? upcomingWorkout.drillName : 'Workout')}</h3>
              <p className="text-cyan-100 text-sm mb-5">
                {'stroke' in upcomingWorkout 
                  ? `${upcomingWorkout.distance}m ${upcomingWorkout.stroke}`
                  : `${upcomingWorkout.duration} min ${upcomingWorkout.type}`
                }
              </p>
              <SplashButton 
                onClick={handleStartSession}
                className="bg-white text-blue-900 font-bold py-3 px-6 rounded-2xl w-full shadow-lg"
              >
                Start Session
              </SplashButton>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-slate-900 rounded-3xl p-5 mb-6 border border-slate-800 shadow-lg">
        <h2 className="font-semibold text-lg mb-4">Weekly Caloric Burn</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs key="defs">
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis key="xaxis" dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                key="tooltip"
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#f8fafc' }}
                itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
              />
              <Area key="area" type="monotone" dataKey="calories" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};