
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { 
  Home, Music, Radio, Heart, 
  BookOpen, Compass, Users, 
  Sparkles, Brain, Sun, Trophy,
  CalendarDays
} from 'lucide-react';

interface SidebarNavItemsProps {
  isCollapsed: boolean;
  onLinkClick?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ 
  isCollapsed, 
  onLinkClick = () => {} 
}) => {
  const { liftTheVeil } = useTheme();

  // Define navigation items
  const navItems = [
    {
      to: '/home',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/journey-index',
      label: 'Sacred Journeys',
      icon: Compass,
    },
    {
      to: '/frequency-engine',
      label: 'Frequency Engine',
      icon: Radio,
    },
    {
      to: '/music-library',
      label: 'Sound Library',
      icon: Music,
    },
    {
      to: '/circle',
      label: 'Sacred Circle',
      icon: Users,
    },
    {
      to: '/daily-practice',
      label: 'Daily Practice',
      icon: CalendarDays,
    },
    {
      to: '/heart',
      label: 'Heart Center',
      icon: Heart,
    },
    {
      to: '/hermetic-journey',
      label: 'Hermetic Wisdom',
      icon: BookOpen,
    },
    {
      to: '/lightbearer',
      label: 'Lightbearer',
      icon: Sun,
    },
    {
      to: '/about',
      label: 'About',
      icon: Sparkles,
    }
  ];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `
            flex items-center gap-3 rounded-lg px-3 py-2
            transition-all duration-300 
            ${isActive 
              ? `bg-white/10 text-white` 
              : `text-gray-400 hover:bg-white/5 hover:text-white`}
            ${isCollapsed ? 'justify-center' : ''}
          `}
          style={{
            textShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
          }}
          onClick={onLinkClick}
        >
          <item.icon
            className={`h-5 w-5 shrink-0 transition-colors duration-300
              ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'}`}
          />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
