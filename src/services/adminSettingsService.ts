
import { supabase } from '@/integrations/supabase/client';

export interface AdminSetting {
  id: string;
  category: string;
  key: string;
  value: string | number | boolean | object;
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface AdminSettingCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Get all admin settings
export const getAdminSettings = async (): Promise<AdminSetting[]> => {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data
    return [
      {
        id: '1',
        category: 'general',
        key: 'site_name',
        value: 'Sacred Shifter',
        description: 'Name of the site displayed in the browser title',
        updatedAt: '2025-05-01T12:00:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '2',
        category: 'general',
        key: 'site_description',
        value: 'Spiritual healing and frequency alignment platform',
        description: 'Meta description for SEO purposes',
        updatedAt: '2025-05-01T12:00:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '3',
        category: 'security',
        key: 'session_timeout',
        value: 60,
        description: 'Session timeout in minutes',
        updatedAt: '2025-05-02T14:30:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '4',
        category: 'security',
        key: 'enable_2fa',
        value: false,
        description: 'Enable two-factor authentication for admin accounts',
        updatedAt: '2025-05-02T14:30:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '5',
        category: 'notifications',
        key: 'admin_email_notifications',
        value: true,
        description: 'Send email notifications for important admin events',
        updatedAt: '2025-05-03T09:15:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '6',
        category: 'notifications',
        key: 'user_signup_notification',
        value: true,
        description: 'Notify administrators when new users sign up',
        updatedAt: '2025-05-03T09:15:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '7',
        category: 'advanced',
        key: 'maintenance_mode',
        value: false,
        description: 'Put the site in maintenance mode (only admins can access)',
        updatedAt: '2025-05-04T16:45:00Z',
        updatedBy: 'admin@example.com',
      },
      {
        id: '8',
        category: 'advanced',
        key: 'cache_ttl',
        value: 3600,
        description: 'Cache time-to-live in seconds',
        updatedAt: '2025-05-04T16:45:00Z',
        updatedBy: 'admin@example.com',
      },
    ];
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return [];
  }
};

// Get all setting categories
export const getSettingCategories = async (): Promise<AdminSettingCategory[]> => {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data
    return [
      {
        id: 'general',
        name: 'General',
        description: 'Basic site settings and configurations',
        icon: 'Settings',
      },
      {
        id: 'security',
        name: 'Security',
        description: 'Authentication and authorization settings',
        icon: 'Shield',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        description: 'Email and in-app notification settings',
        icon: 'Bell',
      },
      {
        id: 'advanced',
        name: 'Advanced',
        description: 'Technical and performance configurations',
        icon: 'Database',
      },
    ];
  } catch (error) {
    console.error('Error fetching setting categories:', error);
    return [];
  }
};

// Update a setting
export const updateSetting = async (id: string, value: any): Promise<boolean> => {
  try {
    // In a real implementation, this would update the setting in Supabase
    console.log(`Updating setting ${id} with value:`, value);
    
    // Mock successful update
    return true;
  } catch (error) {
    console.error(`Error updating setting ${id}:`, error);
    return false;
  }
};

// Add a new setting
export const addSetting = async (setting: Omit<AdminSetting, 'id' | 'updatedAt'>): Promise<boolean> => {
  try {
    // In a real implementation, this would add the setting to Supabase
    console.log('Adding new setting:', setting);
    
    // Mock successful addition
    return true;
  } catch (error) {
    console.error('Error adding setting:', error);
    return false;
  }
};

// Delete a setting
export const deleteSetting = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, this would delete the setting from Supabase
    console.log(`Deleting setting ${id}`);
    
    // Mock successful deletion
    return true;
  } catch (error) {
    console.error(`Error deleting setting ${id}:`, error);
    return false;
  }
};

export default {
  getAdminSettings,
  getSettingCategories,
  updateSetting,
  addSetting,
  deleteSetting,
};
