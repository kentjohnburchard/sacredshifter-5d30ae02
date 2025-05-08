
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChakraTag as ChakraTagType } from '@/types/chakras';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface ChakraTagProps {
  chakra?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

// Simple chakra info since getChakraInfo/getChakraColor don't exist
const basicChakraInfo = {
  'Root': {
    name: 'Root',
    color: '#FF0000',
    bgColor: '#FF000022',
    element: 'Earth',
    frequency: '396',
    description: 'Associated with survival and security.'
  },
  'Sacral': {
    name: 'Sacral',
    color: '#FF7F00',
    bgColor: '#FF7F0022',
    element: 'Water',
    frequency: '417',
    description: 'Associated with creativity and passion.'
  },
  'Solar Plexus': {
    name: 'Solar Plexus',
    color: '#FFFF00',
    bgColor: '#FFFF0022',
    element: 'Fire',
    frequency: '528',
    description: 'Associated with willpower and self-esteem.'
  },
  'Heart': {
    name: 'Heart',
    color: '#00FF00',
    bgColor: '#00FF0022',
    element: 'Air',
    frequency: '639',
    description: 'Associated with love and compassion.'
  },
  'Throat': {
    name: 'Throat',
    color: '#00FFFF',
    bgColor: '#00FFFF22',
    element: 'Sound',
    frequency: '741',
    description: 'Associated with communication and expression.'
  },
  'Third Eye': {
    name: 'Third Eye',
    color: '#0000FF',
    bgColor: '#0000FF22',
    element: 'Light',
    frequency: '852',
    description: 'Associated with intuition and insight.'
  },
  'Crown': {
    name: 'Crown',
    color: '#8B00FF',
    bgColor: '#8B00FF22',
    element: 'Thought',
    frequency: '963',
    description: 'Associated with higher consciousness and spiritual connection.'
  },
  'Transpersonal': {
    name: 'Transpersonal',
    color: '#FFFFFF',
    bgColor: '#FFFFFF22',
    element: 'Unity',
    frequency: '1074',
    description: 'Associated with transcendence and divine connection.'
  }
};

const ChakraTag: React.FC<ChakraTagProps> = ({
  chakra,
  size = 'md',
  showTooltip = true,
  className = ''
}) => {
  if (!chakra) return null;
  
  const chakraInfo = basicChakraInfo[chakra as keyof typeof basicChakraInfo];
  if (!chakraInfo) return null;
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-3'
  };

  const badgeContent = (
    <Badge
      className={`
        font-medium border-none
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: chakraInfo.bgColor,
        color: chakraInfo.color,
        borderColor: chakraInfo.color
      }}
    >
      {chakra}
    </Badge>
  );
  
  if (showTooltip) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span>{badgeContent}</span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold" style={{ color: chakraInfo.color }}>
              {chakraInfo.name} Chakra
            </h4>
            <p className="text-sm text-gray-300">{chakraInfo.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {chakraInfo.element && (
                <span>Element: {chakraInfo.element}</span>
              )}
              {chakraInfo.frequency && (
                <span>Frequency: {chakraInfo.frequency} Hz</span>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }
  
  return badgeContent;
};

export default ChakraTag;
