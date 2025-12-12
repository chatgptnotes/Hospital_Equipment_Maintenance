import { supabase } from '../lib/supabase';
import type { MaintenanceRecord, MaintenanceStatus, MaintenancePriority } from '../types/database.types';

export const maintenanceService = {
  // Get all maintenance records
  async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get maintenance record by ID
  async getMaintenanceById(id: string): Promise<MaintenanceRecord | null> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get maintenance records by equipment
  async getMaintenanceByEquipment(equipmentId: string): Promise<MaintenanceRecord[]> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get maintenance records by status
  async getMaintenanceByStatus(status: MaintenanceStatus): Promise<MaintenanceRecord[]> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('status', status)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get scheduled maintenance
  async getScheduledMaintenance(): Promise<MaintenanceRecord[]> {
    return this.getMaintenanceByStatus('scheduled');
  },

  // Get maintenance in progress
  async getMaintenanceInProgress(): Promise<MaintenanceRecord[]> {
    return this.getMaintenanceByStatus('in_progress');
  },

  // Create new maintenance record
  async createMaintenance(
    maintenance: Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MaintenanceRecord> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert([maintenance])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Schedule maintenance
  async scheduleMaintenance(
    equipmentId: string,
    maintenanceType: string,
    description: string,
    scheduledDate: string,
    priority: MaintenancePriority = 'medium'
  ): Promise<MaintenanceRecord> {
    return this.createMaintenance({
      equipment_id: equipmentId,
      maintenance_type: maintenanceType,
      description,
      scheduled_date: scheduledDate,
      priority,
      status: 'scheduled'
    });
  },

  // Update maintenance record
  async updateMaintenance(id: string, updates: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const { data, error } = await supabase
      .from('maintenance_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Start maintenance
  async startMaintenance(id: string, performedBy?: string): Promise<MaintenanceRecord> {
    return this.updateMaintenance(id, {
      status: 'in_progress',
      started_at: new Date().toISOString(),
      performed_by: performedBy
    });
  },

  // Complete maintenance
  async completeMaintenance(
    id: string,
    cost?: number,
    partsReplaced?: string[],
    notes?: string,
    nextMaintenanceDate?: string
  ): Promise<MaintenanceRecord> {
    return this.updateMaintenance(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      cost,
      parts_replaced: partsReplaced,
      notes,
      next_maintenance_date: nextMaintenanceDate
    });
  },

  // Cancel maintenance
  async cancelMaintenance(id: string, notes?: string): Promise<MaintenanceRecord> {
    return this.updateMaintenance(id, {
      status: 'cancelled',
      notes
    });
  },

  // Delete maintenance record
  async deleteMaintenance(id: string): Promise<void> {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
