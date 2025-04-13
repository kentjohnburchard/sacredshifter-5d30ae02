
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, Sparkles, BookOpen, Star } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const BottomNavigation: React.FC = () => {
  const navItems: NavItem[] = [
    { label: 'Sound Journeys', icon: <Music className="w-5 h-5" />, path: '/journey-templates' },
    { label: 'Hermetic Wisdom', icon: <BookOpen className="w-5 h-5" />, path: '/hermetic-wisdom' },
    { label: 'Heart Center', icon: <Heart className="w-5 h-5" />, path: '/heart-center' },
    { label: 'Manifestation', icon: <Sparkles className="w-5 h-5" />, path: '/intentions' },
    { label: 'Astrology', icon: <Star className="w-5 h-5" />, path: '/astrology' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-purple-900/30 py-2 px-4 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center text-xs text-white/70 hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-full bg-purple-900/40">
              {item.icon}
            </div>
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
