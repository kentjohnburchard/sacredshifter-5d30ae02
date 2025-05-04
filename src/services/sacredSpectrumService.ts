
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SacredSpectrumResource {
  id: number;
  title: string;
  category: string | null;
  tags: string | null;
  file_url: string | null;
  external_link: string | null;
  description: string | null;
  journey_slug: string | null;
  user_id: string | null;
  needs_moderation: boolean | null;
  is_approved: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const fetchSacredSpectrumResources = async (filters?: { 
  category?: string, 
  tags?: string[],
  journey_slug?: string,
  searchQuery?: string
}): Promise<SacredSpectrumResource[]> => {
  let query = supabase.from('sacred_spectrum_resources').select('*');
  
  // Apply filters if provided
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.journey_slug) {
    query = query.eq('journey_slug', filters.journey_slug);
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    // Search for any tag that contains any of the provided tags
    const tagConditions = filters.tags.map(tag => `tags.ilike.%${tag}%`);
    query = query.or(tagConditions.join(','));
  }
  
  if (filters?.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
  }
  
  // Default sorting by created_at desc (newest first)
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching sacred spectrum resources:', error);
    toast.error('Failed to load sacred knowledge resources');
    throw error;
  }
  
  return data || [];
};

export const fetchSacredSpectrumResourceById = async (id: number): Promise<SacredSpectrumResource | null> => {
  const { data, error } = await supabase
    .from('sacred_spectrum_resources')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching sacred spectrum resource with id ${id}:`, error);
    toast.error('Failed to load resource');
    throw error;
  }
  
  return data;
};

export const createSacredSpectrumResource = async (resource: Omit<SacredSpectrumResource, 'id' | 'created_at' | 'updated_at'>): Promise<SacredSpectrumResource> => {
  const { data, error } = await supabase
    .from('sacred_spectrum_resources')
    .insert({ ...resource })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating sacred spectrum resource:', error);
    toast.error('Failed to create resource');
    throw error;
  }
  
  toast.success('Sacred knowledge resource created successfully');
  return data;
};

export const updateSacredSpectrumResource = async (resource: Partial<SacredSpectrumResource> & { id: number }): Promise<SacredSpectrumResource> => {
  const { data, error } = await supabase
    .from('sacred_spectrum_resources')
    .update({
      ...resource,
      updated_at: new Date().toISOString(),
    })
    .eq('id', resource.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating sacred spectrum resource:', error);
    toast.error('Failed to update resource');
    throw error;
  }
  
  toast.success('Resource updated successfully');
  return data;
};

export const deleteSacredSpectrumResource = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('sacred_spectrum_resources')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting sacred spectrum resource with id ${id}:`, error);
    toast.error('Failed to delete resource');
    throw error;
  }
  
  toast.success('Resource deleted successfully');
};

export const uploadSacredSpectrumFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('sacred_spectrum_files')
    .upload(filePath, file);
  
  if (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
  
  const { data: publicUrlData } = supabase.storage
    .from('sacred_spectrum_files')
    .getPublicUrl(filePath);
  
  return publicUrlData.publicUrl;
};

// Categories for sacred spectrum resources
export const resourceCategories = [
  'Vibrational Acoustics',
  'Sacred Geometry',
  'Hermetic Principles',
  'Ancient Technologies',
  'Quantum Consciousness',
  'Frequency Healing',
  'Sacred Mathematics',
  'Cosmic Patterns',
  'Energy Work',
  'Meditation Techniques',
  'Other'
];
