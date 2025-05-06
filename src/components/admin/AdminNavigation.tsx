
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  File, 
  Database, 
  Users, 
  Settings, 
  Image, 
  BarChart, 
  Shield, 
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  
  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: <BarChart size={20} />,
      description: 'Overview of site activity and metrics'
    },
    {
      label: 'Pages',
      path: '/admin/pages',
      icon: <File size={20} />,
      description: 'Create and manage site pages'
    },
    {
      label: 'Components',
      path: '/admin/components',
      icon: <Package size={20} />,
      description: 'Browse and manage UI components'
    },
    {
      label: 'Database',
      path: '/admin/database',
      icon: <Database size={20} />,
      description: 'View and manage database records'
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
      description: 'Manage user accounts and roles'
    },
    {
      label: 'Media',
      path: '/admin/media',
      icon: <Image size={20} />,
      description: 'Organize and upload media files'
    },
    {
      label: 'Layouts',
      path: '/admin/layouts',
      icon: <Layout size={20} />,
      description: 'Design page layouts and templates'
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
      description: 'Configure site settings'
    },
    {
      label: 'Security',
      path: '/admin/security',
      icon: <Shield size={20} />,
      description: 'Security and access control'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {navigationItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className="text-decoration-none"
        >
          <Button
            variant={location.pathname === item.path ? 'default' : 'outline'}
            className="w-full md:w-auto justify-start transition-all"
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default AdminNavigation;
