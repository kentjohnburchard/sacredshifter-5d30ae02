
export type NavItem = {
  label: string;
  path: string;
  icon: string;
  chakraColor?: string;
  isActive?: boolean;
  key?: PageKey; // Add key property
};

// Add PageKey type
export type PageKey = string;

// Default navigation items
export const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: 'Home',
    chakraColor: '#a855f7', // purple
    isActive: true,
    key: 'home'
  },
  {
    label: 'Journeys',
    path: '/journeys',
    icon: 'Map',
    chakraColor: '#8b5cf6', // violet
    isActive: true,
    key: 'journeys'
  },
  {
    label: 'Frequency Engine',
    path: '/frequency',
    icon: 'Music',
    chakraColor: '#6366f1', // indigo
    isActive: true,
    key: 'frequency'
  },
  {
    label: 'Sacred Circle',
    path: '/sacred-circle',
    icon: 'Circle',
    chakraColor: '#ec4899', // pink
    isActive: true,
    key: 'sacred-circle'
  },
  {
    label: 'Lightbearer',
    path: '/lightbearer',
    icon: 'Star',
    chakraColor: '#eab308', // yellow
    isActive: true,
    key: 'lightbearer'
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    chakraColor: '#3b82f6', // blue
    isActive: true,
    key: 'profile'
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    chakraColor: '#64748b', // slate
    isActive: true,
    key: 'settings'
  },
  // Additional required items for Header.tsx
  {
    label: 'Sacred Blueprint',
    path: '/sacred-blueprint',
    icon: 'Star',
    chakraColor: '#8b5cf6',
    isActive: true,
    key: 'sacredBlueprint'
  },
  {
    label: 'Frequency Library',
    path: '/frequency-library',
    icon: 'Music',
    chakraColor: '#6366f1',
    isActive: true,
    key: 'frequencyLibrary'
  },
  {
    label: 'Heart Center',
    path: '/heart-center',
    icon: 'Heart',
    chakraColor: '#ec4899',
    isActive: true,
    key: 'heartCenter'
  },
  {
    label: 'Trinity Gateway',
    path: '/trinity-gateway',
    icon: 'Triangle',
    chakraColor: '#eab308',
    isActive: true,
    key: 'trinityGateway'
  },
  {
    label: 'About Founder',
    path: '/about-founder',
    icon: 'User',
    chakraColor: '#3b82f6',
    isActive: true,
    key: 'aboutFounder'
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: 'Mail',
    chakraColor: '#64748b',
    isActive: true,
    key: 'contact'
  }
];

// Export active pages for components that need it
export const activePages = navItems.filter(item => item.isActive !== false);

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

// Helper method to get an item by key
export const getNavItemByKey = (key: PageKey): NavItem | undefined => {
  return navItems.find(item => item.key === key);
};
