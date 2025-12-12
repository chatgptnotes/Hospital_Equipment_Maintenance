import { supabase } from '../lib/supabase';
import type { Location } from '../types/database.types';

export const locationService = {
  // Get all active locations
  async getAllLocations(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get location by ID
  async getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new location
  async createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .insert([location])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update location
  async updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete location (soft delete)
  async deleteLocation(id: string): Promise<void> {
    const { error } = await supabase
      .from('locations')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }
};
