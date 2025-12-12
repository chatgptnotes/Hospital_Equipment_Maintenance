import { supabase } from '../lib/supabase';
import { issueService } from './issue.service';
import { equipmentService } from './equipment.service';
import { activityService } from './activity.service';
import { storageService } from './storage.service';
import type { Issue } from '../types/database.types';

export interface IssueReportData {
  equipmentId: string;
  issueDescription: string;
  reportedBy: string;
  severity?: 'minor' | 'moderate' | 'major' | 'critical';
  photos?: File[];
}

export const issueReportService = {
  /**
   * Submit a complete equipment issue report
   * This function handles:
   * 1. Uploading photos to storage
   * 2. Creating the issue record
   * 3. Updating equipment status
   * 4. Logging the activity
   */
  async submitIssueReport(reportData: IssueReportData): Promise<Issue> {
    try {
      const { equipmentId, issueDescription, reportedBy, severity = 'moderate', photos = [] } = reportData;

      // Step 1: Upload photos if provided
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        console.log(`Uploading ${photos.length} photos...`);
        photoUrls = await storageService.uploadMultiplePhotos(photos, equipmentId);
        console.log('Photos uploaded successfully:', photoUrls);
      }

      // Step 2: Get equipment details for the title
      const equipment = await equipmentService.getEquipmentById(equipmentId);
      if (!equipment) {
        throw new Error('Equipment not found');
      }

      // Step 3: Create the issue record
      const issue = await issueService.createIssue({
        equipment_id: equipmentId,
        title: `Issue reported for ${equipment.name}`,
        description: issueDescription,
        severity,
        status: 'reported',
        reported_by: reportedBy,
        attachments: photoUrls
      });

      console.log('Issue created:', issue);

      // Step 4: Update equipment status to 'maintenance' or 'repair' based on severity
      const newStatus = severity === 'critical' || severity === 'major' ? 'repair' : 'maintenance';
      await equipmentService.updateEquipmentStatus(equipmentId, newStatus);
      console.log(`Equipment status updated to: ${newStatus}`);

      // Step 5: Log the activity
      await activityService.logIssueReported(
        equipmentId,
        issue.id,
        issueDescription,
        reportedBy
      );
      console.log('Activity logged');

      return issue;
    } catch (error) {
      console.error('Error submitting issue report:', error);
      throw error;
    }
  },

  /**
   * Update an existing issue with additional photos
   */
  async addPhotosToIssue(issueId: string, equipmentId: string, photos: File[]): Promise<Issue> {
    try {
      // Get the existing issue
      const issue = await issueService.getIssueById(issueId);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Upload new photos
      const newPhotoUrls = await storageService.uploadMultiplePhotos(photos, equipmentId);

      // Combine with existing photos
      const allPhotos = [...(issue.attachments || []), ...newPhotoUrls];

      // Update the issue
      return await issueService.updateIssue(issueId, {
        attachments: allPhotos
      });
    } catch (error) {
      console.error('Error adding photos to issue:', error);
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
            category_id,
            location_id,
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
            category_id,
            location_id,
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
  }
};
