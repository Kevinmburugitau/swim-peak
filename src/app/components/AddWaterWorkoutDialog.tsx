import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SplashButton } from './SplashButton';
import { useAppStore } from '../store/useAppStore';
import { Plus } from 'lucide-react';

const strokes = [
  { value: 'freestyle', label: 'Freestyle' },
  { value: 'butterfly', label: 'Butterfly' },
  { value: 'backstroke', label: 'Backstroke' },
  { value: 'breaststroke', label: 'Breaststroke' }
];

export const AddWaterWorkoutDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const addWaterWorkout = useAppStore((state) => state.addWaterWorkout);

  const [formData, setFormData] = useState({
    stroke: 'freestyle',
    drillName: '',
    distance: '',
    duration: '',
    pace: '',
    calories: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout = {
      date: new Date().toISOString().split('T')[0],
      stroke: formData.stroke,
      drillName: formData.drillName,
      distance: parseInt(formData.distance),
      duration: parseInt(formData.duration),
      pace: parseInt(formData.pace),
      calories: parseInt(formData.calories),
      avgHeartRate: Math.floor(Math.random() * 40) + 120,
      swolf: Math.floor(Math.random() * 20) + 65,
      completed: false
    };

    addWaterWorkout(workout);
    setOpen(false);
    
    // Reset form
    setFormData({
      stroke: 'freestyle',
      drillName: '',
      distance: '',
      duration: '',
      pace: '',
      calories: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SplashButton className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-3 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Plus size={24} />
        </SplashButton>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">Add Water Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="stroke" className="text-slate-300">Stroke</Label>
            <Select value={formData.stroke} onValueChange={(value) => setFormData({ ...formData, stroke: value })}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-700 text-slate-100">
                {strokes.map((stroke) => (
                  <SelectItem key={stroke.value} value={stroke.value}>
                    {stroke.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drillName" className="text-slate-300">Drill Name</Label>
            <Input
              id="drillName"
              value={formData.drillName}
              onChange={(e) => setFormData({ ...formData, drillName: e.target.value })}
              className="bg-slate-950 border-slate-700 text-slate-100"
              placeholder="e.g., Sprint Intervals"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-slate-300">Distance (m)</Label>
              <Input
                id="distance"
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="bg-slate-950 border-slate-700 text-slate-100"
                placeholder="2500"
                required
              />
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pace" className="text-slate-300">Pace (s/100m)</Label>
              <Input
                id="pace"
                type="number"
                value={formData.pace}
                onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
                className="bg-slate-950 border-slate-700 text-slate-100"
                placeholder="92"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories" className="text-slate-300">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="bg-slate-950 border-slate-700 text-slate-100"
                placeholder="450"
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
