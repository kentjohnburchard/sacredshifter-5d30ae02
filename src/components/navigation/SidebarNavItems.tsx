
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import {
  Home,
  Music,
  BarChart3,
  Heart,
  Clock,
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
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/heart-center', icon: Heart, label: 'Heart Center' },
  { href: '/hermetic-wisdom', icon: BookOpen, label: 'Hermetic Wisdom' },
  { href: '/harmonic-map', icon: Compass, label: 'Harmonic Map' },
  { href: '/sacred-blueprint', icon: Sparkles, label: 'Sacred Blueprint' },
  { href: '/trinity-gateway', icon: Flame, label: 'Trinity Gateway' },
  { href: '/energy-check', icon: Activity, label: 'Energy Check' },
  { href: '/music-library', icon: Music, label: 'Music Library' },
  { href: '/astrology', icon: Lightbulb, label: 'Astrology' },
  { href: '/timeline', icon: Clock, label: 'Timeline' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/personal-vibe', icon: Settings, label: 'Vibe Settings' },
  { href: '/contact', icon: Contact, label: 'Contact' },
];

export function SidebarNavItems({ isCollapsed }: { isCollapsed?: boolean }) {
  const location = useLocation();
  const { liftTheVeil } = useTheme();

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
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
      })}
    </div>
  );
}
