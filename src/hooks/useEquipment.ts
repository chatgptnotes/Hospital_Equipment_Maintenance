import { useState, useEffect } from 'react';
import { equipmentService } from '../services';
import type { EquipmentDetails, EquipmentStatus } from '../types/database.types';

export function useEquipment(locationId?: string, categoryName?: string) {
  const [equipment, setEquipment] = useState<EquipmentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: EquipmentDetails[];

      if (locationId || categoryName) {
        data = await equipmentService.filterEquipment(locationId, categoryName);
      } else {
        data = await equipmentService.getAllEquipment();
      }

      setEquipment(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [locationId, categoryName]);

  const refetch = () => {
    fetchEquipment();
  };

  return { equipment, loading, error, refetch };
}

export function useEquipmentByStatus(status: EquipmentStatus) {
  const [equipment, setEquipment] = useState<EquipmentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getEquipmentByStatus(status);
      setEquipment(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching equipment by status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [status]);

  return { equipment, loading, error, refetch: fetchEquipment };
}
