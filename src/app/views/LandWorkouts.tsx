import React, { useState } from 'react';
import { Dumbbell, PersonStanding, Flame, CheckCircle2, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';
import { AddLandWorkoutDialog } from '../components/AddLandWorkoutDialog';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const muscles = ['Lats', 'Core', 'Shoulders', 'Legs', 'Triceps'];

export const LandWorkouts = () => {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['Lats', 'Core']);
  const landWorkouts = useAppStore((state) => state.landWorkouts);
  const completeLandWorkout = useAppStore((state) => state.completeLandWorkout);
  const deleteLandWorkout = useAppStore((state) => state.deleteLandWorkout);

  const todayWorkouts = landWorkouts.filter(w => w.date === new Date().toISOString().split('T')[0]);
  const strengthWorkouts = todayWorkouts.filter(w => w.type === 'strength');
  const cardioWorkouts = todayWorkouts.filter(w => w.type === 'cardio');

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(prev => 
      prev.includes(m) ? prev.filter(i => i !== m) : [...prev, m]
    );
  };

  const handleCompleteWorkout = (id: string, name: string) => {
    completeLandWorkout(id);
    toast.success(`${name} completed! 💪`);
  };

  const handleDeleteWorkout = (id: string, name: string) => {
    deleteLandWorkout(id);
    toast.success(`${name} removed`);
  };

  return (
    <div className="h-full overflow-y-auto pb-28 px-5 pt-8 bg-slate-950 text-slate-50 relative">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dryland & Gym</h1>
          <p className="text-slate-400 text-sm">Build strength outside to swim faster inside.</p>
        </div>
        <AddLandWorkoutDialog>
          <SplashButton className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-3 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Plus size={24} />
          </SplashButton>
        </AddLandWorkoutDialog>
      </header>

      {/* Muscle Isolation */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-400">
          Target Muscle Groups
        </h2>
        <div className="flex flex-wrap gap-2">
          {muscles.map(m => (
            <SplashButton
              key={m}
              onClick={() => toggleMuscle(m)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                selectedMuscles.includes(m)
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {m}
            </SplashButton>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Gym Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-orange-400">
            <Dumbbell size={22} className="stroke-[2.5px]" />
            <h2 className="text-xl font-bold text-white">Gym Plan (Strength)</h2>
          </div>
          
          {strengthWorkouts.length > 0 ? (
            <div className="space-y-4">
              {strengthWorkouts.map((workout, idx) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl ${
                    workout.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1 flex items-center gap-2">
                        {workout.name}
                        {workout.completed && <CheckCircle2 size={20} className="text-cyan-400" />}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium">
                        {workout.duration} min • {workout.targetMuscles.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-400">{workout.calories}</div>
                      <div className="text-xs text-slate-500">kcal</div>
                    </div>
                  </div>
                  
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                          <span className="font-semibold text-sm text-slate-200">{ex.name}</span>
                          <span className="text-[11px] font-bold tracking-wide uppercase text-cyan-400 bg-cyan-900/40 px-3 py-1.5 rounded-lg border border-cyan-800/50">
                            {ex.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {!workout.completed && (
                      <SplashButton
                        onClick={() => handleCompleteWorkout(workout.id, workout.name)}
                        className="flex-1 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                      >
                        <CheckCircle2 size={20} />
                        Log Workout
                      </SplashButton>
                    )}
                    <SplashButton
                      onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-2xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </SplashButton>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">Swimmer's Core & Back</h3>
                  <p className="text-slate-400 text-sm font-medium">45 min • Based on selected muscles</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {[
                  { name: 'Lat Pulldowns', reps: '3 sets of 12' },
                  { name: 'Plank Variations', reps: '4 sets of 1 min' },
                  { name: 'Medicine Ball Throws', reps: '3 sets of 15' }
                ].map((ex, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                    <span className="font-semibold text-sm text-slate-200">{ex.name}</span>
                    <span className="text-[11px] font-bold tracking-wide uppercase text-cyan-400 bg-cyan-900/40 px-3 py-1.5 rounded-lg border border-cyan-800/50">
                      {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
              
              <AddLandWorkoutDialog>
                <SplashButton className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-md text-white">
                  <CheckCircle2 size={20} className="text-cyan-400" />
                  Log Workout
                </SplashButton>
              </AddLandWorkoutDialog>
            </div>
          )}
        </section>

        {/* Dryland Cardio */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-green-400">
            <PersonStanding size={22} className="stroke-[2.5px]" />
            <h2 className="text-xl font-bold text-white">Dryland (Cardio)</h2>
          </div>
          
          {cardioWorkouts.length > 0 ? (
            <div className="space-y-4">
              {cardioWorkouts.map((workout, idx) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden ${
                    workout.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                    <Flame size={200} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-xl text-white mb-1 flex items-center gap-2">
                      {workout.name}
                      {workout.completed && <CheckCircle2 size={20} className="text-cyan-400" />}
                    </h3>
                    <p className="text-slate-400 text-sm mb-5 font-medium">Build baseline aerobic capacity.</p>
                    
                    <div className="flex gap-6 mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Duration</div>
                        <div className="font-bold text-lg text-green-400">{workout.duration} <span className="text-sm font-normal text-slate-300">min</span></div>
                      </div>
                      <div className="w-px bg-slate-800"></div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Est. Burn</div>
                        <div className="font-bold text-lg text-orange-400">{workout.calories} <span className="text-sm font-normal text-slate-300">kcal</span></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!workout.completed && (
                        <SplashButton
                          onClick={() => handleCompleteWorkout(workout.id, workout.name)}
                          className="flex-1 py-4 bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 rounded-2xl font-bold shadow-md flex justify-center items-center gap-2"
                        >
                          Complete Workout <ChevronRight size={18} />
                        </SplashButton>
                      )}
                      <SplashButton
                        onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-2xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </SplashButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Flame size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl text-white mb-1">5K Tempo Run</h3>
                <p className="text-slate-400 text-sm mb-5 font-medium">Build baseline aerobic capacity.</p>
                
                <div className="flex gap-6 mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Target Pace</div>
                    <div className="font-bold text-lg text-green-400">5:30 <span className="text-sm font-normal text-slate-300">/km</span></div>
                  </div>
                  <div className="w-px bg-slate-800"></div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Est. Burn</div>
                    <div className="font-bold text-lg text-orange-400">380 <span className="text-sm font-normal text-slate-300">kcal</span></div>
                  </div>
                </div>
                
                <AddLandWorkoutDialog>
                  <SplashButton className="w-full py-4 bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 rounded-2xl font-bold shadow-md flex justify-center items-center gap-2">
                    Start Tracking Run <ChevronRight size={18} />
                  </SplashButton>
                </AddLandWorkoutDialog>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};