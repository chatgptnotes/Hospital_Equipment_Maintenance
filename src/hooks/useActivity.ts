import { useState, useEffect } from 'react';
import { activityService } from '../services';
import type { RecentActivity } from '../types/database.types';

export function useRecentActivity(limit: number = 20) {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getRecentActivity(limit);
      setActivities(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  return { activities, loading, error, refetch: fetchActivities };
}
