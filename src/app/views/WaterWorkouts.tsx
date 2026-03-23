import React, { useState } from 'react';
import { Waves, Timer, Target, Award, CheckCircle2, Trash2, Play } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';
import { AddWaterWorkoutDialog } from '../components/AddWaterWorkoutDialog';
import { WorkoutSessionDialog } from '../components/WorkoutSessionDialog';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const strokes = [
  { id: 'freestyle', name: 'Freestyle', icon: '🏊' },
  { id: 'butterfly', name: 'Butterfly', icon: '🦋' },
  { id: 'backstroke', name: 'Backstroke', icon: '🔙' },
  { id: 'breaststroke', name: 'Breaststroke', icon: '🐸' }
];

const recommendations = [
  {
    id: 'rec1',
    icon: Timer,
    color: 'blue',
    title: 'Sprint Intervals',
    description: '10 x 50m @ 0:45 pace. Focus on explosive turns and breathing patterns.',
    distance: 500,
    duration: 20,
    pace: 45,
    calories: 180
  },
  {
    id: 'rec2',
    icon: Target,
    color: 'cyan',
    title: 'Drill: Catch & Pull',
    description: '4 x 200m with paddles. Maintain high elbows and long strokes.',
    distance: 800,
    duration: 25,
    pace: 110,
    calories: 220
  }
];

export const WaterWorkouts = () => {
  const [activeStroke, setActiveStroke] = useState('freestyle');
  const [sessionWorkout, setSessionWorkout] = useState<{ id: string; name: string; duration: number } | null>(null);
  const waterWorkouts = useAppStore((state) => state.waterWorkouts);
  const completeWaterWorkout = useAppStore((state) => state.completeWaterWorkout);
  const addWaterWorkout = useAppStore((state) => state.addWaterWorkout);
  const deleteWaterWorkout = useAppStore((state) => state.deleteWaterWorkout);

  const todayWorkouts = waterWorkouts.filter(w => w.date === new Date().toISOString().split('T')[0]);

  const handleStartDrill = (rec: typeof recommendations[0]) => {
    const workout = {
      date: new Date().toISOString().split('T')[0],
      stroke: activeStroke,
      drillName: rec.title,
      distance: rec.distance,
      duration: rec.duration,
      pace: rec.pace,
      calories: rec.calories,
      avgHeartRate: Math.floor(Math.random() * 40) + 120,
      swolf: Math.floor(Math.random() * 20) + 65,
      completed: false
    };
    addWaterWorkout(workout);
    toast.success(`${rec.title} added to your workouts!`);
  };

  const handleCompleteWorkout = (id: string, name: string) => {
    completeWaterWorkout(id);
    toast.success(`${name} completed! 🏊‍♂️`);
  };

  const handleDeleteWorkout = (id: string, name: string) => {
    deleteWaterWorkout(id);
    toast.success(`${name} removed`);
  };

  const handleStartSession = (id: string, name: string, duration: number) => {
    setSessionWorkout({ id, name, duration });
  };

  const handleSessionComplete = () => {
    if (sessionWorkout) {
      completeWaterWorkout(sessionWorkout.id);
      toast.success(`${sessionWorkout.name} completed! 🏊‍♂️`);
      setSessionWorkout(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-28 px-5 pt-8 bg-slate-950 text-slate-50 relative">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1">Water Workouts</h1>
          <p className="text-slate-400 text-sm">Target strokes and crush your pool times.</p>
        </div>
        <AddWaterWorkoutDialog />
      </header>

      {/* Target Strokes */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center gap-2">
          <Waves size={20} /> Target Stroke
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {strokes.map((stroke) => (
            <SplashButton
              key={stroke.id}
              onClick={() => setActiveStroke(stroke.id)}
              className={`min-w-[110px] flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 ${
                activeStroke === stroke.id 
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105' 
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              <span className="text-4xl mb-2">{stroke.icon}</span>
              <span className={`text-sm font-semibold ${activeStroke === stroke.id ? 'text-cyan-400' : ''}`}>{stroke.name}</span>
            </SplashButton>
          ))}
        </div>
      </div>

      {/* Today's Workouts */}
      {todayWorkouts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Today's Sessions</h2>
          <div className="space-y-3">
            {todayWorkouts.map((workout, idx) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-slate-900 p-4 rounded-3xl border border-slate-800 ${
                  workout.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {workout.drillName}
                      {workout.completed && <CheckCircle2 size={20} className="text-cyan-400" />}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {workout.distance}m • {workout.pace}s/100m • {workout.stroke}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-400">{workout.calories}</div>
                    <div className="text-xs text-slate-500">kcal</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!workout.completed && (
                    <>
                      <SplashButton
                        onClick={() => handleStartSession(workout.id, workout.drillName, workout.duration)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={18} />
                        Start
                      </SplashButton>
                      <SplashButton
                        onClick={() => handleCompleteWorkout(workout.id, workout.drillName)}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold py-2.5 px-4 rounded-2xl transition-colors"
                      >
                        Complete
                      </SplashButton>
                    </>
                  )}
                  <SplashButton
                    onClick={() => handleDeleteWorkout(workout.id, workout.drillName)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-2xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </SplashButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <h2 className="text-lg font-semibold mt-4 mb-3">AI Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg flex items-start space-x-4 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${rec.color}-500/5 rounded-full blur-3xl`}></div>
            <div className={`bg-${rec.color}-500/20 p-3 rounded-2xl text-${rec.color}-400`}>
              <rec.icon size={24} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-lg mb-1 text-white">{rec.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{rec.description}</p>
              <SplashButton 
                onClick={() => handleStartDrill(rec)}
                className={`bg-${rec.color}-600 hover:bg-${rec.color}-500 text-white text-sm font-semibold py-3 px-4 rounded-2xl w-full transition-colors shadow-md`}
              >
                Start Drill
              </SplashButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pool Stats */}
      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-white">
            <Award size={20} className="text-yellow-400"/> Latest Pool Stats
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/50">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Distance</div>
            <div className="text-2xl font-bold text-cyan-400">
              {todayWorkouts.filter(w => w.completed).reduce((sum, w) => sum + w.distance, 0) / 1000 || 2.5} <span className="text-sm font-normal text-slate-300">km</span>
            </div>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/50">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Avg Pace</div>
            <div className="text-2xl font-bold text-cyan-400">
              {Math.floor(todayWorkouts.filter(w => w.completed).reduce((sum, w) => sum + w.pace, 0) / Math.max(todayWorkouts.filter(w => w.completed).length, 1)) || 92}s <span className="text-sm font-normal text-slate-300">/100m</span>
            </div>
          </div>
        </div>
      </div>

      <WorkoutSessionDialog
        open={sessionWorkout !== null}
        onOpenChange={(open) => !open && setSessionWorkout(null)}
        workoutName={sessionWorkout?.name || ''}
        duration={sessionWorkout?.duration || 0}
        onComplete={handleSessionComplete}
      />
    </div>
  );
};