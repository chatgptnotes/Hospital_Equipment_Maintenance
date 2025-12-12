import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'equipment-photos';

export const storageService = {
  /**
   * Upload a photo to Supabase Storage
   * @param file - The file to upload
   * @param equipmentId - The equipment ID for organizing files
   * @returns The public URL of the uploaded file
   */
  async uploadPhoto(file: File, equipmentId: string): Promise<string> {
    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${equipmentId}/${timestamp}.${fileExt}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  /**
   * Upload multiple photos
   * @param files - Array of files to upload
   * @param equipmentId - The equipment ID for organizing files
   * @returns Array of public URLs
   */
  async uploadMultiplePhotos(files: File[], equipmentId: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadPhoto(file, equipmentId));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple photos:', error);
      throw error;
    }
  },

  /**
   * Delete a photo from storage
   * @param fileUrl - The public URL of the file to delete
   */
  async deletePhoto(fileUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const urlParts = fileUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length < 2) throw new Error('Invalid file URL');

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },

  /**
   * Delete multiple photos
   * @param fileUrls - Array of public URLs to delete
   */
  async deleteMultiplePhotos(fileUrls: string[]): Promise<void> {
    try {
      const deletePromises = fileUrls.map(url => this.deletePhoto(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple photos:', error);
      throw error;
    }
  },

  /**
   * List all photos for an equipment
   * @param equipmentId - The equipment ID
   * @returns Array of file paths
   */
  async listEquipmentPhotos(equipmentId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(equipmentId);

      if (error) throw error;

      return data?.map(file => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${equipmentId}/${file.name}`);
        return urlData.publicUrl;
      }) || [];
    } catch (error) {
      console.error('Error listing photos:', error);
      throw error;
    }
  }
};
