
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';
import FrequencyReaction from './FrequencyReaction';
import { useTheme } from '@/context/ThemeContext';

interface LightCodeMessageProps {
  message: {
    id: string;
    content: string;
    createdAt: Date | string;
    author: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
    emotionalTone?: 'Peaceful' | 'Uplifted' | 'Grounded' | 'Activated';
    chakra?: ChakraTag;
    frequency?: number;
    reactions?: Array<{
      type: string;
      count: number;
      userIds: string[];
    }>;
  };
  currentUserId?: string;
  onReact?: (messageId: string, reactionType: string) => void;
  onReply?: (messageId: string) => void;
}

const LightCodeMessage: React.FC<LightCodeMessageProps> = ({
  message,
  currentUserId,
  onReact,
  onReply
}) => {
  const { liftTheVeil } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get chakra color based on emotional tone or specified chakra
  const getChakraFromTone = (tone?: string): ChakraTag => {
    switch(tone) {
      case 'Peaceful': return 'Crown';
      case 'Uplifted': return 'Third Eye';
      case 'Grounded': return 'Root';
      case 'Activated': return 'Heart';
      default: return message.chakra || 'Throat';
    }
  };
  
  const chakra = getChakraFromTone(message.emotionalTone);
  const chakraColor = CHAKRA_COLORS[chakra];
  
  // Format creation date
  const formatDate = (date: Date | string) => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(messageDate);
  };
  
  // Get user initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex items-start gap-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src={message.author.avatarUrl} alt={message.author.name} />
          <AvatarFallback 
            style={{ 
              background: `linear-gradient(45deg, ${chakraColor}90, ${chakraColor}50)`
            }}
          >
            {getInitials(message.author.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{message.author.name}</span>
              
              {message.emotionalTone && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: chakraColor + '20',
                    color: chakraColor
                  }}
                >
                  {message.emotionalTone}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
          </div>
          
          <motion.div 
            className="mt-1 p-4 rounded-lg backdrop-blur-sm"
            style={{ 
              backgroundColor: `rgba(0, 0, 0, 0.3)`,
              border: `1px solid ${chakraColor}30`,
              boxShadow: isHovered ? `0 0 15px ${chakraColor}30` : 'none'
            }}
            animate={{ 
              boxShadow: isHovered ? `0 0 15px ${chakraColor}50` : `0 0 5px ${chakraColor}20`
            }}
          >
            <p className="text-gray-100">{message.content}</p>
            
            {message.frequency && (
              <div 
                className="mt-2 flex items-center gap-2 text-xs py-1 px-2 rounded-full w-fit"
                style={{ 
                  backgroundColor: chakraColor + '20',
                  color: chakraColor
                }}
              >
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: chakraColor }}></span>
                Resonates at {message.frequency}Hz
              </div>
            )}
          </motion.div>
          
          {/* Reactions section */}
          <div className="mt-2 flex items-center gap-2">
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex gap-1">
                {message.reactions.map((reaction) => (
                  <FrequencyReaction
                    key={reaction.type}
                    type={reaction.type}
                    count={reaction.count}
                    isActive={currentUserId ? reaction.userIds.includes(currentUserId) : false}
                    onClick={() => onReact && onReact(message.id, reaction.type)}
                  />
                ))}
              </div>
            )}
            
            <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => onReply && onReply(message.id)}
              >
                Reply
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => onReact && onReact(message.id, '432Hz')}
              >
                <span className="mr-1">🎶</span> 432Hz
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => onReact && onReact(message.id, '528Hz')}
              >
                <span className="mr-1">🔥</span> 528Hz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LightCodeMessage;
