// Database Types for Supabase

export type EquipmentStatus = 'operational' | 'maintenance' | 'out_of_service' | 'repair';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type IssueSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type IssueStatus = 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
export type ActivityType =
  | 'issue_reported'
  | 'issue_acknowledged'
  | 'issue_resolved'
  | 'maintenance_scheduled'
  | 'maintenance_completed'
  | 'equipment_added'
  | 'equipment_updated'
  | 'status_changed';

export interface Location {
  id: string;
  name: string;
  address?: string;
  contact_number?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  equipment_id: string;
  name: string;
  description?: string;
  category_id?: string;
  location_id?: string;
  status: EquipmentStatus;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_frequency_days: number;
  purchase_cost?: number;
  current_value?: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  equipment_id?: string;
  maintenance_type?: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  performed_by?: string;
  technician_name?: string;
  technician_contact?: string;
  cost?: number;
  parts_replaced?: string[];
  notes?: string;
  next_maintenance_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  equipment_id?: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  reported_by: string;
  reported_at: string;
  assigned_to?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  closed_at?: string;
  resolution_notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  activity_type: ActivityType;
  equipment_id?: string;
  issue_id?: string;
  maintenance_id?: string;
  title: string;
  description?: string;
  performed_by?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Staff {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// View types
export interface EquipmentDetails extends Equipment {
  category_name?: string;
  location_name?: string;
}

export interface RecentActivity extends ActivityLog {
  equipment_name?: string;
  equipment_id_display?: string;
}

export interface UpcomingMaintenance {
  id: string;
  equipment_id: string;
  equipment_name: string;
  category_name?: string;
  location_name?: string;
  next_maintenance_date?: string;
  last_maintenance_date?: string;
  status: EquipmentStatus;
}
