
import { supabase } from '@/integrations/supabase/client';
import { ComponentMetadata, ComponentUsage } from '@/services/adminComponentsService';

/**
 * Enhanced Component Management Service
 * This service provides advanced functionality for managing components
 * across the application.
 */

// Get all registered components with their metadata
export const getAllComponents = async (): Promise<ComponentMetadata[]> => {
  try {
    // In a real implementation with the correct table structure, this would work:
    // const { data, error } = await supabase
    //   .from('components_registry')
    //   .select('*')
    //   .order('name');
    
    // For now, since the table doesn't exist, return sample data
    // console.error('Using mock component data since components_registry table is not available');
    return [
      {
        id: '1',
        name: 'Button',
        path: '@/components/ui/button.tsx',
        category: 'ui',
        description: 'Interactive button component with various styles and states',
        usageCount: 42,
        lastUpdated: '2025-05-04',
        props: [
          { name: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', required: false, description: 'Visual style of the button' },
          { name: 'size', type: '"default" | "sm" | "lg" | "icon"', required: false, description: 'Size of the button' },
          { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to display inside the button' },
          { name: 'asChild', type: 'boolean', required: false, description: 'Whether to render the button as its child' }
        ]
      },
      {
        id: '2',
        name: 'Card',
        path: '@/components/ui/card.tsx',
        category: 'ui',
        description: 'Container component for grouping related content',
        usageCount: 36,
        lastUpdated: '2025-05-03',
        props: [
          { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
          { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to display inside the card' }
        ]
      },
      {
        id: '3',
        name: 'Input',
        path: '@/components/ui/input.tsx',
        category: 'ui',
        description: 'Text input field for collecting user data',
        usageCount: 28,
        lastUpdated: '2025-05-01',
        props: [
          { name: 'type', type: 'string', required: false, description: 'Input type (text, password, etc)' },
          { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
          { name: 'value', type: 'string', required: false, description: 'Current value' },
          { name: 'onChange', type: '(e: React.ChangeEvent<HTMLInputElement>) => void', required: false, description: 'Change handler function' }
        ]
      },
      {
        id: '4',
        name: 'PageLayout',
        path: '@/components/layout/PageLayout.tsx',
        category: 'layout',
        description: 'Standard page layout with header and footer',
        usageCount: 22,
        lastUpdated: '2025-04-28',
        props: [
          { name: 'title', type: 'string', required: true, description: 'Page title' },
          { name: 'children', type: 'React.ReactNode', required: true, description: 'Page content' }
        ]
      },
      {
        id: '5',
        name: 'Avatar',
        path: '@/components/ui/avatar.tsx',
        category: 'ui',
        description: 'User avatar display component',
        usageCount: 18,
        lastUpdated: '2025-04-25',
        props: [
          { name: 'src', type: 'string', required: false, description: 'Image source URL' },
          { name: 'alt', type: 'string', required: false, description: 'Alternative text' },
          { name: 'fallback', type: 'string', required: false, description: 'Fallback text or element when image fails to load' }
        ]
      }
    ];
  } catch (error) {
    console.error('Error in getAllComponents:', error);
    // Return empty array in case of error
    return [];
  }
};

// Get component usage information
export const getComponentUsage = async (componentId: string): Promise<ComponentUsage[]> => {
  try {
    // In a real implementation with the correct table:
    // const { data, error } = await supabase
    //   .from('component_usages')
    //   .select('*')
    //   .eq('component_id', componentId);
    
    // For now, since the table doesn't exist, return sample data
    // console.error('Using mock usage data since component_usages table is not available');
    return [
      { pageId: '1', pagePath: '/src/pages/Home.tsx', pageName: 'Home', instanceCount: 3 },
      { pageId: '2', pagePath: '/src/pages/Dashboard.tsx', pageName: 'Dashboard', instanceCount: 5 },
      { pageId: '3', pagePath: '/src/pages/Settings.tsx', pageName: 'Settings', instanceCount: 2 },
    ];
  } catch (error) {
    console.error(`Error in getComponentUsage:`, error);
    // Return empty array in case of error
    return [];
  }
};

// Get component source code
export const getComponentSource = async (componentPath: string): Promise<string> => {
  try {
    // In a real implementation, this would fetch the file content
    // from the project or version control system
    
    // For demonstration, return mock source code
    if (componentPath.includes('button')) {
      return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;
    }
    
    return `// Source code for ${componentPath}\nimport React from 'react';\n\n// Component implementation...`;
  } catch (error) {
    console.error(`Error fetching source for ${componentPath}:`, error);
    return '';
  }
};

// Update component metadata
export const updateComponentMetadata = async (component: ComponentMetadata): Promise<boolean> => {
  try {
    // In a real implementation with correct tables:
    // const { error } = await supabase
    //   .from('components_registry')
    //   .update({
    //     name: component.name,
    //     description: component.description,
    //     category: component.category,
    //   })
    //   .eq('id', component.id);
    
    // For now, since the table doesn't exist, mock the update
    console.log(`Updating component ${component.name} metadata`, component);
    
    return true;
  } catch (error) {
    console.error(`Error in updateComponentMetadata:`, error);
    // For development, return success
    return true;
  }
};

// Add a component instance to a page
export const addComponentToPage = async (
  componentId: string, 
  pagePath: string, 
  props: Record<string, any>
): Promise<boolean> => {
  try {
    console.log(`Adding component ${componentId} to ${pagePath} with props:`, props);
    
    // For development, return success
    return true;
  } catch (error) {
    console.error(`Error in addComponentToPage:`, error);
    return false;
  }
};

// Create a new component
export const createComponent = async (
  name: string,
  category: string,
  template: string,
  props: Array<{ name: string, type: string, required: boolean, description?: string }>
): Promise<ComponentMetadata | null> => {
  try {
    const newComponent: ComponentMetadata = {
      id: Date.now().toString(),
      name,
      path: `@/components/${category.toLowerCase()}/${name.toLowerCase()}.tsx`,
      category,
      description: `${name} component`,
      usageCount: 0,
      lastUpdated: new Date().toISOString(),
      props
    };
    
    console.log(`Creating new component:`, newComponent);
    
    // For development, return mock data
    return newComponent;
  } catch (error) {
    console.error(`Error in createComponent:`, error);
    return null;
  }
};

// Analyze project for component usage
export const analyzeComponentUsage = async (): Promise<Record<string, number>> => {
  try {
    // For development, return mock data
    return {
      'Button': 42,
      'Card': 36,
      'Input': 28,
      'PageLayout': 22,
      'Avatar': 18,
    };
  } catch (error) {
    console.error(`Error in analyzeComponentUsage:`, error);
    return {};
  }
};

export default {
  getAllComponents,
  getComponentUsage,
  getComponentSource,
  updateComponentMetadata,
  addComponentToPage,
  createComponent,
  analyzeComponentUsage
};
