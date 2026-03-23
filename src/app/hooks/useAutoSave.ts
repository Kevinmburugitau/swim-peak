import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useAutoSave() {
  const { isAuthenticated, accessToken, saveUserData, waterWorkouts, landWorkouts, meals, deviceMetrics } = useAppStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only auto-save if authenticated
    if (!isAuthenticated || !accessToken) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 2 seconds
    saveTimeoutRef.current = setTimeout(() => {
      saveUserData();
    }, 2000);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [waterWorkouts, landWorkouts, meals, deviceMetrics, isAuthenticated, accessToken, saveUserData]);
}
