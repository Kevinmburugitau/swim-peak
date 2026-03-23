import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Hook to simulate smart device sync
 * Updates device metrics periodically to simulate real-time data
 */
export const useDeviceSync = () => {
  const updateDeviceMetrics = useAppStore((state) => state.updateDeviceMetrics);
  const deviceMetrics = useAppStore((state) => state.deviceMetrics);

  useEffect(() => {
    // Simulate device sync every 30 seconds
    const syncInterval = setInterval(() => {
      // Small random variations to simulate real device updates
      const calorieVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10
      const heartRateVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const swolfVariation = Math.floor(Math.random() * 4) - 2; // -2 to +2

      updateDeviceMetrics({
        calories: Math.max(0, deviceMetrics.calories + calorieVariation),
        heartRate: Math.max(60, Math.min(180, deviceMetrics.heartRate + heartRateVariation)),
        swolf: Math.max(50, Math.min(100, deviceMetrics.swolf + swolfVariation))
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(syncInterval);
  }, [deviceMetrics, updateDeviceMetrics]);
};
