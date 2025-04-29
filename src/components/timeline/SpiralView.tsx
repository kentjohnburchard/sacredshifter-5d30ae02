
import React from 'react';
import { motion } from 'framer-motion';
import TimelineEntryCard, { TimelineEntryProps } from './TimelineEntryCard';

interface SpiralViewProps {
  entries: TimelineEntryProps[];
}

const SpiralView: React.FC<SpiralViewProps> = ({ entries }) => {
  if (!entries.length) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No entries found with current filters
      </div>
    );
  }

  // This is a simplified spiral layout
  // A true spiral would be more complex and likely use SVG or Canvas
  return (
    <div className="relative w-full min-h-[800px] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-40 blur-md"></div>
      </div>

      {entries.map((entry, index) => {
        // Calculate the position on a spiral
        // This is a very simplified approach
        const angle = index * (Math.PI / 6);
        const radius = 150 + index * 25;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={entry.id}
            className="absolute max-w-[350px]"
            style={{ 
              left: `calc(50% + ${x}px)`, 
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)' 
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <TimelineEntryCard {...entry} />
          </motion.div>
        );
      })}
      
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 italic">
        Note: This is a simplified spiral view. Scroll around to explore entries.
      </div>
    </div>
  );
};

export default SpiralView;
