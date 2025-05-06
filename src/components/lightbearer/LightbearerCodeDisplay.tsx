
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import { LightbearerCode } from '@/context/JourneyContext';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Music, 
  Star, 
  Heart, 
  Flame, 
  Zap 
} from 'lucide-react';

interface LightbearerCodeDisplayProps {
  className?: string;
  showLabel?: boolean;
}

const LightbearerCodeDisplay: React.FC<LightbearerCodeDisplayProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { user } = useAuth();
  const { activeJourney, currentLightbearerCode } = useJourney();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animate when code changes
  useEffect(() => {
    if (currentLightbearerCode) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentLightbearerCode?.code_name]);
  
  // If no user or no active journey, show nothing
  if (!user || !activeJourney) {
    return null;
  }
  
  // If no code unlocked yet
  if (!currentLightbearerCode) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showLabel && (
          <span className="text-xs text-gray-400">Lightbearer: </span>
        )}
        <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700/50">
          Initiate
        </Badge>
      </div>
    );
  }
  
  // Map code_name to icon
  const getCodeIcon = () => {
    switch (currentLightbearerCode.icon) {
      case 'sparkles': return <Sparkles className="h-3.5 w-3.5" />;
      case 'book-open': return <BookOpen className="h-3.5 w-3.5" />;
      case 'music': return <Music className="h-3.5 w-3.5" />;
      case 'star': return <Star className="h-3.5 w-3.5" />;
      case 'heart': return <Heart className="h-3.5 w-3.5" />;
      case 'flame': return <Flame className="h-3.5 w-3.5" />;
      case 'zap': return <Zap className="h-3.5 w-3.5" />;
      default: return <Star className="h-3.5 w-3.5" />;
    }
  };
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showLabel && (
        <span className="text-xs text-gray-300">Lightbearer: </span>
      )}
      <Badge 
        variant="outline" 
        className={`text-xs flex items-center gap-1.5 
          ${isAnimating ? 'animate-pulse bg-purple-500/30 border-purple-400/40' : 'bg-indigo-900/50 border-indigo-500/50'}`}
      >
        {getCodeIcon()}
        {currentLightbearerCode.title}
      </Badge>
    </div>
  );
};

export default LightbearerCodeDisplay;
