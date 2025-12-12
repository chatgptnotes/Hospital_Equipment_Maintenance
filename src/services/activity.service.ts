import { supabase } from '../lib/supabase';
import type { ActivityLog, ActivityType, RecentActivity } from '../types/database.types';

export const activityService = {
  // Get recent activity (from view)
  async getRecentActivity(limit: number = 20): Promise<RecentActivity[]> {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get activity by equipment
  async getActivityByEquipment(equipmentId: string): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('equipment_id', equipmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create activity log
  async createActivity(
    activityType: ActivityType,
    title: string,
    description?: string,
    equipmentId?: string,
    issueId?: string,
    maintenanceId?: string,
    performedBy?: string,
    metadata?: Record<string, any>
  ): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_log')
      .insert([
        {
          activity_type: activityType,
          title,
          description,
          equipment_id: equipmentId,
          issue_id: issueId,
          maintenance_id: maintenanceId,
          performed_by: performedBy,
          metadata
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Log equipment status change
  async logStatusChange(
    equipmentId: string,
    oldStatus: string,
    newStatus: string,
    performedBy?: string
  ): Promise<ActivityLog> {
    return this.createActivity(
      'status_changed',
      'Status Changed',
      `Equipment status changed from ${oldStatus} to ${newStatus}`,
      equipmentId,
      undefined,
      undefined,
      performedBy,
      { old_status: oldStatus, new_status: newStatus }
    );
  },

  // Log issue reported
  async logIssueReported(
    equipmentId: string,
    issueId: string,
    issueTitle: string,
    reportedBy: string
  ): Promise<ActivityLog> {
    return this.createActivity(
      'issue_reported',
      'Issue Reported',
      issueTitle,
      equipmentId,
      issueId,
      undefined,
      reportedBy
    );
  },

  // Log maintenance completed
  async logMaintenanceCompleted(
    equipmentId: string,
    maintenanceId: string,
    performedBy?: string
  ): Promise<ActivityLog> {
    return this.createActivity(
      'maintenance_completed',
      'Maintenance Completed',
      'Equipment maintenance has been completed',
      equipmentId,
      undefined,
      maintenanceId,
      performedBy
    );
  }
};
