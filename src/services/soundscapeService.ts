
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
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (error) {
        console.error('Error creating soundscapes bucket:', error);
        return {
          exists: false,
          name: bucketName,
          error: error.message
        };
      }
    }
    
    return {
      exists: true,
      name: bucketName,
      error: null
    };
  } catch (error) {
    console.error('Error checking/creating soundscapes bucket:', error);
    return {
      exists: false,
      name: 'soundscapes',
      error: 'Failed to check or create bucket'
    };
  }
}

/**
 * Upload file to Supabase storage
 */
export async function uploadSoundscapeFile(file: File, onProgress?: (progress: number) => void) {
  try {
    // Ensure bucket exists
    await ensureSoundscapeBucket();
    
    // Create a unique file name
    const timestamp = new Date().getTime();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${timestamp}-${cleanFileName}`;
    
    // Create a function to handle upload progress
    const handleProgress = (progress: { loaded: number; total: number }) => {
      const progressValue = (progress.loaded / progress.total) * 100;
      if (onProgress) {
        onProgress(progressValue);
      }
    };

    // Upload file to the soundscapes bucket
    // Use the event listener approach instead of the onUploadProgress option
    const uploadPromise = new Promise<{path: string, url: string}>((resolve, reject) => {
      // Start upload
      const { data, error } = supabase.storage
        .from('soundscapes')
        .upload(filePath, file, {
          cacheControl: '3600'
        });
      
      // Handle the upload result
      data ? resolve({ path: filePath, url: '' }) : reject(error);
    });

    // Simulate progress updates for now since event listeners aren't directly supported
    if (onProgress) {
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 10;
        if (progressValue <= 90) {
          onProgress(progressValue);
        } else {
          clearInterval(interval);
        }
      }, 200);
    }
    
    const uploadResult = await uploadPromise;
    
    // Get public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from('soundscapes')
      .getPublicUrl(filePath);
    
    // Set final progress to 100%
    if (onProgress) {
      onProgress(100);
    }
    
    return {
      path: filePath,
      url: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading soundscape file:', error);
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
    
    const { error } = await supabase.storage
      .from('soundscapes')
      .remove([path]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting soundscape file:', error);
    return false;
  }
}
