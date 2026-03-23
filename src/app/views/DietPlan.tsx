import React, { useState } from 'react';
import { Apple, Clock, Flame, CalendarDays, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { SplashButton } from '../components/SplashButton';
import { SwapMealDialog } from '../components/SwapMealDialog';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const DietPlan = () => {
  const [swapMealId, setSwapMealId] = useState<string | null>(null);
  const [swapMealType, setSwapMealType] = useState<string>('');
  
  const getTodayMeals = useAppStore((state) => state.getTodayMeals);
  const getTodayCalories = useAppStore((state) => state.getTodayCalories);
  const userProfile = useAppStore((state) => state.userProfile);
  const completeMeal = useAppStore((state) => state.completeMeal);

  const meals = getTodayMeals();
  const consumedCalories = getTodayCalories();
  const targetCalories = userProfile.dailyCalorieTarget;

  // Calculate macros consumed
  const consumedMacros = meals
    .filter(m => m.completed)
    .reduce(
      (acc, m) => ({
        protein: acc.protein + parseInt(m.macros.p),
        carbs: acc.carbs + parseInt(m.macros.c),
        fat: acc.fat + parseInt(m.macros.f)
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

  const handleMarkEaten = (id: string, name: string) => {
    completeMeal(id);
    toast.success(`${name} logged! 🍽️`);
  };

  const handleOpenSwapDialog = (id: string, type: string) => {
    setSwapMealId(id);
    setSwapMealType(type);
  };

  return (
    <div className="h-full overflow-y-auto pb-28 px-5 pt-8 bg-slate-950 text-slate-50 relative">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nutrition Plan</h1>
          <p className="text-slate-400 text-sm">Fueling endurance and muscle recovery.</p>
        </div>
        <SplashButton className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <CalendarDays size={24} />
        </SplashButton>
      </header>

      {/* Daily Summary */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-6 mb-10 border border-indigo-900 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase mb-5 flex items-center gap-2">
          Today's Target
        </h2>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-indigo-900/50 p-4 rounded-full border border-indigo-800/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Flame size={28} className="text-orange-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {consumedCalories.toLocaleString()} <span className="text-lg text-indigo-300 font-normal">/ {targetCalories.toLocaleString()}</span>
            </div>
            <div className="text-xs font-semibold tracking-wide text-indigo-400 uppercase">kcal consumed</div>
          </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
            <span className="text-cyan-400">Pro ({consumedMacros.protein}g)</span>
            <span className="text-blue-400">Crb ({consumedMacros.carbs}g)</span>
            <span className="text-indigo-400">Fat ({consumedMacros.fat}g)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
              style={{ width: `${(consumedMacros.protein / 130) * 100}%` }}
            ></div>
            <div 
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              style={{ width: `${(consumedMacros.carbs / 350) * 100}%` }}
            ></div>
            <div 
              className="h-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" 
              style={{ width: `${(consumedMacros.fat / 80) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l-[3px] border-slate-800/80 space-y-8 pb-6 ml-2">
        {meals.map((meal, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={meal.id} 
            className="relative"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[32px] top-1.5 h-[18px] w-[18px] rounded-full border-[4px] border-slate-950 ${
              meal.completed ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-slate-700'
            }`} />
            
            <div className="mb-2 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-300">{meal.time}</span>
              {meal.completed && (
                <span className="text-[10px] bg-cyan-900/60 text-cyan-400 px-2.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold border border-cyan-800">Done</span>
              )}
            </div>
            
            <div className={`p-5 rounded-3xl border ${
              meal.completed 
                ? 'bg-slate-900/40 border-slate-800/50 opacity-80' 
                : 'bg-slate-900 border-slate-700 shadow-xl'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[11px] text-cyan-400 font-bold tracking-widest uppercase mb-1">{meal.type}</div>
                  <h3 className="font-bold text-lg text-white leading-tight">{meal.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-orange-400">{meal.calories}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">kcal</div>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs font-semibold text-slate-400 bg-slate-950/80 p-3 rounded-2xl mt-4 border border-slate-800/50">
                <span className="flex gap-1">P: <span className="text-white">{meal.macros.p}</span></span>
                <span className="w-px bg-slate-800"></span>
                <span className="flex gap-1">C: <span className="text-white">{meal.macros.c}</span></span>
                <span className="w-px bg-slate-800"></span>
                <span className="flex gap-1">F: <span className="text-white">{meal.macros.f}</span></span>
              </div>
              
              {!meal.completed && (
                <div className="mt-5 flex gap-3">
                  <SplashButton 
                    onClick={() => handleMarkEaten(meal.id, meal.name)}
                    className="flex-[2] bg-cyan-500 text-slate-950 py-3 rounded-2xl text-[13px] font-black shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                  >
                    <CheckCircle2 size={18} /> Mark Eaten
                  </SplashButton>
                  <SplashButton 
                    onClick={() => handleOpenSwapDialog(meal.id, meal.type)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-2xl text-[13px] font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={16} /> Swap
                  </SplashButton>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <SwapMealDialog
        open={swapMealId !== null}
        onOpenChange={(open) => !open && setSwapMealId(null)}
        mealId={swapMealId || ''}
        currentMealType={swapMealType}
      />
    </div>
  );
};