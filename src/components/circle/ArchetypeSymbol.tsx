
import React from 'react';
import { Archetype } from '@/utils/archetypes';

interface ArchetypeSymbolProps {
  archetype: Archetype;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

const ArchetypeSymbol: React.FC<ArchetypeSymbolProps> = ({
  archetype,
  size = 'md',
  glow = true,
  className = ''
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const containerSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center ${containerSizeClass[size]} ${className}`}
      style={{ 
        backgroundColor: `${archetype.themeColor}20`,
        borderColor: `${archetype.themeColor}40`,
        borderWidth: '1px',
        boxShadow: glow ? `0 0 15px ${archetype.themeColor}30` : 'none'
      }}
    >
      <img
        src={archetype.symbol}
        alt={archetype.name}
        className={`${sizeClass[size]}`}
        style={{
          filter: glow ? `drop-shadow(0 0 3px ${archetype.themeColor})` : 'none'
        }}
      />
    </div>
  );
};

export default ArchetypeSymbol;
