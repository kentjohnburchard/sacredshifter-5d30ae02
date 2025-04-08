import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import {
  Home,
  Music,
  Heart,
  HeartPulse,
  Sparkles,
  Activity,
  BookOpen,
  Contact,
  User,
  Settings,
  Lightbulb,
  Flame,
  Compass,
  Clock,
  Map,
  Brain,
  BarChart3,
} from 'lucide-react';

// Group navigation items by category to match site map structure
const navItems = [
  // Main Pages
  { href: '/dashboard', icon: Home, label: 'Dashboard', category: 'main' },
  { href: '/energy-check', icon: Activity, label: 'Energy Check', category: 'main' },
  { href: '/sacred-blueprint', icon: Sparkles, label: 'Sacred Blueprint', category: 'main' },
  { href: '/shift-perception', icon: Brain, label: 'Shift Perception', category: 'main' },
  
  // Personal Growth
  { href: '/heart-center', icon: Heart, label: 'Heart Center', category: 'growth' },
  { href: '/heart-dashboard', icon: HeartPulse, label: 'Heart Dashboard', category: 'growth' },
  { href: '/alignment', icon: BarChart3, label: 'Alignment', category: 'growth' },
  { href: '/intentions', icon: Lightbulb, label: 'Intentions', category: 'growth' },
  { href: '/focus', icon: Brain, label: 'Focus', category: 'growth' },
  
  // Sacred Knowledge
  { href: '/hermetic-wisdom', icon: BookOpen, label: 'Hermetic Wisdom', category: 'knowledge' },
  { href: '/harmonic-map', icon: Compass, label: 'Harmonic Map', category: 'knowledge' },
  { href: '/astrology', icon: Lightbulb, label: 'Astrology', category: 'knowledge' },
  { href: '/trinity-gateway', icon: Flame, label: 'Trinity Gateway', category: 'knowledge' },
  
  // Music & Frequencies
  { href: '/music-library', icon: Music, label: 'Music Library', category: 'music' },
  { href: '/journey-templates', icon: Map, label: 'Journey Templates', category: 'music' },
  
  // Account & Information
  { href: '/profile', icon: User, label: 'Profile', category: 'account' },
  { href: '/personal-vibe', icon: Settings, label: 'My Vibe', category: 'account' },
  { href: '/subscription', icon: User, label: 'Subscription', category: 'account' },
  { href: '/about-founder', icon: User, label: 'About Founder', category: 'account' },
  { href: '/contact', icon: Contact, label: 'Contact', category: 'account' },
  
  // Timeline & Experience
  { href: '/timeline', icon: Clock, label: 'Timeline', category: 'timeline' },
  { href: '/emotion-engine', icon: HeartPulse, label: 'Emotion Engine', category: 'timeline' },
];

const SidebarNavItems = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  const location = useLocation();
  const { liftTheVeil } = useTheme();

  // Filter out navigation items if needed based on categories
  const renderNavItems = () => {
    return navItems.map((item) => {
      const isActive = location.pathname === item.href;
      
      return (
        <NavLink
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
            isActive
              ? "bg-purple-100 text-purple-900"
              : "text-gray-600 hover:bg-purple-50 hover:text-purple-900",
            liftTheVeil && isActive && "bg-pink-100 text-pink-900",
            liftTheVeil && !isActive && "hover:bg-pink-50 hover:text-pink-900"
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5 mr-2",
              isActive
                ? liftTheVeil
                  ? "text-pink-800"
                  : "text-purple-800"
                : "text-gray-500"
            )}
          />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      );
    });
  };

  return (
    <div className="space-y-1">
      {renderNavItems()}
      
      {/* Site Map Link for easy access */}
      {!isCollapsed && (
        <NavLink
          to="/site-map"
          className="flex items-center py-2 px-3 text-sm rounded-md transition-colors text-gray-600 hover:bg-purple-50 hover:text-purple-900 mt-4 border-t border-purple-50 pt-4"
        >
          <Map className="h-5 w-5 mr-2 text-gray-500" />
          <span>Site Map</span>
        </NavLink>
      )}
    </div>
  );
};

export default SidebarNavItems;
