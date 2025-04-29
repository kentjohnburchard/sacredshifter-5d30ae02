
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  BookOpen, 
  Calendar,
  Edit,
  Circle,
  ArrowRight,
  Tag
} from 'lucide-react';
import MoonPhaseDisplay from './MoonPhaseDisplay';
import AudioPreview from './AudioPreview';

export interface TimelineEntryProps {
  id: string;
  title: string;
  created_at: string;
  notes?: string | null;
  type: 'journal' | 'journey' | 'music' | 'intention';
  tag?: string | null;
  tags?: string[];
  frequency?: number | null;
  chakra?: string | null;
  audioUrl?: string | null;
  onEdit: (id: string) => void;
  onAction?: (id: string) => void;
  actionLabel?: string;
}

const getEntryColor = (type: string, chakra?: string | null) => {
  if (chakra) {
    switch(chakra.toLowerCase()) {
      case 'root': return 'from-red-500/20 to-red-700/5';
      case 'sacral': return 'from-orange-500/20 to-orange-700/5';
      case 'solar': return 'from-yellow-500/20 to-yellow-700/5';
      case 'heart': return 'from-green-500/20 to-green-700/5';
      case 'throat': return 'from-blue-500/20 to-blue-700/5';
      case 'third eye': return 'from-indigo-500/20 to-indigo-700/5';
      case 'crown': return 'from-purple-500/20 to-purple-700/5';
    }
  }
  
  switch(type) {
    case 'journal': return 'from-blue-500/20 to-blue-700/5';
    case 'journey': return 'from-purple-500/20 to-purple-700/5';
    case 'music': return 'from-pink-500/20 to-pink-700/5';
    case 'intention': return 'from-amber-500/20 to-amber-700/5';
    default: return 'from-purple-500/20 to-blue-500/5';
  }
}

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'journal': return <BookOpen className="h-5 w-5" />;
    case 'journey': return <Calendar className="h-5 w-5" />;
    case 'music': return <Music className="h-5 w-5" />;
    case 'intention': return <Circle className="h-5 w-5" />;
    default: return <BookOpen className="h-5 w-5" />;
  }
}

const getTypeLabel = (type: string) => {
  switch(type) {
    case 'journal': return 'Journal';
    case 'journey': return 'Journey';
    case 'music': return 'Music';
    case 'intention': return 'Intention';
    default: return 'Entry';
  }
}

const TimelineEntryCard: React.FC<TimelineEntryProps> = ({
  id,
  title,
  created_at,
  notes,
  type,
  tag,
  tags = [],
  frequency,
  chakra,
  audioUrl,
  onEdit,
  onAction,
  actionLabel = "Revisit"
}) => {
  const [showFullNotes, setShowFullNotes] = useState(false);
  const gradientClass = getEntryColor(type, chakra);
  const isLongText = notes && notes.length > 150;
  const displayText = showFullNotes || !isLongText ? notes : notes?.substring(0, 150) + "...";
  const allTags = tag ? [tag, ...(tags || [])] : tags || [];
  
  return (
    <Card className={`
      overflow-hidden border border-gray-500/10 shadow-md hover:shadow-lg transition-all
      bg-gradient-to-r ${gradientClass} backdrop-blur-md
      relative before:absolute before:inset-0 before:bg-black/5 before:z-0
    `}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400/40 to-blue-400/40" />
      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/20" />
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white/20" />
      
      <CardContent className="p-5 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex space-x-3 items-start">
            <div className={`
              p-2 rounded-full 
              ${type === 'journal' ? 'bg-blue-500/10' : 
                type === 'journey' ? 'bg-purple-500/10' : 
                type === 'music' ? 'bg-pink-500/10' : 
                'bg-amber-500/10'}
            `}>
              {getTypeIcon(type)}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white text-shadow-md">{title}</h3>
              <div className="mt-1">
                <MoonPhaseDisplay timestamp={created_at} />
              </div>
            </div>
          </div>
          
          <Badge className="capitalize bg-black/30 text-shadow-xs">
            {getTypeLabel(type)}
          </Badge>
        </div>
        
        {frequency && (
          <div className="mt-3 flex items-center">
            <Badge variant="outline" className="bg-purple-900/20 text-purple-200 border-purple-500/20 flex items-center gap-1 text-shadow-xs">
              <Music className="h-3 w-3" />
              {frequency}Hz
            </Badge>
          </div>
        )}
        
        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <Tag className="h-3.5 w-3.5 text-gray-400" />
            {allTags.map((tagItem, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="bg-blue-900/10 border-blue-500/20 text-blue-200 text-xs text-shadow-xs"
              >
                {tagItem}
              </Badge>
            ))}
          </div>
        )}
        
        {notes && (
          <div className="mt-3 text-gray-100/90">
            <p className="text-sm text-shadow-sm">{displayText}</p>
            {isLongText && (
              <button 
                onClick={() => setShowFullNotes(!showFullNotes)} 
                className="mt-1 text-xs text-purple-300 hover:text-purple-200 text-shadow-xs"
              >
                {showFullNotes ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
        
        {audioUrl && (
          <div className="mt-3">
            <AudioPreview 
              audioUrl={audioUrl} 
              title={`${frequency ? frequency + 'Hz frequency audio' : 'Audio'}`}
            />
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(id)}
            className="border-gray-500/30 text-gray-300 hover:bg-gray-800/30 bg-black/20 backdrop-blur-sm text-shadow-xs"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit Entry
          </Button>
          
          {onAction && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction(id)}
              className="border-purple-500/30 text-purple-200 hover:bg-purple-900/20 bg-black/10 backdrop-blur-sm text-shadow-xs"
            >
              <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineEntryCard;
