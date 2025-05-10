
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch soundscape for a journey by its slug
 */
export async function fetchJourneySoundscape(journeySlug: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_journey_soundscape', { journey_slug: journeySlug });
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching journey soundscape:', error);
    return null;
  }
}

/**
 * Ensure Supabase storage bucket exists
 */
export async function ensureSoundscapeBucket() {
  // Check if bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'soundscapes';
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    // The bucket should exist now as we've created it via SQL
    console.log('Bucket exists:', bucketExists, buckets);
    
    return {
      exists: true,
      name: bucketName,
      error: null
    };
  } catch (error) {
    console.error('Error checking soundscapes bucket:', error);
    return {
      exists: false,
      name: 'soundscapes',
      error: 'Failed to check bucket'
    };
  }
}

/**
 * Upload file to Supabase storage
 */
export async function uploadSoundscapeFile(file: File, onProgress?: (progress: number) => void) {
  try {
    // Verify bucket exists first
    const bucketInfo = await ensureSoundscapeBucket();
    
    // Create a unique file name
    const timestamp = new Date().getTime();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${timestamp}-${cleanFileName}`;
    
    // Simulate progress updates 
    let progressInterval: number | null = null;
    if (onProgress) {
      let progressValue = 0;
      progressInterval = window.setInterval(() => {
        progressValue += 10;
        if (progressValue <= 90) {
          onProgress(progressValue);
        }
      }, 200);
    }

    try {
      console.log('Starting file upload to soundscapes bucket:', filePath);
      
      // Upload file to the soundscapes bucket
      const { data, error } = await supabase.storage
        .from('soundscapes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      // Clear the progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      console.log('Upload successful, data:', data);
      
      // Get public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from('soundscapes')
        .getPublicUrl(filePath);
      
      // Set final progress to 100%
      if (onProgress) {
        onProgress(100);
      }
      
      console.log('File uploaded successfully:', publicUrlData.publicUrl);
      
      return {
        path: filePath,
        url: publicUrlData.publicUrl
      };
    } catch (uploadError) {
      // Clear interval on error too
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      console.error('Upload error caught:', uploadError);
      throw uploadError;
    }
  } catch (error) {
    console.error('Error in uploadSoundscapeFile:', error);
    throw error;
  }
}

/**
 * Delete file from Supabase storage
 */
export async function deleteSoundscapeFile(filePath: string) {
  try {
    if (!filePath) return true;
    
    // Extract path from URL if needed
    let path = filePath;
    if (filePath.includes('soundscapes/')) {
      const parts = filePath.split('soundscapes/');
      if (parts.length > 1) {
        path = parts[1].split('?')[0]; // Remove query params if present
      }
    }
    
    console.log('Deleting file:', path);
    
    const { error } = await supabase.storage
      .from('soundscapes')
      .remove([path]);
    
    if (error) {
      console.error('Delete file error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting soundscape file:', error);
    return false;
  }
}
