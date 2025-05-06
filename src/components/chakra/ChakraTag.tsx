
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getChakraColor, getChakraInfo, ChakraTag as ChakraTagType } from '@/types/chakras';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface ChakraTagProps {
  chakra?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const ChakraTag: React.FC<ChakraTagProps> = ({
  chakra,
  size = 'md',
  showTooltip = true,
  className = ''
}) => {
  if (!chakra) return null;
  
  const chakraInfo = getChakraInfo(chakra);
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
