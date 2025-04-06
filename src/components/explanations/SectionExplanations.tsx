
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export type SectionExplanationType = {
  title: string;
  standard: string;
  kent: string;
};

export type SectionKey = 
  | "home" 
  | "mirrorPortal" 
  | "heartFrequency" 
  | "soulHug" 
  | "realityEngine" 
  | "journeyTracker" 
  | "vibeCustomizer" 
  | "soundscapes" 
  | "fractalVisualiser" 
  | "cosmicProfile" 
  | "settings" 
  | "loveDashboard"
  | "communityWall";

const sectionExplanations: Record<SectionKey, SectionExplanationType> = {
  home: {
    title: "Home / Dashboard",
    standard: "Welcome to your personal sanctuary of vibrational healing. Here, you'll find pathways to align your frequency, nurture your energy, and reconnect with your truest self. Take a moment to breathe and explore what calls to you.",
    kent: "Welcome home, cosmic wanderer. This is your energetic command center—your vibe HQ. Each portal vibrates at the frequency of your potential. What magic are we making today?"
  },
  mirrorPortal: {
    title: "Mirror Portal",
    standard: "Welcome to your sacred reflection space. Here, you'll meet your own eyes and hear the truth your soul already knows. Let each affirmation land softly as you reconnect with your inner radiance.",
    kent: "Alright gorgeous, time to face the badass light within you. This ain't a mirror—it's a portal to power. Let these affirmations slap your shadow gently while your higher self winks at you."
  },
  heartFrequency: {
    title: "Heart Frequency Playlist",
    standard: "These sacred sounds are tuned to the frequency of love and compassion. Allow these healing vibrations to open, nurture, and expand your heart center as you journey inward to your most tender spaces.",
    kent: "Your heart isn't just an organ—it's a cosmic radio receiver. These frequencies bypass your overthinking mind and broadcast directly to your soul. Turn it up and let your heart remember what your head forgot."
  },
  soulHug: {
    title: "Send a Soul Hug",
    standard: "Energy knows no distance. Send a vibration of love, healing, or encouragement to someone in need. Your intention creates ripples that reach further than you know.",
    kent: "Think of this as texting, but for souls. Your energy, their aura, no middleman. Send a vibe bomb of love that breaks through their cosmic inbox and lights up their entire field."
  },
  realityEngine: {
    title: "Reality Optimisation Engine",
    standard: "Coming soon: A sacred space where your intentions and the universe's wisdom meet. Here you'll learn to gently shape your experience through frequency and focused attention.",
    kent: "Coming soon: The universe's source code is about to be yours to play with. Not just manifestation—this is reality hacking with your frequency as the password. The multiverse is taking notes."
  },
  journeyTracker: {
    title: "Journey Tracker",
    standard: "Your personal path of transformation, documented with love. Witness your growth, celebrate your shifts, and recognize patterns as you move through your healing journey.",
    kent: "Your spiritual glow-up, tracked in real time. Watch yourself level up from cosmic rookie to frequency master. This is your highlight reel of awakening—and honey, the universe is watching."
  },
  vibeCustomizer: {
    title: "Vibe Customizer",
    standard: "Shape your experience to resonate with your unique energy signature. Choose colors, sounds, and patterns that feel like home to your soul as you create your sacred digital space.",
    kent: "Your energy deserves a custom fit, not spiritual fast fashion. Mix your cosmic colors, choose your power palette, and make this space as unique as your soul signature. Express yourself, celestial being."
  },
  soundscapes: {
    title: "Soundscapes & Breathwork",
    standard: "Immerse yourself in healing audio environments paired with guided breath awareness. Let each inhale bring renewal and each exhale release what no longer serves your highest good.",
    kent: "Breath is your first technology—time to upgrade the software. These soundscapes aren't just pretty noise; they're recoding your nervous system while you simply breathe and receive. Easy cosmic upgrade."
  },
  fractalVisualiser: {
    title: "Fractal Visualiser",
    standard: "Witness the mathematical beauty of the universe through sacred geometry in motion. These patterns mirror the very fabric of creation, inviting your mind to synchronize with divine order.",
    kent: "Your brain loves fractals like your soul loves freedom. These aren't just pretty patterns—they're the universe's source code made visible. Watch as your mind entrains to infinity and your perception cracks wide open."
  },
  cosmicProfile: {
    title: "Cosmic Profile",
    standard: "The stars witnessed your arrival and hold wisdom about your journey. Discover how celestial movements reflect your inner landscape and illuminate your path forward.",
    kent: "The cosmos threw a party when you were born and left you clues everywhere. Your chart isn't just a map—it's your soul's blueprint, your cosmic DNA. Time to remember what the stars already know about you."
  },
  settings: {
    title: "Settings / Vibe Mode Toggle",
    standard: "Adjust your experience to better serve your current needs. Toggle between consciousness modes to find the perfect balance of guidance and exploration for your journey today.",
    kent: "Consciousness has settings, didn't you know? Flip between cosmic comfort and spiritual sass with a click. Your journey, your rules—the universe is flexible like that."
  },
  loveDashboard: {
    title: "Love Dashboard",
    standard: "Witness the expansion of your heart center through your journey with Sacred Shifter. Watch as your compassion grows, your self-love deepens, and your capacity for connection blossoms.",
    kent: "Your heart metrics are off the charts, cosmic one! This is where we track your love stats, compassion high scores, and karmic bonus points. The universe keeps receipts on your kindness."
  },
  communityWall: {
    title: "Community Blessing Wall",
    standard: "A sacred space where our collective energies merge. Read blessings from fellow journeyers, share your own light, and feel the power of unified consciousness across distance.",
    kent: "Think of this as spiritual social media without the ego trips. Pure vibes, heartfelt blessings, and cosmic cheerleading from your soul fam across the globe. The internet, but make it enlightened."
  }
};

export type ExplanationProps = {
  section: SectionKey;
  className?: string;
};

const SectionExplanation: React.FC<ExplanationProps> = ({ section, className = "" }) => {
  const { kentMode } = useTheme();
  
  const explanation = sectionExplanations[section];
  const content = kentMode ? explanation.kent : explanation.standard;
  
  return (
    <div className={`section-explanation ${className}`}>
      <p className="text-base sm:text-lg leading-relaxed">{content}</p>
    </div>
  );
};

export default SectionExplanation;

// Helper function to get explanation text directly without rendering component
export const getExplanationText = (section: SectionKey, isKentMode: boolean): string => {
  return isKentMode ? sectionExplanations[section].kent : sectionExplanations[section].standard;
};

// Helper function to get explanation title
export const getExplanationTitle = (section: SectionKey): string => {
  return sectionExplanations[section].title;
};

// Export the explanations object for direct access if needed
export { sectionExplanations };
