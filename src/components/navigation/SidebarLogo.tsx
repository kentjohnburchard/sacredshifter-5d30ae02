
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

interface SidebarLogoProps {
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ className }) => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Link to="/" className={`flex items-center justify-center text-white ${className}`}>
      <div className={`text-2xl font-bold leading-none flex flex-col items-center`}>
        <span className={`text-3xl ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'}`}>✧</span>
        <span className="text-sm tracking-wider mt-1">Sacred Shifter</span>
      </div>
    </Link>
  );
};

export default SidebarLogo;
