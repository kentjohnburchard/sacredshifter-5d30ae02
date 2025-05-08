
export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  active: boolean;
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
  { name: 'Home', path: '/home', active: activePages.home },
  { name: 'Sacred Blueprint', path: '/sacred-blueprint', active: activePages.sacredBlueprint },
  { name: 'Frequency Library', path: '/frequency-library', active: activePages.frequencyLibrary },
  { name: 'Heart Center', path: '/heart-center', active: activePages.heartCenter },
  { name: 'Trinity Gateway', path: '/trinity-gateway', active: activePages.trinityGateway },
  { name: 'About Founder', path: '/about-founder', active: activePages.aboutFounder },
  { name: 'Contact', path: '/contact', active: activePages.contact }
];
