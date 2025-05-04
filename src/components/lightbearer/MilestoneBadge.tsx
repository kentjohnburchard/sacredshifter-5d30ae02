
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, MessageCircle, BookOpen, Music, Heart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type BadgeType = 'journal' | 'comment' | 'journey' | 'heart' | 'circle' | 'custom';

interface MilestoneBadgeProps {
  type: BadgeType;
  label: string;
  count?: number;
  tooltipText?: string;
}

const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({ 
  type, 
  label, 
  count, 
  tooltipText 
}) => {
  // Define icon based on badge type
  const getIcon = () => {
    switch(type) {
      case 'journal':
        return <BookOpen className="h-3.5 w-3.5 mr-1" />;
      case 'comment':
        return <MessageCircle className="h-3.5 w-3.5 mr-1" />;
      case 'journey':
        return <Music className="h-3.5 w-3.5 mr-1" />;
      case 'heart':
        return <Heart className="h-3.5 w-3.5 mr-1" />;
      case 'circle':
        return <MessageCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Award className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  // Define color based on badge type
  const getColorClasses = () => {
    switch(type) {
      case 'journal':
        return "bg-blue-500/10 hover:bg-blue-500/20 text-blue-200/90";
      case 'comment':
        return "bg-green-500/10 hover:bg-green-500/20 text-green-200/90";
      case 'journey':
        return "bg-purple-500/10 hover:bg-purple-500/20 text-purple-200/90";
      case 'heart':
        return "bg-pink-500/10 hover:bg-pink-500/20 text-pink-200/90";
      case 'circle':
        return "bg-teal-500/10 hover:bg-teal-500/20 text-teal-200/90";
      default:
        return "bg-amber-500/10 hover:bg-amber-500/20 text-amber-200/90";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={getColorClasses()}
          >
            {getIcon()}
            {label}
            {count !== undefined && ` (${count})`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText || `${label} badge`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MilestoneBadge;
