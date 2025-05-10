
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { JourneyTimelineItem } from '@/types/journey';

export interface TimelineEntryCardProps {
  item: JourneyTimelineItem;
}

const TimelineEntryCard: React.FC<TimelineEntryCardProps> = ({ item }) => {
  // Format the date for display
  const formattedDate = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });
  
  return (
    <div className="p-3 bg-black/40 border border-gray-800/50 rounded-lg hover:border-purple-500/30 transition-all">
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-medium text-white">{item.title}</h4>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {item.tag && (
          <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-300">
            {item.tag}
          </span>
        )}
        
        {item.chakra && (
          <span className="text-xs px-2 py-0.5 bg-purple-900/50 border border-purple-500/20 rounded-full text-gray-200">
            {item.chakra}
          </span>
        )}
      </div>
      
      {item.notes && (
        <p className="mt-2 text-xs text-gray-400">{item.notes}</p>
      )}
    </div>
  );
};

export default TimelineEntryCard;
