
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Navigation item TS type
export type NavigationItem = {
  id: string;
  path: string;
  label: string;
  icon: string | null;
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Fetch all navigation items, sorted by order
export function useNavigationItems() {
  return useQuery({
    queryKey: ['navigation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      return data as NavigationItem[];
    },
  });
}

// Update navigation item field
export function useUpdateNavigationItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id, field, value,
    }: { id: string; field: keyof NavigationItem; value: string | boolean }) => {
      const { error } = await supabase
        .from('navigation_items')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
    },
  });
}

// Add new navigation item
export function useAddNavigationItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: Omit<NavigationItem, 'id'>) => {
      const { error } = await supabase
        .from('navigation_items')
        .insert([newItem]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
    },
  });
}

// Delete navigation item
export function useDeleteNavigationItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
    },
  });
}
