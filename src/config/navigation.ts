
export type NavItem = {
  label: string;
  path: string;
  icon: string;
  chakraColor?: string;
  isActive?: boolean;
};

// Default navigation items
const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: 'Home',
    chakraColor: '#a855f7', // purple
    isActive: true
  },
  {
    label: 'Journeys',
    path: '/journeys',
    icon: 'Map',
    chakraColor: '#8b5cf6', // violet
    isActive: true
  },
  {
    label: 'Frequency Engine',
    path: '/frequency',
    icon: 'Music',
    chakraColor: '#6366f1', // indigo
    isActive: true
  },
  {
    label: 'Sacred Circle',
    path: '/sacred-circle',
    icon: 'Circle',
    chakraColor: '#ec4899', // pink
    isActive: true
  },
  {
    label: 'Lightbearer',
    path: '/lightbearer',
    icon: 'Star',
    chakraColor: '#eab308', // yellow
    isActive: true
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    chakraColor: '#3b82f6', // blue
    isActive: true
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    chakraColor: '#64748b', // slate
    isActive: true
  }
];

// Get all active navigation items
export const getActiveNavItems = (): NavItem[] => {
  return navItems.filter(item => item.isActive !== false);
};

// Get a specific navigation item by path
export const getNavItemByPath = (path: string): NavItem | undefined => {
  return navItems.find(item => item.path === path);
};

// Get a specific navigation item by label
export const getNavItemByLabel = (label: string): NavItem | undefined => {
  return navItems.find(item => item.label === label);
};
