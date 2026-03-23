import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { SplashButton } from './SplashButton';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const mealOptions = [
  {
    name: 'Grilled Chicken Salad',
    calories: 420,
    macros: { p: '42g', c: '35g', f: '12g' }
  },
  {
    name: 'Tuna & Avocado Bowl',
    calories: 530,
    macros: { p: '38g', c: '40g', f: '20g' }
  },
  {
    name: 'Greek Yogurt & Berries',
    calories: 280,
    macros: { p: '20g', c: '35g', f: '6g' }
  },
  {
    name: 'Turkey Wrap & Hummus',
    calories: 480,
    macros: { p: '32g', c: '48g', f: '15g' }
  },
  {
    name: 'Pasta with Lean Beef',
    calories: 620,
    macros: { p: '45g', c: '70g', f: '16g' }
  },
  {
    name: 'Protein Pancakes',
    calories: 340,
    macros: { p: '28g', c: '42g', f: '8g' }
  }
];

interface SwapMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealId: string;
  currentMealType: string;
}

export const SwapMealDialog: React.FC<SwapMealDialogProps> = ({ 
  open, 
  onOpenChange, 
  mealId,
  currentMealType 
}) => {
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);
  const swapMeal = useAppStore((state) => state.swapMeal);

  const handleSwap = () => {
    if (selectedMeal !== null) {
      const meal = mealOptions[selectedMeal];
      swapMeal(mealId, {
        name: meal.name,
        calories: meal.calories,
        macros: meal.macros
      });
      onOpenChange(false);
      setSelectedMeal(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">Swap Meal</DialogTitle>
          <p className="text-sm text-slate-400 mt-2">Choose a replacement for {currentMealType}</p>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {mealOptions.map((meal, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedMeal(index)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedMeal === index
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-white">{meal.name}</h4>
                  <div className="flex gap-3 text-xs font-semibold text-slate-400 mt-2">
                    <span>P: <span className="text-white">{meal.macros.p}</span></span>
                    <span>•</span>
                    <span>C: <span className="text-white">{meal.macros.c}</span></span>
                    <span>•</span>
                    <span>F: <span className="text-white">{meal.macros.f}</span></span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-black text-orange-400">{meal.calories}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">kcal</div>
                </div>
                {selectedMeal === index && (
                  <div className="ml-3 bg-cyan-400 rounded-full p-1">
                    <Check size={16} className="text-slate-950" />
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <SplashButton
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-2xl font-bold"
          >
            Cancel
          </SplashButton>
          <SplashButton
            onClick={handleSwap}
            disabled={selectedMeal === null}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Swap
          </SplashButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
