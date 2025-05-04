import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, Music, Users, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface NavLinksProps {
  className?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ className }) => {
  const { liftTheVeil } = useTheme();
  
  const links = [
    {
      to: '/',
      icon: <Home className="h-5 w-5" />,
      label: 'Home'
    },
    {
      to: '/timeline',
      icon: <Clock className="h-5 w-5" />,
      label: 'Timeline'
    },
    {
      to: '/frequencies',
      icon: <Music className="h-5 w-5" />,
      label: 'Frequencies'
    },
    {
      to: '/sacred-circle',
      icon: <Users className="h-5 w-5" />,
      label: 'Sacred Circle'
    },
    {
      to: '/prime-frequencies',
      icon: <Star className="h-5 w-5" />,
      label: 'Prime Frequencies'
    },
    {
      to: '/prime-activation',
      icon: <Sparkles className="h-5 w-5" />,
      label: 'Prime Activation'
    },
  ];
  
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? `bg-gradient-to-r ${
                    liftTheVeil
                      ? "from-pink-900/30 to-pink-800/20 text-pink-200"
                      : "from-purple-900/30 to-purple-800/20 text-purple-200"
                  }`
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            )
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;
