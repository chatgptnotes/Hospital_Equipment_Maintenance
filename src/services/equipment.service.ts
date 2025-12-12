import { supabase } from '../lib/supabase';
import type { Equipment, EquipmentDetails, EquipmentStatus } from '../types/database.types';

export const equipmentService = {
  // Get all equipment with details (location and category names)
  async getAllEquipment(): Promise<EquipmentDetails[]> {
    const { data, error } = await supabase
      .from('equipment_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get equipment by ID
  async getEquipmentById(id: string): Promise<Equipment | null> {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get equipment by location
  async getEquipmentByLocation(locationId: string): Promise<EquipmentDetails[]> {
    const { data, error } = await supabase
      .from('equipment_details')
      .select('*')
      .eq('location_id', locationId);

    if (error) throw error;
    return data || [];
  },

  // Get equipment by category
  async getEquipmentByCategory(categoryName: string): Promise<EquipmentDetails[]> {
    const { data, error } = await supabase
      .from('equipment_details')
      .select('*')
      .eq('category_name', categoryName);

    if (error) throw error;
    return data || [];
  },

  // Get equipment by status
  async getEquipmentByStatus(status: EquipmentStatus): Promise<EquipmentDetails[]> {
    const { data, error } = await supabase
      .from('equipment_details')
      .select('*')
      .eq('status', status);

    if (error) throw error;
    return data || [];
  },

  // Filter equipment by location and category
  async filterEquipment(locationId?: string, categoryName?: string): Promise<EquipmentDetails[]> {
    let query = supabase.from('equipment_details').select('*');

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    if (categoryName) {
      query = query.eq('category_name', categoryName);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new equipment
  async createEquipment(equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<Equipment> {
    const { data, error } = await supabase
      .from('equipment')
      .insert([equipment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update equipment
  async updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment> {
    const { data, error } = await supabase
      .from('equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update equipment status
  async updateEquipmentStatus(id: string, status: EquipmentStatus): Promise<Equipment> {
    return this.updateEquipment(id, { status });
  },

  // Delete equipment (soft delete)
  async deleteEquipment(id: string): Promise<void> {
    const { error } = await supabase
      .from('equipment')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Get upcoming maintenance
  async getUpcomingMaintenance(): Promise<any[]> {
    const { data, error } = await supabase
      .from('upcoming_maintenance')
      .select('*')
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  // Get equipment needing maintenance soon (next 7 days)
  async getMaintenanceDueSoon(): Promise<EquipmentDetails[]> {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const { data, error } = await supabase
      .from('equipment_details')
      .select('*')
      .gte('next_maintenance_date', today.toISOString().split('T')[0])
      .lte('next_maintenance_date', nextWeek.toISOString().split('T')[0])
      .order('next_maintenance_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
