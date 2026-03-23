import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';

/**
 * Hook to manage notifications for meals and workouts
 * Sends reminders for upcoming meals and missed sessions
 */
export const useNotifications = () => {
  const getTodayMeals = useAppStore((state) => state.getTodayMeals);
  const waterWorkouts = useAppStore((state) => state.waterWorkouts);
  const landWorkouts = useAppStore((state) => state.landWorkouts);

  useEffect(() => {
    // Check for upcoming meals every minute
    const checkMealReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const meals = getTodayMeals();
      
      // Check if any meal is within 15 minutes
      meals.forEach((meal) => {
        if (!meal.completed) {
          const mealTimeMinutes = parseInt(meal.time.split(':')[0]) * 60 + parseInt(meal.time.split(':')[1]);
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const diff = mealTimeMinutes - currentMinutes;
          
          // Notify 15 minutes before
          if (diff === 15) {
            toast.info(`🍽️ Meal Reminder: ${meal.name} in 15 minutes!`, {
              duration: 5000
            });
          }
        }
      });
    };

    // Check for missed workouts
    const checkMissedWorkouts = () => {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      
      // Check at 6 PM (18:00) for missed workouts
      if (currentHour === 18) {
        const allWorkouts = [...waterWorkouts, ...landWorkouts];
        const todayWorkouts = allWorkouts.filter(w => w.date === today);
        const missedWorkouts = todayWorkouts.filter(w => !w.completed);
        
        if (missedWorkouts.length > 0) {
          toast.warning(`🏊‍♂️ You have ${missedWorkouts.length} incomplete workout${missedWorkouts.length > 1 ? 's' : ''} today!`, {
            duration: 7000
          });
        }
      }
    };

    // Run checks immediately
    checkMealReminders();
    
    // Set up interval to check every minute
    const interval = setInterval(() => {
      checkMealReminders();
      checkMissedWorkouts();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [getTodayMeals, waterWorkouts, landWorkouts]);
};
