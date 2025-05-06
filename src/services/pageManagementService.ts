
import { supabase } from '@/integrations/supabase/client';

export interface PageMetadata {
  id: string;
  path: string;
  title: string;
  description?: string;
  lastModified: string;
  route: string;
  status: 'published' | 'draft' | 'archived';
  createdBy?: string;
  components?: Array<{
    id: string;
    name: string;
    props: Record<string, any>;
  }>;
}

export interface PageDraft {
  id: string;
  pageId: string;
  content: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'discarded' | 'applied';
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  content: string;
  createdAt: string;
  createdBy: string;
  changes: string;
}

// Get all pages in the application
export const getAllPages = async (): Promise<PageMetadata[]> => {
  try {
    // In a real implementation, this would query the database or analyze the project
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');
    
    if (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllPages:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        path: '/src/pages/Home.tsx',
        title: 'Home',
        description: 'Main landing page for the application',
        lastModified: '2025-05-06',
        route: '/',
        status: 'published',
        createdBy: 'Admin',
      },
      {
        id: '2',
        path: '/src/pages/About.tsx',
        title: 'About',
        description: 'Information about the company and mission',
        lastModified: '2025-05-05',
        route: '/about',
        status: 'published',
        createdBy: 'Admin',
      },
      {
        id: '3',
        path: '/src/pages/Dashboard.tsx',
        title: 'Dashboard',
        description: 'User dashboard with analytics and statistics',
        lastModified: '2025-05-04',
        route: '/dashboard',
        status: 'published',
        createdBy: 'Admin',
      },
      {
        id: '4',
        path: '/src/pages/Settings.tsx',
        title: 'Settings',
        description: 'User account and application settings',
        lastModified: '2025-05-03',
        route: '/settings',
        status: 'published',
        createdBy: 'Admin',
      },
      {
        id: '5',
        path: '/src/pages/Contact.tsx',
        title: 'Contact',
        description: 'Contact form and information',
        lastModified: '2025-05-02',
        route: '/contact',
        status: 'draft',
        createdBy: 'Admin',
      },
    ];
  }
};

// Get a single page by ID
export const getPageById = async (id: string): Promise<PageMetadata | null> => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching page ${id}:`, error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error in getPageById:`, error);
    // Return mock data for the specific ID
    const mockPages = await getAllPages();
    return mockPages.find(page => page.id === id) || null;
  }
};

// Get page source code
export const getPageSource = async (pageId: string): Promise<string> => {
  try {
    // In a real implementation, this would fetch the file content
    // For demonstration, return a sample React component
    return `import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PageComponent = () => {
  return (
    <PageLayout title="Sample Page">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Sample Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This is a sample page content. You can edit this page in the admin interface.</p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PageComponent;`;
  } catch (error) {
    console.error(`Error fetching source for page ${pageId}:`, error);
    return '';
  }
};

// Create a new page
export const createPage = async (pageData: Partial<PageMetadata>): Promise<PageMetadata | null> => {
  try {
    // In a real implementation, this would:
    // 1. Create a new file with the boilerplate code
    // 2. Insert the page record in the database
    // 3. Return the created page data
    
    // Mock implementation for demonstration
    const newPage: PageMetadata = {
      id: Date.now().toString(),
      path: `/src/pages/${pageData.title?.replace(/\s+/g, '')}.tsx`,
      title: pageData.title || 'Untitled Page',
      description: pageData.description || '',
      lastModified: new Date().toISOString(),
      route: pageData.route || `/untitled-${Date.now()}`,
      status: pageData.status || 'draft',
      createdBy: 'Admin',
      components: [],
    };
    
    return newPage;
  } catch (error) {
    console.error('Error creating page:', error);
    return null;
  }
};

// Update an existing page
export const updatePage = async (pageId: string, pageData: Partial<PageMetadata>): Promise<boolean> => {
  try {
    // In a real implementation, this would:
    // 1. Update the page record in the database
    // 2. Update the file content if necessary
    console.log(`Updating page ${pageId} with data:`, pageData);
    
    // For demonstration, return success
    return true;
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error);
    return false;
  }
};

// Create a new page draft
export const createPageDraft = async (pageId: string, content: string): Promise<PageDraft | null> => {
  try {
    // In a real implementation, this would create a draft record in the database
    const newDraft: PageDraft = {
      id: Date.now().toString(),
      pageId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
      status: 'active',
    };
    
    return newDraft;
  } catch (error) {
    console.error(`Error creating draft for page ${pageId}:`, error);
    return null;
  }
};

// Get page drafts
export const getPageDrafts = async (pageId: string): Promise<PageDraft[]> => {
  try {
    // In a real implementation, this would fetch drafts from the database
    
    // For demonstration, return mock data
    return [
      {
        id: '1',
        pageId,
        content: '// Draft 1 content',
        createdAt: '2025-05-06T10:30:00Z',
        createdBy: 'Admin',
        status: 'active',
      },
      {
        id: '2',
        pageId,
        content: '// Draft 2 content',
        createdAt: '2025-05-06T11:15:00Z',
        createdBy: 'Admin',
        status: 'discarded',
      },
    ];
  } catch (error) {
    console.error(`Error fetching drafts for page ${pageId}:`, error);
    return [];
  }
};

// Get page versions
export const getPageVersions = async (pageId: string): Promise<PageVersion[]> => {
  try {
    // In a real implementation, this would fetch versions from the database
    
    // For demonstration, return mock data
    return [
      {
        id: '1',
        pageId,
        versionNumber: 1,
        content: '// Version 1 content',
        createdAt: '2025-05-01T10:30:00Z',
        createdBy: 'Admin',
        changes: 'Initial version',
      },
      {
        id: '2',
        pageId,
        versionNumber: 2,
        content: '// Version 2 content',
        createdAt: '2025-05-03T14:45:00Z',
        createdBy: 'Admin',
        changes: 'Updated layout and styles',
      },
      {
        id: '3',
        pageId,
        versionNumber: 3,
        content: '// Version 3 content',
        createdAt: '2025-05-05T09:15:00Z',
        createdBy: 'Admin',
        changes: 'Added new features and components',
      },
    ];
  } catch (error) {
    console.error(`Error fetching versions for page ${pageId}:`, error);
    return [];
  }
};

// Add a component to a page
export const addComponentToPage = async (
  pageId: string, 
  componentId: string, 
  componentName: string,
  props: Record<string, any>
): Promise<boolean> => {
  try {
    // In a real implementation, this would:
    // 1. Update the page file to add the component
    // 2. Update the page record in the database
    
    console.log(`Adding component ${componentName} to page ${pageId}`);
    
    // For demonstration, return success
    return true;
  } catch (error) {
    console.error(`Error adding component to page ${pageId}:`, error);
    return false;
  }
};

// Delete a page
export const deletePage = async (pageId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would:
    // 1. Delete the page record from the database
    // 2. Optionally archive the file rather than deleting it
    
    console.log(`Deleting page ${pageId}`);
    
    // For demonstration, return success
    return true;
  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error);
    return false;
  }
};

export default {
  getAllPages,
  getPageById,
  getPageSource,
  createPage,
  updatePage,
  createPageDraft,
  getPageDrafts,
  getPageVersions,
  addComponentToPage,
  deletePage,
};
