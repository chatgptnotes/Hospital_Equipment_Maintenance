import { supabase } from '../lib/supabase';
import type { Issue, IssueStatus, IssueSeverity } from '../types/database.types';

export const issueService = {
  // Get all issues
  async getAllIssues(): Promise<Issue[]> {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get issue by ID
  async getIssueById(id: string): Promise<Issue | null> {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get issues by equipment
  async getIssuesByEquipment(equipmentId: string): Promise<Issue[]> {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get issues by status
  async getIssuesByStatus(status: IssueStatus): Promise<Issue[]> {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get open issues
  async getOpenIssues(): Promise<Issue[]> {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .in('status', ['reported', 'acknowledged', 'in_progress'])
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new issue
  async createIssue(issue: Omit<Issue, 'id' | 'created_at' | 'updated_at' | 'reported_at'>): Promise<Issue> {
    const { data, error } = await supabase
      .from('issues')
      .insert([issue])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update issue
  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update issue status
  async updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
    const updates: Partial<Issue> = { status };

    if (status === 'acknowledged') {
      updates.acknowledged_at = new Date().toISOString();
    } else if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString();
    } else if (status === 'closed') {
      updates.closed_at = new Date().toISOString();
    }

    return this.updateIssue(id, updates);
  },

  // Assign issue to someone
  async assignIssue(id: string, assignedTo: string): Promise<Issue> {
    return this.updateIssue(id, { assigned_to: assignedTo });
  },

  // Resolve issue
  async resolveIssue(id: string, resolutionNotes: string, resolvedBy?: string): Promise<Issue> {
    return this.updateIssue(id, {
      status: 'resolved',
      resolution_notes: resolutionNotes,
      resolved_at: new Date().toISOString()
    });
  },

  // Delete issue
  async deleteIssue(id: string): Promise<void> {
    const { error } = await supabase
      .from('issues')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
