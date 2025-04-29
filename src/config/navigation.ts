
// Navigation config to manage which pages are active and should be displayed in navigation
export const activePages = {
  home: true,
  dashboard: true,
  sacredBlueprint: true,
  frequencyLibrary: true,
  trinityGateway: true,
  heartCenter: true,
  emotionEngine: false,
  timeline: false,
  musicGenerator: false,
  mirrorPortal: false,
  frequencyShift: false,
  shiftPerception: true,
  hermeticPrinciples: true,
  soulScribe: false,
  deityOracle: false,
  astralAttunement: false,
  subscription: true,
  aboutFounder: true,
  contact: true,
  profile: true,
  harmonicMap: true,
  heartDashboard: true,
  alignment: true,
  energyCheck: true,
  focus: true,
  hermeticWisdom: true,
  journeyTemplates: true,
  journeys: true,
  astrology: true,
  siteMap: true,
};

// Type definition for page configuration
export type PageKey = keyof typeof activePages;

// Navigation items configuration
export const navItems = [
  {
    path: "/dashboard",
    key: "dashboard" as PageKey,
    icon: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    path: "/home",
    key: "home" as PageKey,
    icon: "HomeIcon",
    label: "Home",
  },
  {
    path: "/sacred-blueprint",
    key: "sacredBlueprint" as PageKey,
    icon: "LayoutTemplate",
    label: "Sacred Blueprint™",
  },
  {
    path: "/frequency-library",
    key: "frequencyLibrary" as PageKey,
    icon: "Music",
    label: "Frequency Library",
  },
  {
    path: "/heart-center",
    key: "heartCenter" as PageKey,
    icon: "Heart",
    label: "Heart Center",
  },
  {
    path: "/emotion-engine",
    key: "emotionEngine" as PageKey,
    icon: "Heart",
    label: "Emotion Engine™",
  },
  {
    path: "/timeline",
    key: "timeline" as PageKey,
    icon: "Activity",
    label: "Timeline",
  },
  {
    path: "/music-generator",
    key: "musicGenerator" as PageKey,
    icon: "Music4",
    label: "Music Generator",
  },
  {
    path: "/mirror-portal",
    key: "mirrorPortal" as PageKey,
    icon: "Compass",
    label: "Mirror Portal",
  },
  {
    path: "/frequency-shift",
    key: "frequencyShift" as PageKey,
    icon: "Zap",
    label: "Frequency Shift™",
  },
  {
    path: "/shift-perception",
    key: "shiftPerception" as PageKey,
    icon: "Brain",
    label: "Shift Perception",
  },
  {
    path: "/hermetic-principles",
    key: "hermeticPrinciples" as PageKey,
    icon: "BookText",
    label: "Hermetic Principles",
  },
  {
    path: "/soul-scribe",
    key: "soulScribe" as PageKey,
    icon: "BookOpen",
    label: "Soul Scribe™",
  },
  {
    path: "/deity-oracle",
    key: "deityOracle" as PageKey,
    icon: "Flame",
    label: "Deity Oracle™",
  },
  {
    path: "/astral-attunement",
    key: "astralAttunement" as PageKey,
    icon: "Star",
    label: "Astral Attunement™",
  },
  {
    path: "/subscription",
    key: "subscription" as PageKey,
    icon: "User2",
    label: "Subscription",
  },
  {
    path: "/trinity-gateway",
    key: "trinityGateway" as PageKey,
    icon: "Triangle",
    label: "Trinity Gateway™",
  },
  {
    path: "/about-founder",
    key: "aboutFounder" as PageKey,
    icon: "User2",
    label: "About the Founder",
  },
  {
    path: "/contact",
    key: "contact" as PageKey,
    icon: "Mail",
    label: "Contact",
  },
  {
    path: "/harmonic-map",
    key: "harmonicMap" as PageKey,
    icon: "Map",
    label: "Harmonic Map",
  },
  {
    path: "/heart-dashboard",
    key: "heartDashboard" as PageKey,
    icon: "HeartPulse",
    label: "Heart Dashboard",
  },
  {
    path: "/alignment",
    key: "alignment" as PageKey,
    icon: "BarChart3",
    label: "Alignment",
  },
  {
    path: "/energy-check",
    key: "energyCheck" as PageKey,
    icon: "Activity",
    label: "Energy Check",
  },
  {
    path: "/focus",
    key: "focus" as PageKey,
    icon: "Brain",
    label: "Focus",
  },
  {
    path: "/hermetic-wisdom",
    key: "hermeticWisdom" as PageKey,
    icon: "BookOpen",
    label: "Hermetic Wisdom",
  },
  {
    path: "/journey-templates",
    key: "journeyTemplates" as PageKey,
    icon: "Map",
    label: "Journey Templates",
  },
  {
    path: "/astrology",
    key: "astrology" as PageKey,
    icon: "Star",
    label: "Astrology",
  },
  {
    path: "/profile",
    key: "profile" as PageKey,
    icon: "User",
    label: "Profile",
  },
  {
    path: "/site-map",
    key: "siteMap" as PageKey,
    icon: "Map",
    label: "Site Map",
  },
];

// Helper function to get active nav items
export const getActiveNavItems = () => {
  // Ensure we don't have duplicate routes in the final navigation
  const uniqueKeys = new Set();
  return navItems.filter(item => {
    // Check if the item is active AND has not been included yet
    const isActive = activePages[item.key];
    const isUnique = !uniqueKeys.has(item.path);
    
    // Track the paths we've seen
    if (isUnique) {
      uniqueKeys.add(item.path);
    }
    
    return isActive && isUnique;
  });
};

// Sidebar links configuration
export const sidebarLinks = [
  {
    title: "Sacred Grid Visualizer",
    href: "/sacred-grid",
    icon: "grid-3x3", // Using a grid icon from Lucide
  },
];
