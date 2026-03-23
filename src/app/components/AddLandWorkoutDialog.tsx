import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SplashButton } from './SplashButton';
import { useAppStore } from '../store/useAppStore';
import { Plus } from 'lucide-react';

export const AddLandWorkoutDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const addLandWorkout = useAppStore((state) => state.addLandWorkout);

  const [formData, setFormData] = useState({
    type: 'strength' as 'strength' | 'cardio',
    name: '',
    duration: '',
    calories: '',
    targetMuscles: [] as string[]
  });

  const muscles = ['Lats', 'Core', 'Shoulders', 'Legs', 'Triceps'];

  const toggleMuscle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      targetMuscles: prev.targetMuscles.includes(muscle)
        ? prev.targetMuscles.filter(m => m !== muscle)
        : [...prev.targetMuscles, muscle]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout = {
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      name: formData.name,
      duration: parseInt(formData.duration),
      calories: parseInt(formData.calories),
      targetMuscles: formData.targetMuscles,
      completed: false,
      exercises: formData.type === 'strength' ? [
        { name: 'Exercise 1', reps: '3 sets of 12', completed: false },
        { name: 'Exercise 2', reps: '3 sets of 12', completed: false }
      ] : undefined
    };

    addLandWorkout(workout);
    setOpen(false);
    
    // Reset form
    setFormData({
      type: 'strength',
      name: '',
      duration: '',
      calories: '',
      targetMuscles: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">Add Land Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-300">Workout Type</Label>
            <Select value={formData.type} onValueChange={(value: 'strength' | 'cardio') => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Workout Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-950 border-slate-700 text-slate-100"
              placeholder="e.g., Upper Body Strength"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Target Muscles</Label>
            <div className="flex flex-wrap gap-2">
              {muscles.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMuscle(m)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-300 ${
                    formData.targetMuscles.includes(m)
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-slate-950 border-slate-700 text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-slate-300">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-slate-950 border-slate-700 text-slate-100"
                placeholder="45"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories" className="text-slate-300">Est. Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="bg-slate-950 border-slate-700 text-slate-100"
                placeholder="380"
                required
              />
            </div>
          </div>

          <SplashButton
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-2xl mt-6"
          >
            Add Workout
          </SplashButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};
