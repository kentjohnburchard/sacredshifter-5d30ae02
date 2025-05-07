
import { supabase } from '@/integrations/supabase/client';
import { SacredSpectrumResource } from '@/types/sacred-spectrum';

export async function fetchSacredSpectrumResources(): Promise<SacredSpectrumResource[]> {
  try {
    const { data, error } = await supabase
      .from('sacred_spectrum_resources')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching sacred spectrum resources:', error);
      return [];
    }
    
    return data as SacredSpectrumResource[];
  } catch (error) {
    console.error('Error in fetchSacredSpectrumResources:', error);
    return [];
  }
}

export async function createSacredSpectrumResource(
  resource: Omit<SacredSpectrumResource, 'id' | 'created_at' | 'updated_at'>
): Promise<SacredSpectrumResource> {
  try {
    const { data, error } = await supabase
      .from('sacred_spectrum_resources')
      .insert(resource)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating sacred spectrum resource:', error);
      throw error;
    }
    
    return data as SacredSpectrumResource;
  } catch (error) {
    console.error('Error in createSacredSpectrumResource:', error);
    throw error;
  }
}

export async function updateSacredSpectrumResource(
  resource: SacredSpectrumResource
): Promise<SacredSpectrumResource> {
  try {
    const { data, error } = await supabase
      .from('sacred_spectrum_resources')
      .update(resource)
      .eq('id', resource.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating sacred spectrum resource:', error);
      throw error;
    }
    
    return data as SacredSpectrumResource;
  } catch (error) {
    console.error('Error in updateSacredSpectrumResource:', error);
    throw error;
  }
}

export async function deleteSacredSpectrumResource(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sacred_spectrum_resources')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting sacred spectrum resource:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteSacredSpectrumResource:', error);
    throw error;
  }
}

export async function uploadSacredSpectrumFile(file: File): Promise<string> {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('sacred_spectrum')
      .upload(`resources/${fileName}`, file);
      
    if (error) {
      console.error('Error uploading sacred spectrum file:', error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('sacred_spectrum')
      .getPublicUrl(`resources/${fileName}`);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadSacredSpectrumFile:', error);
    throw error;
  }
}
