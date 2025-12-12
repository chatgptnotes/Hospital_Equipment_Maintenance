import { supabase } from '../lib/supabase';
import type { Issue } from '../types/database.types';

export interface SimpleIssueReportData {
  equipmentId: string;
  issueDescription: string;
  reportedBy: string;
  severity?: 'minor' | 'moderate' | 'major' | 'critical';
}

/**
 * Simplified Issue Reporting Service
 * Works without photo upload - just stores issue data
 */
export const issueReportSimpleService = {
  /**
   * Submit issue report without photos
   * This is a simplified version that just creates the issue record
   */
  async submitIssueReport(reportData: SimpleIssueReportData): Promise<Issue> {
    console.log('📝 Starting issue report submission...');
    console.log('Report data:', reportData);

    try {
      const { equipmentId, issueDescription, reportedBy, severity = 'moderate' } = reportData;

      // Step 1: Get equipment details
      console.log('🔍 Fetching equipment details for:', equipmentId);
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('id, equipment_id, name')
        .eq('equipment_id', equipmentId)
        .single();

      if (equipmentError) {
        console.error('❌ Error fetching equipment:', equipmentError);
        console.error('Error code:', equipmentError.code);
        console.error('Error message:', equipmentError.message);
        console.error('Error details:', equipmentError.details);
        console.error('Error hint:', equipmentError.hint);

        if (equipmentError.code === 'PGRST116') {
          throw new Error('Equipment not found in database. Please check equipment ID.');
        } else if (equipmentError.message?.includes('406')) {
          throw new Error('Database access denied. Please run COMPLETE_RLS_FIX.sql to disable Row Level Security.');
        }

        throw equipmentError;
      }

      if (!equipment) {
        console.error('❌ Equipment not found:', equipmentId);
        throw new Error('Equipment not found');
      }

      console.log('✅ Equipment found:', equipment);

      // Step 2: Create the issue record
      console.log('💾 Creating issue record...');
      const { data: issue, error: issueError } = await supabase
        .from('issues')
        .insert([
          {
            equipment_id: equipment.id,
            title: `Issue reported for ${equipment.name}`,
            description: issueDescription,
            severity,
            status: 'reported',
            reported_by: reportedBy,
            attachments: [] // Empty array for now
          }
        ])
        .select()
        .single();

      if (issueError) {
        console.error('❌ Error creating issue:', issueError);
        console.error('Error code:', issueError.code);
        console.error('Error message:', issueError.message);
        console.error('Error details:', JSON.stringify(issueError, null, 2));

        if (issueError.message?.includes('RLS') || issueError.message?.includes('row-level security')) {
          throw new Error('Row Level Security is blocking the insert. Please run COMPLETE_RLS_FIX.sql script.');
        } else if (issueError.code === '42501') {
          throw new Error('Permission denied. Please disable RLS using COMPLETE_RLS_FIX.sql script.');
        }

        throw issueError;
      }

      console.log('✅ Issue created successfully:', issue);

      // Step 3: Update equipment status
      console.log('🔧 Updating equipment status...');
      const newStatus = severity === 'critical' || severity === 'major' ? 'repair' : 'maintenance';

      const { error: updateError } = await supabase
        .from('equipment')
        .update({ status: newStatus })
        .eq('id', equipment.id);

      if (updateError) {
        console.error('⚠️ Warning: Could not update equipment status:', updateError);
        // Don't throw here, issue is already created
      } else {
        console.log(`✅ Equipment status updated to: ${newStatus}`);
      }

      // Step 4: Log the activity
      console.log('📊 Logging activity...');
      const { error: activityError } = await supabase
        .from('activity_log')
        .insert([
          {
            activity_type: 'issue_reported',
            equipment_id: equipment.id,
            issue_id: issue.id,
            title: 'Issue Reported',
            description: issueDescription,
            performed_by: reportedBy
          }
        ]);

      if (activityError) {
        console.error('⚠️ Warning: Could not log activity:', activityError);
        // Don't throw here, issue is already created
      } else {
        console.log('✅ Activity logged successfully');
      }

      console.log('🎉 Issue report submission completed successfully!');
      return issue;
    } catch (error) {
      console.error('💥 Error in submitIssueReport:', error);
      throw error;
    }
  },

  /**
   * Get issue report with equipment details
   */
  async getIssueReportWithDetails(issueId: string) {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          equipment:equipment_id (
            id,
            equipment_id,
            name,
            status
          )
        `)
        .eq('id', issueId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching issue report details:', error);
      throw error;
    }
  },

  /**
   * Get all issue reports with equipment details
   */
  async getAllIssueReportsWithDetails() {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          equipment:equipment_id (
            id,
            equipment_id,
            name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching issue reports:', error);
      throw error;
    }
  },

  /**
   * Get all issues with complete details from view
   * Includes hospital name, equipment details, and category
   */
  async getAllIssuesWithHospitalDetails() {
    try {
      console.log('📊 Fetching issues from issues_with_details view...');
      const { data, error } = await supabase
        .from('issues_with_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching issues with details:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} issues with complete details`);
      return data;
    } catch (error) {
      console.error('Error fetching issues with hospital details:', error);
      throw error;
    }
  },

  /**
   * Get issues filtered by hospital
   */
  async getIssuesByHospital(hospitalName: string) {
    try {
      console.log(`📊 Fetching issues for hospital: ${hospitalName}`);
      const { data, error } = await supabase
        .from('issues_with_details')
        .select('*')
        .eq('hospital_name', hospitalName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Found ${data?.length || 0} issues for ${hospitalName}`);
      return data;
    } catch (error) {
      console.error('Error fetching issues by hospital:', error);
      throw error;
    }
  },

  /**
   * Get issues filtered by status and hospital
   */
  async getIssuesByStatusAndHospital(status: string, hospitalName?: string) {
    try {
      let query = supabase
        .from('issues_with_details')
        .select('*')
        .eq('status', status);

      if (hospitalName) {
        query = query.eq('hospital_name', hospitalName);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching issues by status and hospital:', error);
      throw error;
    }
  },

  /**
   * Get open issues grouped by hospital
   */
  async getOpenIssuesByHospital() {
    try {
      const { data, error } = await supabase
        .from('issues_with_details')
        .select('*')
        .in('status', ['reported', 'acknowledged', 'in_progress'])
        .order('hospital_name', { ascending: true })
        .order('severity', { ascending: false });

      if (error) throw error;

      // Group by hospital
      const groupedByHospital = data?.reduce((acc: any, issue: any) => {
        const hospital = issue.hospital_name || 'Unknown';
        if (!acc[hospital]) {
          acc[hospital] = [];
        }
        acc[hospital].push(issue);
        return acc;
      }, {});

      return groupedByHospital;
    } catch (error) {
      console.error('Error fetching open issues by hospital:', error);
      throw error;
    }
  },

  /**
   * Get issue statistics by hospital
   */
  async getIssueStatsByHospital() {
    try {
      const { data, error } = await supabase
        .from('issues_with_details')
        .select('hospital_name, status, severity');

      if (error) throw error;

      // Calculate statistics
      const stats = data?.reduce((acc: any, issue: any) => {
        const hospital = issue.hospital_name || 'Unknown';
        if (!acc[hospital]) {
          acc[hospital] = {
            total: 0,
            open: 0,
            resolved: 0,
            closed: 0,
            critical: 0,
            major: 0,
            moderate: 0,
            minor: 0
          };
        }

        acc[hospital].total++;

        // Count by status
        if (issue.status === 'reported' || issue.status === 'acknowledged' || issue.status === 'in_progress') {
          acc[hospital].open++;
        } else if (issue.status === 'resolved') {
          acc[hospital].resolved++;
        } else if (issue.status === 'closed') {
          acc[hospital].closed++;
        }

        // Count by severity
        if (issue.severity) {
          acc[hospital][issue.severity]++;
        }

        return acc;
      }, {});

      return stats;
    } catch (error) {
      console.error('Error fetching issue statistics:', error);
      throw error;
    }
  }
};
