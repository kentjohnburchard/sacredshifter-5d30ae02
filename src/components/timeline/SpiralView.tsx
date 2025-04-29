
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  BookOpen, 
  Calendar,
  Edit,
  ArrowRight,
} from 'lucide-react';
import MoonPhaseDisplay from './MoonPhaseDisplay';
import AudioPreview from './AudioPreview';
import { TimelineEntryProps } from './TimelineEntryCard';

interface SpiralViewProps {
  entries: TimelineEntryProps[];
}

const SpiralView: React.FC<SpiralViewProps> = ({ entries }) => {
  const getEntryIcon = (type: string) => {
    switch(type) {
      case 'journal': return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'journey': return <Calendar className="h-4 w-4 text-purple-400" />;
      case 'music': return <Music className="h-4 w-4 text-pink-400" />;
      default: return <BookOpen className="h-4 w-4 text-blue-400" />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {entries.map((entry, index) => (
        <motion.div 
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex flex-col"
        >
          <Card className={`
            h-full border border-gray-500/10 shadow-md hover:shadow-lg transition-all
            bg-gradient-to-br 
            ${entry.type === 'journal' ? 'from-blue-500/10 to-blue-700/5' : 
              entry.type === 'journey' ? 'from-purple-500/10 to-purple-700/5' : 
              'from-pink-500/10 to-pink-700/5'}
            backdrop-blur-sm relative
          `}>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-purple-500/30"></div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2 items-center">
                  <div className={`
                    p-1 rounded-full
                    ${entry.type === 'journal' ? 'bg-blue-500/20' : 
                      entry.type === 'journey' ? 'bg-purple-500/20' : 
                      'bg-pink-500/20'}
                  `}>
                    {getEntryIcon(entry.type)}
                  </div>
                  <h3 className="font-medium text-white text-sm line-clamp-1">{entry.title}</h3>
                </div>
                
                <Badge className="capitalize text-xs bg-black/20 text-gray-300">
                  {entry.type}
                </Badge>
              </div>
              
              <div className="mt-1.5 mb-2">
                <MoonPhaseDisplay timestamp={entry.created_at} compact />
              </div>
              
              {entry.frequency && (
                <div className="flex items-center my-2">
                  <Badge variant="outline" className="bg-purple-900/20 text-purple-200 border-purple-500/20 text-xs">
                    {entry.frequency}Hz
                  </Badge>
                </div>
              )}
              
              {entry.notes && (
                <div className="mt-2 text-gray-300 text-xs line-clamp-2">
                  {entry.notes}
                </div>
              )}
              
              {entry.audioUrl && (
                <div className="mt-3 mb-3">
                  <AudioPreview 
                    audioUrl={entry.audioUrl} 
                    title={`${entry.frequency ? entry.frequency + 'Hz' : 'Audio'}`}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/30">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => entry.onEdit(entry.id)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/20 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                
                {entry.onAction && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => entry.onAction && entry.onAction(entry.id)}
                    className="text-purple-300 hover:text-purple-200 hover:bg-purple-700/20 text-xs"
                  >
                    {entry.actionLabel}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SpiralView;
