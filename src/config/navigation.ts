
// Navigation config to manage which pages are active and should be displayed in navigation
export const activePages = {
  home: true,
  sacredBlueprint: true,
  frequencyLibrary: true,
  trinityGateway: true,
  heartFrequency: true,
  aboutFounder: true,
  contact: true,
  emotionEngine: false,
  timeline: false,
  musicGenerator: false,
  mirrorPortal: false,
  frequencyShift: false,
  soulScribe: false,
  deityOracle: false,
  astralAttunement: false,
  subscription: true,
  referral: false,
  heartCenter: true,
  profile: true,
};

// Type definition for page configuration
export type PageKey = keyof typeof activePages;

// Navigation items configuration
export const navItems = [
  {
    path: "/",
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
    path: "/frequency-shift",
    key: "frequencyShift" as PageKey,
    icon: "Zap",
    label: "Frequency Shift™",
  },
  {
    path: "/soul-scribe",
    key: "soulScribe" as PageKey,
    icon: "Brain",
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
    path: "/referral",
    key: "referral" as PageKey,
    icon: "Sparkles",
    label: "Referral Program",
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
];

// Helper function to get active nav items
export const getActiveNavItems = () => {
  return navItems.filter(item => activePages[item.key]);
};
