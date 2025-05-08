
export type PageKey = 'home' | 'sacredBlueprint' | 'frequencyLibrary' | 'heartCenter' | 'trinityGateway' | 'aboutFounder' | 'contact';

export interface NavItem {
  name: string;
  label: string;
  path: string;
  icon?: string;
  active: boolean;
  key: PageKey;
}

// Create a navigation configuration object with proper key structure
export const activePages = {
  home: true,
  sacredBlueprint: true,
  frequencyLibrary: true,
  heartCenter: true,
  trinityGateway: true,
  aboutFounder: true,
  contact: true
};

export const navItems: NavItem[] = [
  { name: 'Home', label: 'Home', path: '/home', active: activePages.home, key: 'home', icon: 'Home' },
  { name: 'Sacred Blueprint', label: 'Sacred Blueprint', path: '/sacred-blueprint', active: activePages.sacredBlueprint, key: 'sacredBlueprint', icon: 'Circle' },
  { name: 'Frequency Library', label: 'Frequency Library', path: '/frequency-library', active: activePages.frequencyLibrary, key: 'frequencyLibrary', icon: 'Music' },
  { name: 'Heart Center', label: 'Heart Center', path: '/heart-center', active: activePages.heartCenter, key: 'heartCenter', icon: 'Heart' },
  { name: 'Trinity Gateway', label: 'Trinity Gateway', path: '/trinity-gateway', active: activePages.trinityGateway, key: 'trinityGateway', icon: 'Triangle' },
  { name: 'About Founder', label: 'About Founder', path: '/about-founder', active: activePages.aboutFounder, key: 'aboutFounder', icon: 'User' },
  { name: 'Contact', label: 'Contact', path: '/contact', active: activePages.contact, key: 'contact', icon: 'Mail' }
];

// Function to get active nav items - used by the sidebar
export function getActiveNavItems(): NavItem[] {
  return navItems.filter(item => item.active);
}
