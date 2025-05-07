// Navigation config to manage which pages are active and should be displayed in navigation
export const activePages = {
  home: true,
  dashboard: true,
  sacredBlueprint: false,
  frequencyLibrary: false,
  trinityGateway: false,
  heartCenter: false,
  emotionEngine: false,
  timeline: false,
  musicGenerator: false,
  mirrorPortal: false,
  frequencyShift: false,
  shiftPerception: false,
  hermeticPrinciples: false,
  soulScribe: false,
  deityOracle: false,
  astralAttunement: false,
  subscription: true,
  aboutFounder: true,
  contact: true,
  profile: true,
  harmonicMap: false,
  heartDashboard: false,
  alignment: false,
  energyCheck: false,
  focus: false,
  hermeticWisdom: false,
  journeyTemplates: false,
  journeys: true,
  astrology: false,
  siteMap: true,
  sacredSpectrum: true,
  journeysDirectory: true,
  circle: true,
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
    path: "/",
    key: "home" as PageKey,
    icon: "HomeIcon",
    label: "Home",
  },
  {
    path: "/sacred-circle",
    key: "circle" as PageKey,
    icon: "Users",
    label: "Sacred Circle",
  },
  {
    path: "/journeys",
    key: "journeys" as PageKey,
    icon: "Map",
    label: "Sacred Journeys",
  },
  {
    path: "/sacred-spectrum",
    key: "sacredSpectrum" as PageKey,
    icon: "Sparkles",
    label: "Sacred Spectrum",
  },
  {
    path: "/about-founder",
    key: "aboutFounder" as PageKey,
    icon: "User2",
    label: "About the Founder",
  },
  {
    path: "/subscription",
    key: "subscription" as PageKey,
    icon: "CreditCard",
    label: "Subscription",
  },
  {
    path: "/contact",
    key: "contact" as PageKey,
    icon: "Mail",
    label: "Contact",
  },
  {
    path: "/admin",
    key: "admin" as PageKey,
    icon: "Settings",
    label: "Admin",
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
    path: "/trinity-gateway",
    key: "trinityGateway" as PageKey,
    icon: "Triangle",
    label: "Trinity Gateway™",
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
  {
    path: "/journeys-directory",
    key: "journeysDirectory" as PageKey,
    icon: "Map",
    label: "Sacred Journeys",
  },
];

// Helper function to get active nav items
export const getActiveNavItems = () => {
  // Ensure we don't have duplicate routes in the final navigation
  const uniqueKeys = new Set();
  return navItems.filter(item => {
    // For admin route, only show in dev mode
    if (item.key === "admin" && process.env.NODE_ENV !== 'development') {
      return false;
    }
    
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
