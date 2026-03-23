import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { SplashButton } from './SplashButton';
import { Timer, Play, Pause, Square } from 'lucide-react';
import { motion } from 'motion/react';

interface WorkoutSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  duration: number; // in minutes
  onComplete: () => void;
}

export const WorkoutSessionDialog: React.FC<WorkoutSessionDialogProps> = ({
  open,
  onOpenChange,
  workoutName,
  duration,
  onComplete
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const targetTime = duration * 60;

  useEffect(() => {
    if (!open) {
      setIsRunning(false);
      setTimeElapsed(0);
    }
  }, [open]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeElapsed < targetTime) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= targetTime - 1) {
            setIsRunning(false);
            return targetTime;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeElapsed, targetTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeElapsed / targetTime) * 100;

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Timer size={24} />
            Active Session
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">{workoutName}</h3>
          
          {/* Circular Timer */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-800"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="text-cyan-400"
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-white">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                / {formatTime(targetTime)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-4">
            {!isRunning ? (
              <SplashButton
                onClick={() => setIsRunning(true)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                {timeElapsed === 0 ? 'Start' : 'Resume'}
              </SplashButton>
            ) : (
              <SplashButton
                onClick={() => setIsRunning(false)}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <Pause size={20} fill="currentColor" />
                Pause
              </SplashButton>
            )}
            
            <SplashButton
              onClick={() => {
                setIsRunning(false);
                setTimeElapsed(0);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-2xl flex items-center justify-center"
            >
              <Square size={20} />
            </SplashButton>
          </div>

          <SplashButton
            onClick={handleComplete}
            disabled={timeElapsed < targetTime * 0.8} // Must complete at least 80%
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Workout
          </SplashButton>
          
          {timeElapsed < targetTime * 0.8 && (
            <p className="text-xs text-slate-500 text-center mt-2">
              Complete at least 80% to finish
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
