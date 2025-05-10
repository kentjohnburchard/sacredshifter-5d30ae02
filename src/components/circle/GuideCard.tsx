
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CHAKRA_COLORS, ChakraTag } from '@/types/chakras';
import { Play, BookmarkPlus, Share } from 'lucide-react';

interface GuideCardProps {
  item: {
    id: string;
    title: string;
    type: 'journey' | 'quote' | 'tone';
    description?: string;
    chakra?: ChakraTag;
    frequency?: number;
    audioUrl?: string;
    upvotes?: number;
    imageUrl?: string;
    authorName?: string;
    saved?: boolean;
  };
  onPlay?: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({
  item,
  onPlay,
  onSave,
  onShare
}) => {
  const chakra = item.chakra || 'Crown';
  const chakraColor = CHAKRA_COLORS[chakra];
  
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg" style={{ 
        backgroundColor: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        borderLeft: `3px solid ${chakraColor}`
      }}>
        <div className="relative">
          {item.imageUrl && (
            <div 
              className="h-32 w-full bg-center bg-cover"
              style={{ 
                backgroundImage: `url(${item.imageUrl})`,
                boxShadow: `inset 0 -20px 30px -10px rgba(0,0,0,0.7)`
              }}
            />
          )}
          
          {item.frequency && (
            <div 
              className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs backdrop-blur-sm"
              style={{ backgroundColor: `${chakraColor}40`, color: chakraColor }}
            >
              {item.frequency}Hz
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2 flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{item.title}</h3>
              {item.authorName && (
                <p className="text-xs text-white/60 mt-0.5">By {item.authorName}</p>
              )}
            </div>
            
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
              style={{ backgroundColor: `${chakraColor}20`, color: chakraColor }}
            >
              {item.type === 'journey' && 'Journey'}
              {item.type === 'quote' && 'Wisdom'}
              {item.type === 'tone' && 'Tone'}
            </div>
          </div>
          
          {item.description && (
            <p className="text-sm text-white/70 mb-4 line-clamp-2">{item.description}</p>
          )}
          
          <div className="flex justify-between">
            <Button 
              size="sm" 
              className="h-8"
              style={{ backgroundColor: chakraColor, color: 'white' }}
              onClick={() => onPlay && onPlay(item.id)}
            >
              <Play className="h-4 w-4 mr-1" />
              {item.type === 'journey' ? 'Begin' : item.type === 'tone' ? 'Listen' : 'Read'}
            </Button>
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8"
                onClick={() => onSave && onSave(item.id)}
              >
                <BookmarkPlus className={`h-4 w-4 ${item.saved ? 'text-yellow-400' : 'text-white/70'}`} />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8"
                onClick={() => onShare && onShare(item.id)}
              >
                <Share className="h-4 w-4 text-white/70" />
              </Button>
              
              {item.upvotes !== undefined && (
                <div className="flex items-center justify-center h-8 px-1.5 text-xs text-white/70">
                  ✨ {item.upvotes}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GuideCard;
