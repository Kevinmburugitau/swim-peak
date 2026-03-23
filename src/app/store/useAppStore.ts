import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface WaterWorkout {
  id: string;
  date: string;
  stroke: string;
  drillName: string;
  distance: number; // in meters
  duration: number; // in minutes
  pace: number; // seconds per 100m
  calories: number;
  avgHeartRate?: number;
  swolf?: number;
  completed: boolean;
}

export interface LandWorkout {
  id: string;
  date: string;
  type: 'strength' | 'cardio';
  name: string;
  duration: number;
  exercises?: Array<{ name: string; reps: string; completed: boolean }>;
  calories: number;
  targetMuscles: string[];
  completed: boolean;
}

export interface Meal {
  id: string;
  date: string;
  time: string;
  type: string;
  name: string;
  calories: number;
  macros: { p: string; c: string; f: string };
  completed: boolean;
}

export interface DeviceMetrics {
  calories: number;
  heartRate: number;
  swolf: number;
  weight?: number;
  lastSync: string;
}

export interface UserProfile {
  name: string;
  dailyCalorieTarget: number;
  profileImage: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AppStore {
  // Authentication
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  setAuthState: (token: string, user: User) => void;
  logout: () => void;
  loadUserData: (token: string) => Promise<void>;
  saveUserData: () => Promise<void>;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Device Metrics
  deviceMetrics: DeviceMetrics;
  updateDeviceMetrics: (metrics: Partial<DeviceMetrics>) => void;

  // Water Workouts
  waterWorkouts: WaterWorkout[];
  addWaterWorkout: (workout: Omit<WaterWorkout, 'id'>) => void;
  updateWaterWorkout: (id: string, workout: Partial<WaterWorkout>) => void;
  deleteWaterWorkout: (id: string) => void;
  completeWaterWorkout: (id: string) => void;

  // Land Workouts
  landWorkouts: LandWorkout[];
  addLandWorkout: (workout: Omit<LandWorkout, 'id'>) => void;
  updateLandWorkout: (id: string, workout: Partial<LandWorkout>) => void;
  deleteLandWorkout: (id: string) => void;
  completeLandWorkout: (id: string) => void;

  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  completeMeal: (id: string) => void;
  swapMeal: (id: string, newMeal: Partial<Meal>) => void;

  // Computed Values
  getTodayCalories: () => number;
  getWeeklyCalories: () => Array<{ day: string; calories: number }>;
  getTodayMeals: () => Meal[];
  getUpcomingWorkout: () => WaterWorkout | LandWorkout | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getToday = () => new Date().toISOString().split('T')[0];

const initialMeals: Meal[] = [
  {
    id: '1',
    date: getToday(),
    time: '07:30',
    type: 'Pre-swim Breakfast',
    name: 'Oatmeal & Banana',
    calories: 320,
    macros: { p: '10g', c: '60g', f: '5g' },
    completed: false
  },
  {
    id: '2',
    date: getToday(),
    time: '12:00',
    type: 'Recovery Lunch',
    name: 'Grilled Salmon & Quinoa',
    calories: 650,
    macros: { p: '45g', c: '50g', f: '22g' },
    completed: false
  },
  {
    id: '3',
    date: getToday(),
    time: '15:30',
    type: 'Gym Snack',
    name: 'Protein Shake & Almonds',
    calories: 250,
    macros: { p: '25g', c: '15g', f: '12g' },
    completed: false
  },
  {
    id: '4',
    date: getToday(),
    time: '19:00',
    type: 'Dinner',
    name: 'Chicken Breast & Sweet Potato',
    calories: 580,
    macros: { p: '50g', c: '65g', f: '10g' },
    completed: false
  }
];

const initialWaterWorkouts: WaterWorkout[] = [
  {
    id: '1',
    date: getToday(),
    stroke: 'freestyle',
    drillName: 'Endurance Swim',
    distance: 2500,
    duration: 45,
    pace: 92,
    calories: 450,
    avgHeartRate: 142,
    swolf: 78,
    completed: false
  }
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      accessToken: null,
      user: null,

      userProfile: {
        name: 'Alex',
        dailyCalorieTarget: 3200,
        profileImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop'
      },

      deviceMetrics: {
        calories: 1840,
        heartRate: 142,
        swolf: 78,
        lastSync: new Date().toISOString()
      },

      waterWorkouts: initialWaterWorkouts,
      landWorkouts: [],
      meals: initialMeals,

      // Authentication Methods
      setAuthState: (token, user) =>
        set((state) => ({
          isAuthenticated: true,
          accessToken: token,
          user: user
        })),

      logout: () =>
        set((state) => ({
          isAuthenticated: false,
          accessToken: null,
          user: null
        })),

      loadUserData: async (token) => {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-29992991/user/data`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          if (!response.ok) {
            console.error('Failed to load user data');
            return;
          }
          
          const result = await response.json();
          
          if (result.data) {
            // Load all user data from server
            set((state) => ({
              userProfile: result.data.userProfile || state.userProfile,
              deviceMetrics: result.data.deviceMetrics || state.deviceMetrics,
              waterWorkouts: result.data.waterWorkouts || state.waterWorkouts,
              landWorkouts: result.data.landWorkouts || state.landWorkouts,
              meals: result.data.meals || state.meals,
            }));
          }
        } catch (error) {
          console.error('Load user data exception:', error);
        }
      },

      saveUserData: async () => {
        const { accessToken, userProfile, deviceMetrics, waterWorkouts, landWorkouts, meals } = get();
        
        if (!accessToken) {
          console.error('No access token for saving data');
          return;
        }

        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-29992991/user/data`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userProfile,
                deviceMetrics,
                waterWorkouts,
                landWorkouts,
                meals,
              })
            }
          );
          
          if (!response.ok) {
            console.error('Failed to save user data');
          }
        } catch (error) {
          console.error('Save user data exception:', error);
        }
      },

      // User Profile Methods
      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile }
        })),

      // Device Metrics Methods
      updateDeviceMetrics: (metrics) =>
        set((state) => ({
          deviceMetrics: { 
            ...state.deviceMetrics, 
            ...metrics,
            lastSync: new Date().toISOString()
          }
        })),

      // Water Workout Methods
      addWaterWorkout: (workout) =>
        set((state) => ({
          waterWorkouts: [{ ...workout, id: generateId() }, ...state.waterWorkouts]
        })),

      updateWaterWorkout: (id, workout) =>
        set((state) => ({
          waterWorkouts: state.waterWorkouts.map((w) =>
            w.id === id ? { ...w, ...workout } : w
          )
        })),

      deleteWaterWorkout: (id) =>
        set((state) => ({
          waterWorkouts: state.waterWorkouts.filter((w) => w.id !== id)
        })),

      completeWaterWorkout: (id) =>
        set((state) => {
          const workout = state.waterWorkouts.find(w => w.id === id);
          if (workout) {
            // Update device metrics with workout data
            const newCalories = state.deviceMetrics.calories + workout.calories;
            return {
              waterWorkouts: state.waterWorkouts.map((w) =>
                w.id === id ? { ...w, completed: true } : w
              ),
              deviceMetrics: {
                ...state.deviceMetrics,
                calories: newCalories,
                lastSync: new Date().toISOString()
              }
            };
          }
          return state;
        }),

      // Land Workout Methods
      addLandWorkout: (workout) =>
        set((state) => ({
          landWorkouts: [{ ...workout, id: generateId() }, ...state.landWorkouts]
        })),

      updateLandWorkout: (id, workout) =>
        set((state) => ({
          landWorkouts: state.landWorkouts.map((w) =>
            w.id === id ? { ...w, ...workout } : w
          )
        })),

      deleteLandWorkout: (id) =>
        set((state) => ({
          landWorkouts: state.landWorkouts.filter((w) => w.id !== id)
        })),

      completeLandWorkout: (id) =>
        set((state) => {
          const workout = state.landWorkouts.find(w => w.id === id);
          if (workout) {
            const newCalories = state.deviceMetrics.calories + workout.calories;
            return {
              landWorkouts: state.landWorkouts.map((w) =>
                w.id === id ? { ...w, completed: true } : w
              ),
              deviceMetrics: {
                ...state.deviceMetrics,
                calories: newCalories,
                lastSync: new Date().toISOString()
              }
            };
          }
          return state;
        }),

      // Meal Methods
      addMeal: (meal) =>
        set((state) => ({
          meals: [{ ...meal, id: generateId() }, ...state.meals]
        })),

      updateMeal: (id, meal) =>
        set((state) => ({
          meals: state.meals.map((m) => (m.id === id ? { ...m, ...meal } : m))
        })),

      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id)
        })),

      completeMeal: (id) =>
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, completed: true } : m
          )
        })),

      swapMeal: (id, newMeal) =>
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, ...newMeal, completed: false } : m
          )
        })),

      // Computed Methods
      getTodayCalories: () => {
        const today = getToday();
        const completedMeals = get().meals.filter(
          (m) => m.date === today && m.completed
        );
        return completedMeals.reduce((sum, m) => sum + m.calories, 0);
      },

      getWeeklyCalories: () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
        
        return days.map((day, index) => {
          // Calculate base calories with variation
          const baseCalories = 2400;
          const variation = Math.sin(index * 0.5) * 400;
          const dayCalories = baseCalories + variation + (index === currentDayIndex ? get().deviceMetrics.calories - 1840 : 0);
          
          return {
            day,
            calories: Math.round(dayCalories)
          };
        });
      },

      getTodayMeals: () => {
        const today = getToday();
        return get().meals.filter((m) => m.date === today);
      },

      getUpcomingWorkout: () => {
        const today = getToday();
        const upcomingWater = get().waterWorkouts.find(
          (w) => w.date === today && !w.completed
        );
        if (upcomingWater) return upcomingWater;

        const upcomingLand = get().landWorkouts.find(
          (w) => w.date === today && !w.completed
        );
        return upcomingLand || null;
      }
    }),
    {
      name: 'swimmer-app-storage'
    }
  )
);